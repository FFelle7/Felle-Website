<script>
	import { onMount } from "svelte";
	import 'animate.css';
	
	let descriptionText = "Just testing a description for the title";
	let descriptionDisplay = "";
	let j = 0;

	let loginUsername = '';
	let loginPassword = '';

	let registerUsername = '';
	let registerEmail = '';
	let registerPassword = '';
	let registerConfirmPassword = '';

	
	function typeDescription() {
	  if (j < descriptionText.length) {
		descriptionDisplay += descriptionText.charAt(j);
		j++;
		setTimeout(typeDescription, 50);
	  }	
	}
	
	onMount(typeDescription);
  
	function scrollIntoView(event) {
	  event.preventDefault();
	  const target = event.currentTarget.dataset.target;
	  const el = document.querySelector(target);
	  if (!el) return;
	  el.scrollIntoView({ behavior: 'smooth' });
	}
  
	let isLogin = true;
	let isLoggedIn = false;

	let animationClass = "animate__zoomInDown"; // Start animation
  
	// Transition between login and register
	function switchToRegister() {
		animationClass = "animate__bounceOutDown"; // Move Out animate__zoomOutDown , animate__bounceOutLeft
		setTimeout(() => {
			isLogin = false;
			animationClass = "animate__zoomInDown"; // Move In animate__zoomInDown , animate__bounceInRight
		}, 500);
	}

	function switchToLogin() {
		animationClass = "animate__bounceOutDown"; // Move Out animate__zoomOutDown , animate__bounceOutLeft
		setTimeout(() => {
			isLogin = true;
			animationClass = "animate__zoomInDown"; // Move In animate__zoomInDown , animate__bounceInRight
		}, 500);
	}

	
	onMount(() => {
	  const canvas = document.getElementById("particleCanvas");
	  const ctx = canvas.getContext("2d");
  
	  canvas.width = window.innerWidth;
	  canvas.height = window.innerHeight;
  
	  let particlesArray = [];
	  const numberOfParticles = 50;
  
	  class Particle {
		constructor() {
		  this.x = Math.random() * canvas.width;
		  this.y = Math.random() * canvas.height;
		  this.size = Math.random() * 3 + 1;
		  this.speedX = Math.random() * 2 - 1;
		  this.speedY = Math.random() * 2 - 1;
		}
  
		update() {
		  this.x += this.speedX;
		  this.y += this.speedY;
  
		  if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
		  if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
		}
  
		draw() {
		  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
		  ctx.beginPath();
		  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		  ctx.fill();
		}
	  }
  
	  function initParticles() {
		for (let i = 0; i < numberOfParticles; i++) {
		  particlesArray.push(new Particle());
		}
	  }
  
	  function animateParticles() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		particlesArray.forEach((particle) => {
		  particle.update();
		  particle.draw();
		});
		requestAnimationFrame(animateParticles);
	  }
  
	  initParticles();
	  animateParticles();
	});

	function handleLogin() {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    if (user.username === loginUsername && user.password === loginPassword) {
		const isLoggedIn = localStorage.getItem('isLoggedIn');
	if (isLoggedIn === 'true') {
		alert('You are already logged in!');
	} else {alert("Login successful!");}
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      alert("Invalid credentials!");
    }
  } else {
    alert("No registered user found.");
  }
}

function handleRegister() {

  if (registerPassword !== registerConfirmPassword) {
    alert("Passwords do not match!");
    return;
  }
  
  const newUser = {
    username: registerUsername,
    email: registerEmail,
    password: registerPassword,
  };
  
  // Store the user data in localStorage
  localStorage.setItem('user', JSON.stringify(newUser));
  alert("Registration successful! You can now log in.");
  switchToLogin(); // Switch back to login form after successful registration
}

function handleLogout() {
	if (isLoggedIn === 'true') {
		localStorage.removeItem('isLoggedIn');
  		alert("You have logged out successfully.");}
		else { 
			alert("You are not logged in.")

		}
	}


	//Wordle
let targetWord = '';
let currentGuess = '';
let guesses = Array(6).fill(null); // six rows, initially empty
let currentRow = 0;
let gameOver = false;

const wordList = ["apple", "grape", "mango", "peach", "lemon", "melon", "berry", "plumb", "charm", "slick"];

function getRandomWords() {
  return wordList[Math.floor(Math.random() * wordList.length)];
}

onMount(() => {
  startNewGame();
  targetWord = getRandomWord(5);
  console.log(targetWord)
	console.log('Solution:', targetWord);
});

function handleWordleInput(e) {
  const val = e.target.value.toLowerCase();
  if (/^[a-z]{0,5}$/.test(val)) {
    currentGuess = val;
  }
}

