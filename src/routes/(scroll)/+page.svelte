<script>
	import { onMount } from "svelte";
	import 'animate.css';
	import { base } from '$app/paths'
	import confetti from 'canvas-confetti';

	let descriptionText = "Spela Wordle med stil – mörkt läge, animerade effekter och en unik spelupplevelse.";
	let descriptionDisplay = "";
	let j = 0;

	let loginUsername = '';
	let loginPassword = '';
	let showPassword = false;

	let registerUsername = '';
	let registerEmail = '';
	let registerPassword = '';
	let registerConfirmPassword = '';

	// Confetti launcher
  function launchConfetti() {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      scalar: 1.2,
    });
  }

  // Flag to prevent multiple triggers
  let confettiLaunched = false;

  // Reactive watch for winning condition + gameOver flag
  $: if (
    gameOver &&
    !confettiLaunched &&
    guesses[currentRow - 1]?.map(g => g.letter).join('').toUpperCase() === targetWord.toUpperCase()
  ) {
    launchConfetti();
    confettiLaunched = true;
  }

	
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
	/*	let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';*/
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
	const sections = document.querySelectorAll('.fade-in-section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        entry.target.classList.remove('is-visible');
      }
    });
  }, {
    threshold: 0.1
  });

  sections.forEach(section => observer.observe(section));  
		
	const canvas = document.getElementById("particleCanvas");
	  const ctx = canvas.getContext("2d");
  
	  canvas.width = window.innerWidth;
	  canvas.height = window.innerHeight;
  
	  isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

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

	  handleScroll(); // initiera rätt position
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };

});

function handleLogin() {
  const storedUser = localStorage.getItem('user');
  		location.reload(); // clean reset


  if (!storedUser) {
    alert("No registered user found.");
    return;
  }

  const user = JSON.parse(storedUser);

  if (user.username === loginUsername && user.password === loginPassword) {
    if (isLoggedIn) {
      alert("You're already logged in.");
    } else {
      isLoggedIn = true;
      localStorage.setItem('isLoggedIn', 'true');
      alert("Login successful!");
    }
  } else {
    alert("Invalid credentials.");
  }
}


