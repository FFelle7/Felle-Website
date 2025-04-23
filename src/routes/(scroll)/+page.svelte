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

</script>

<!-- HERO SECTION -->
<section id="landing" class="hero">
	<div class="overlay"></div>
	<div class="content">
		<h1 class="title-effect">Temporary, title</h1>
		<p class="shimmer typing-description">{descriptionDisplay}</p>
		<button class="cta-btn" data-target="#login" on:click={scrollIntoView}>
			Get Started
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
	<h2>Wordle Game</h2>
	<div class="wordle-grid">
		<input type="text" maxlength="5" class="wordle-input" />
		<button>Submit</button>
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
		background: #ff4500;
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
</style>


stuff to add:
password visibility toggle
Auto-focus on the first input field
User menu (see name, logout and more) top right
User menu dropdown