async function submitGuess() {
  if (gameOver || currentGuess.length !== 5) return;

  const valid = await isValidWord(currentGuess);
  if (!valid) {
    alert('Not a real word');
    return;
  }

  const result = currentGuess.split('').map((char, i) => {
    if (char === targetWord[i]) return { letter: char, color: 'green' };
    if (targetWord.includes(char)) return { letter: char, color: 'yellow' };
    return { letter: char, color: 'gray' };
  });

  guesses[currentRow] = result;
  currentRow++;

  if (currentGuess === targetWord || currentRow >= 6) {
    gameOver = true;
  }

  currentGuess = '';
}

export async function isValidWord(word) {
  if (!word || word.length !== 5) return false;

  try {
    const res = await fetch(`https://api.datamuse.com/words?sp=${word}&max=1`);
    const data = await res.json();

    return data.length > 0 && data[0].word.toLowerCase() === word.toLowerCase();
  } catch (err) {
    console.error('Word check failed:', err);
    return false;
  }
}


function startNewGame() {
  targetWord = getRandomWord();
  guesses = Array(6).fill(null);
  currentGuess = '';
  currentRow = 0;
  gameOver = false; 
  usedKeys = {}
}

export async function getRandomWord(length = 5) {
	try {
		const res = await fetch(`https://api.datamuse.com/words?sp=${'?'.repeat(length)}&max=1000`);
		const words = await res.json();

		const cleanWords = words
			.map(w => w.word)
			.filter(w => /^[a-z]+$/.test(w)); // remove proper nouns, numbers, etc.

		const randomWord = cleanWords[Math.floor(Math.random() * cleanWords.length)];
		console.log(randomWord)
		targetWord = randomWord;
		return randomWord?.toLowerCase() || null;
	} catch (err) {
		console.error('Error fetching word:', err);
		return null;
	}
}


const keys = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
];

let usedKeys = {};

function handleKeyPress(key) {
  if (gameOver) return;

  if (key === 'Enter') {
    submitGuess();
    return;
  }

  if (key === 'Backspace') {
    currentGuess = currentGuess.slice(0, -1);
    return;
  }

  if (currentGuess.length < 5 && /^[A-Z]$/.test(key)) {
    currentGuess += key.toLowerCase();
  }
}

function updateUsedKeys() {
  const latest = guesses[currentRow - 1];
  if (!latest) return;

  for (const { letter, color } of latest) {
    const l = letter.toUpperCase();
    if (color === 'green') {
      usedKeys[l] = 'green';
    } else if (color === 'yellow' && usedKeys[l] !== 'green') {
      usedKeys[l] = 'yellow';
    } else if (!usedKeys[l]) {
      usedKeys[l] = 'gray';
    }
  }
}

$: if (currentRow > 0) updateUsedKeys();


</script>

<!-- HERO SECTION -->
<section id="landing" class="hero">
	<div class="overlay"></div>
	<div class="content">
		<h1 class="title-effect">Bertils, Hemsida</h1>
		<p class="shimmer typing-description">{descriptionDisplay}</p>
		<button class="cta-btn" data-target="#login" on:click={scrollIntoView}>
			Learn More
		</button>
		<button on:click={handleLogout}>Log out</button>
		
	</div>
</section>