function handleRegister() {
  const existing = localStorage.getItem('user');
  if (existing) {
    const existingUser = JSON.parse(existing);
    if (existingUser.username === registerUsername) {
      alert("Username already taken.");
      return;
    }
  }

  if (registerPassword !== registerConfirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  const newUser = {
    username: registerUsername,
    email: registerEmail,
    password: registerPassword,
  };

  localStorage.setItem('user', JSON.stringify(newUser));
  alert("Registration successful! You can now log in.");
  switchToLogin();
}


function handleLogout() {
  if (isLoggedIn) {
    localStorage.removeItem('isLoggedIn');
    isLoggedIn = false;
    alert("You have logged out successfully.");
  } else {
    alert("You are not logged in.");
  }
}

let isInvalid = false;

	function triggerShake() {
		isInvalid = true;
		setTimeout(() => {
			isInvalid = false;
		}, 500);
	}



	//Wordle
let targetWord = '';
let currentGuess = '';
let guesses = Array(6).fill(null); // six rows, initially empty
let currentRow = 0;
let gameOver = false;


function getRandomWords() {
  return wordList[Math.floor(Math.random() * wordList.length)];
}

onMount(() => {
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
    /*alert('Not a real word');*/
	triggerShake();
    return;
  }

  const result = currentGuess.split('').map((char, i) => {
  let color = 'gray';
  if (char === targetWord[i]) {
    color = 'green';
  } else if (targetWord.includes(char)) {
    color = 'yellow';
  }

  return { letter: char, color, flip: true };
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
  confettiLaunched = false;
  usedKeys = {}
  if (confirm("Restart game?")) {
	restartGame();
	}
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

let offsetX = 0;
  let loginBox;
  $: transformStyle = `transform: translateX(${offsetX}px); transition: transform 0.2s ease;`;

function handleScroll() {
  if (!loginBox) return;

  const windowHeight = window.innerHeight;
  const scrollY = window.scrollY || window.pageYOffset;

  const rect = loginBox.getBoundingClientRect();
  const boxTop = rect.top + scrollY;
  const boxMiddle = boxTop + rect.height / 2;

  const viewportQuarter = scrollY + windowHeight * 0.25;
  const viewportThreeQuarter = scrollY + windowHeight * 0.75;

  if (boxMiddle < viewportQuarter) {
    offsetX = window.innerWidth;
  } else if (boxMiddle > viewportThreeQuarter) {
    offsetX = -window.innerWidth;
  } else {
    offsetX = 0;
  }
}

</script>

<!-- HERO SECTION -->
<section id="landing" class="hero fade-in-section">
	<div class="overlay"></div>
	<div class="content">
		<h1 class="title-effect">Bertils Wordle – Spela och vinn!</h1>
		<p class="shimmer typing-description">{descriptionDisplay}</p>
		<button class="cta-btn" data-target="#login" on:click={scrollIntoView}>
			Learn More
		</button>		
	</div>
</section>

<!-- LOGIN SECTION -->
<section id="login" class="login-section fade-in-section">
	<canvas id="particleCanvas"></canvas>
	<div class="overlay2"></div>
	<div
  class="login-container login-box"
  bind:this={loginBox}
  style={transformStyle}>
	  <div class="form-wrapper">
		<div class="form-container animate__animated {animationClass}">
			{#if isLogin}
			<form class="login-form" on:submit|preventDefault={handleLogin}>
				<h2>Sign in to Bertils</h2>
				<input type="text" placeholder="Username" minlength="3" maxlength="16" required bind:value={loginUsername} />
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
				<input type="text" placeholder="Username" minlength="3" maxlength="16" required bind:value={registerUsername} />
				<input type="email" placeholder="Email" required bind:value={registerEmail}  />
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
<section id="wordle" class="wordle-section fade-in-section">
	<div class="overlay3"></div>
	<div class="wordle-grid">
		{#each guesses as guess, i}
			<div class="wordle-row {isInvalid ? 'shake' : ''}">
				{#if guess}
					{#each guess as g}
						<div class="wordle-tile {g.color} {g.flip ? 'flip' : ''}">{g.letter.toUpperCase()}</div>
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
  {guesses[currentRow - 1]?.map(g => g.letter).join('').toUpperCase() === targetWord.toUpperCase()
    ? 'You win!'
    : `Game Over! Word was: ${targetWord.toUpperCase()}`}
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
		z-index: 0;
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
		/*background: radial-gradient(circle, #202057, #04040d);*/
		background-image: url("/images/background1.png");
	}

	@keyframes flip {
  0% {
    transform: rotateX(0);
  }
  50% {
    transform: rotateX(90deg);
    background-color: #333;
    color: transparent;
  }
  100% {
    transform: rotateX(0);
    color: white;
  }
}

.wordle-tile.flip {
  animation: flip 0.6s ease-in-out;
  transform-style: preserve-3d;
}


	.overlay {
		position: absolute;
		inset: 0;
		background: #000000;
		background: linear-gradient(358deg, rgba(0, 0, 0, 1) 0%, rgba(80, 183, 123, 0) 42%, rgba(87, 199, 133, 0) 78%, rgba(0, 0, 0, 0) 100%);
	}

	
	.overlay2 {
		position: absolute;
		top: 100vh;
		inset: 0;
		background: #000000;
		background: linear-gradient(358deg, rgba(0, 0, 0, 1) 0%, rgba(80, 183, 123, 0) 37%, rgba(87, 199, 133, 0) 78%, rgba(0, 0, 0, 1) 100%);
	}

	.overlay3 {
		position: absolute;
		inset: 0;
		background: #000000;
		background:
  			linear-gradient(336deg, rgba(0, 0, 0, 0) 0%, rgba(80, 183, 123, 0) 0%, rgba(87, 199, 133, 0) 64%, rgba(0, 0, 0, 1) 100%),
  			linear-gradient(24deg, rgba(0, 0, 0, 0) 0%, rgba(80, 183, 123, 0) 0%, rgba(87, 199, 133, 0) 64%, rgba(0, 0, 0, 1) 100%);
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
    background: linear-gradient(135deg, #38383800, #a3a1a139);
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
		/*background: content-box radial-gradient(rgba(32, 32, 87, 0.351), rgb(0, 0, 0));*/
		background-image: url("{base}/images/background4.png");
	}

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
		position: relative;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		/*background: content-box radial-gradient(rgba(32, 32, 87, .5), rgb(0, 0, 0));*/
		background-image: url("{base}/images/background2.png");
		color: white;
	}

	.wordle-grid {
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 4;
	}

	.wordle-input {
		width: 200px;
		height: 40px;
		text-align: center;
		font-size: 1.5rem;
		margin: 10px;
		background: rgba(0, 0, 0, 0.326);
		border: none;
		color: white;
		border-radius: 5px;
	}

	.wordle-section button {
		padding: 10px;
		background: #00000036;
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

.shake {
	animation: shake 0.4s ease;
	background-color: rgba(255, 0, 0, 0.1);
}

@keyframes shake {
	0% { transform: translateX(0); }
	20% { transform: translateX(-5px); }
	40% { transform: translateX(5px); }
	60% { transform: translateX(-5px); }
	80% { transform: translateX(5px); }
	100% { transform: translateX(0); }
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
	background:
  	linear-gradient(336deg, rgba(0, 0, 0, 0.062) 0%, rgba(80, 183, 123, 0) 0%, rgba(87, 199, 133, 0) 64%, rgba(0, 0, 0, 0.262) 100%),
  	linear-gradient(24deg, rgba(0, 0, 0, 0.062) 0%, rgba(80, 183, 123, 0) 0%, rgba(87, 199, 133, 0) 64%, rgba(0, 0, 0, 0.262) 100%),
  	linear-gradient(156deg, rgba(0, 0, 0, 0.062) 0%, rgba(80, 183, 123, 0) 0%, rgba(87, 199, 133, 0) 64%, rgba(0, 0, 0, 0.262) 100%),
  	linear-gradient(204deg, rgba(0, 0, 0, 0.062) 0%, rgba(80, 183, 123, 0) 0%, rgba(87, 199, 133, 0) 64%, rgba(0, 0, 0, 0.262) 100%);
  	background-color: #00000046;
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
  z-index: 4;
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

@media (max-width: 600px) {
  .wordle-grid {
    width: 90vw;
    grid-template-columns: repeat(5, 1fr);
  }

  .login-form {
    width: 90%;
    padding: 20px;
  }
}

.login-box {
  position: relative;
  will-change: transform;
}

/* Startläge: osynlig och flyttad lite ned */
.fade-in-section {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

/* När synlig i viewport */
.fade-in-section.is-visible {
  opacity: 1;
  transform: none;
}
</style>

skaffa lose animations, bokstäverna sugs ut i rymden och får ett litet blink som i gamla filmer.
sounds effects

rörande planets och blinkade stjärnor.
Better atmosphere
"Looping animation of a galaxy-themed background with slowly rotating planets, twinkling stars, and a layered parallax effect. Deep space colors (blues, purples, black), subtle nebula glow, and occasional shooting stars. Smooth transitions, cinematic mood, clean aesthetic. Matches sleek UI design with neon accents."

Profil menu
Icon istället för nanm, se namn efter man öppnar profilen.
"Minimalist user profile dropdown menu with a round avatar icon only. When clicked, reveal the full name and options like logout or settings in a floating menu. Sleek, dark theme UI with soft shadows and glowing hover effects. Should match a futuristic/neon space aesthetic."
Wordle Stats