<!-- LOGIN SECTION -->
<section id="login" class="login-section">
	<canvas id="particleCanvas"></canvas>
	<div class="login-container">
	  <div class="form-wrapper">
		<div class="form-container animate__animated {animationClass}">
			{#if isLogin}
			<form class="login-form" on:submit|preventDefault={handleLogin}>
				<h2>Sign in to Bertils</h2>
				<input type="text" placeholder="Username" required bind:value={loginUsername} />
				<input type="password" placeholder="Password" required bind:value={loginPassword} />
				<button type="submit">Sign in</button>
				
				<!-- OR Separator -->
				<div class="or-separator"> 
					<span>OR</span> 
				</div>
			
				<!-- Social Login Buttons -->
				<div class="social-login">
					<button class="google-login" style="border-radius: 16px;">
						<img src="https://img.icons8.com/m_rounded/512/FFFFFF/google-logo.png" alt="Google Icon" class="icon" style="height: 1.3em; margin-right: 8px; border-radius: 16px;" />
						Continue with Google</button>
					<button class="microsoft-login" style="border-radius: 16px;">
						<img src="https://img.icons8.com/ios11/600/FFFFFF/windows-10.png" alt="Microsoft Icon" class="icon" style="height: 1.3em; margin-right: 8px; border-radius: 16px;" />
						Continue with Microsoft</button>
				</div>
			
				<p>Don't have an account? <a style="font-weight: bold;" on:click={switchToRegister}>Sign Up</a></p>
			</form>
			
			{:else}
			  <form class="login-form" on:submit|preventDefault={handleRegister}>
				<h2>Create an Account</h2>
				<input type="text" placeholder="Username" required bind:value={registerUsername} />
				<input type="email" placeholder="Email" required bind:value={registerEmail} />
				<input type="password" placeholder="Password" required bind:value={registerPassword} />
				<input type="password" placeholder="Confirm Password" required bind:value={registerConfirmPassword} />
				<button type="submit">Sign Up</button>
				<p>Already have an account? <a style="font-weight: bold;" on:click={switchToLogin}>Login</a></p>
			  </form>
			{/if}
		  </div>
		  
	  </div>
	</div>
  </section>


  

<!-- WORDLE GAME -->
<section id="wordle" class="wordle-section">
	<div class="wordle-grid">
		{#each guesses as guess, i}
			<div class="wordle-row">
				{#if guess}
					{#each guess as g}
						<div class="wordle-tile {g.color}">{g.letter.toUpperCase()}</div>
					{/each}
				{:else}
					{#each Array(5) as _, j}
						<div class="wordle-tile">
							{#if i === currentRow && j < currentGuess.length}
								{currentGuess[j].toUpperCase()}
							{/if}
						</div>
					{/each}
				{/if}
			</div>
		{/each}
	
		{#if !gameOver}
			<input
				class="wordle-input"
				maxlength="5"
				bind:value={currentGuess}
				on:input={handleWordleInput}
				on:keydown={(e) => e.key === 'Enter' && submitGuess()}
				placeholder="Enter 5-letter word"
			/>
			<button on:click={submitGuess}>Submit</button>
		{:else}
			<p class="game-over">
				{guesses[currentRow - 1]?.map(g => g.letter).join('') === targetWord ? 'You win!' : `Game Over! Word was: ${targetWord.toUpperCase()}`}
			</p>
			<button on:click={startNewGame}>Restart</button>
		{/if}
	</div>	
	
	<div class="keyboard">
		{#each keys as row}
		  <div class="keyboard-row">
			{#each row as key}
			  <button
				class="key {usedKeys[key] || ''}"
				on:click={() => handleKeyPress(key)}
			  >
				{key}
			  </button>
			{/each}
		  </div>
		{/each}
	  </div>
	  
</section>

<style>
	/* GENERAL STYLES */
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		scroll-behavior: smooth;
	}
	#particleCanvas {
		position: absolute;
	}

	/* HERO */
	.hero {
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		position: relative;
		overflow: hidden;
		padding-top: 50px;
		background: radial-gradient(circle, #202057, #04040d);
	}

	.overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, rgba(0, 0, 50, 0.6), rgba(0, 0, 0, 0.9));
	}

	.content {
		position: relative;
		z-index: 2;
	}

	/* TITLE FADE EFFECT */
	.title-effect {
		font-size: 4rem;
		font-weight: 800;
		text-shadow: 0px 0px 20px rgba(255, 255, 255, 0.4);
		animation: fadeIn 2s ease-in-out;
		position: relative;
		top: -10px;
		color: white;
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(10px); }
		to { opacity: 1; transform: translateY(0); }
	}

	/* DESCRIPTION TYPING EFFECT */
	.typing-description {
		font-size: 1.5rem;
		background: linear-gradient(90deg, white, rgba(255, 255, 255, 0.5));
		background-size: 200% auto;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: shimmerAnim 2s infinite linear, fadeIn 3s ease-in-out;
		margin-top: 10px;
	}

	@keyframes shimmerAnim {
		0% { background-position: -200% center; }
		100% { background-position: 200% center; }
	}

	/* CTA BUTTON */
	.cta-btn {
		margin-top: 20px;
		padding: 12px 24px;
		font-size: 1.2rem;
		font-weight: 600;
		border: none;
		border-radius: 10px;
		background: linear-gradient(135deg, #122130, #0b5be1);
		color: white;
		box-shadow: 5px 5px 15px rgba(0, 150, 255, 0.5);
		transition: transform 0.2s ease-in-out, box-shadow 0.2s;
		cursor: pointer;
	}

	.cta-btn:hover {
		transform: scale(1.05);
		box-shadow: 8px 8px 20px rgba(0, 150, 255, 0.7);
	}

	/* LOGIN FORM */
	.login-section {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;
	position: relative;
	overflow: hidden;
	}

  /* Style for toggling between login and register forms */
   .login-form {
    width: 400px;
    padding: 40px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);
    text-align: center;
    position: relative;
  }

  .login-form input, .login-form button {
    width: 100%;
    margin: 10px 0;
    border-radius: 8px;
    border: none;
    font-size: 1rem;
    outline: none;
	color: rgba(255, 255, 255, 0.772);
	background-color: #0000001d;
  }

  .login-form button {
    background: linear-gradient(135deg, #38383800, #6c6c6c88);
	height: 2em;
    color: white;
    cursor: pointer;
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2),
                -3px -3px 5px rgba(255, 255, 255, 0.05);
  }

  .login-form button:hover {
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3),
                -5px -5px 10px rgba(255, 255, 255, 0.05);
  }

  .login-form {
    transition: transform 0.1s ease-out;
    backdrop-filter: blur(10px);
  }


	/* Subtle login panel animation */
	@keyframes glowPulse {
	0% {
		box-shadow: 0 0 10px rgba(0, 128, 255, 0.2);
	}
	50% {
		box-shadow: 0 0 20px rgba(0, 128, 255, 0.4);
	}
	100% {
		box-shadow: 0 0 10px rgba(0, 128, 255, 0.2);
	}
	}

	.login-form {
	animation: glowPulse 3s infinite alternate;
	}


	/* LOGIN SECTION BACKGROUND */
	.login-section {
		background: content-box radial-gradient(rgba(32, 32, 87, 0.351), rgb(0, 0, 0));}

	.login-form {
		transition: transform 0.1s ease-out;
		backdrop-filter: blur(10px);
	}

	.or-separator {
		margin: 15px 0;
		text-align: center;
		position: relative;
		font-weight: bold;
		color: rgba(255, 255, 255, 0.7);
	}

	.or-separator::before,
	.or-separator::after {
		content: "";
		display: inline-block;
		width: 40%;
		height: 1px;
		background: rgba(255, 255, 255, 0.3);
		vertical-align: middle;
		margin: 0 10px;
	}

	.social-login {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-bottom: 10px;
	}

	.google-login,
	.microsoft-login {
		width: 100%;
		padding: 10px;
		border-radius: 8px;
		border: none;
		font-size: 1rem;
		cursor: pointer;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.google-login {
		background: #ffffff;
		color: #000;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.microsoft-login {
		background: #2f2f2f;
		color: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	a {
		cursor: pointer;
	}

	
	/* WORDLE GAME */
	.wordle-section {
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		background: content-box radial-gradient(rgba(32, 32, 87, .5), rgb(0, 0, 0));
		color: white;
	}

	.wordle-grid {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.wordle-input {
		width: 200px;
		height: 40px;
		text-align: center;
		font-size: 1.5rem;
		margin: 10px;
		background: rgba(255, 255, 255, 0.1);
		border: none;
		color: white;
		border-radius: 5px;
	}

	.wordle-section button {
		padding: 10px;
		background: #201d3b;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		margin-top: 15px;
		font-weight: bold;
		transition: 0.3s;
	}

	.wordle-section button:hover {
		background: #d13800;
		transform: scale(1.05);
	}

	.wordle-row {
	display: flex;
	margin-bottom: 5px;
}

.wordle-tile {
	width: 40px;
	height: 40px;
	margin: 2px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	font-size: 1.2rem;
	border-radius: 4px;
	text-transform: uppercase;
	background-color: #333;
	color: white;
}

.wordle-tile.green {
	background-color: #6aaa64;
}

.wordle-tile.yellow {
	background-color: #c9b458;
}

.wordle-tile.gray {
	background-color: #787c7e;
}

.wordle-input {
	margin-top: 10px;
	font-size: 1.1rem;
	padding: 5px;
	width: 220px;
	text-transform: uppercase;
}

button {
	margin-left: 10px;
	padding: 6px 10px;
	font-size: 1rem;
	cursor: pointer;
}

.game-over {
	margin-top: 20px;
	font-size: 1.4rem;
	font-weight: bold;
	color: #ff7675;
}

.keyboard {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.keyboard-row {
  display: flex;
  margin-bottom: 5px;
}

.key {
  margin: 2px;
  padding: 10px 12px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  text-transform: uppercase;
  background-color: #444;
  color: white;
  cursor: pointer;
  min-width: 40px;
}

.key.green {
  background-color: #6aaa64;
}

.key.yellow {
  background-color: #c9b458;
}

.key.gray {
  background-color: #787c7e;
}



</style>


stuff to add:
password visibility toggle
Auto-focus on the first input field
User menu (see name, logout and more) top right
User menu dropdown