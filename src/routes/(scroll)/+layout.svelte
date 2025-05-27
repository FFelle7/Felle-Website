<script>
	import '../../app.postcss';
	import { onMount } from "svelte";
	import { base } from '$app/paths'
  
	let isDark = true;
	let currentUser = null;
	let showMenu = false;
  
	function toggleTheme() {
		isDark = !isDark;
		document.documentElement.classList.toggle('dark', isDark);
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
	}

	function toggleMenu() {
		showMenu = !showMenu;
	}

	function logout() {
    	localStorage.setItem('isLoggedIn', 'false');
		currentUser = null;
		location.reload(); // clean reset
	}

	onMount(() => {
	const savedTheme = localStorage.getItem('theme');
	if (savedTheme === 'light') isDark = false;
	document.documentElement.classList.toggle('dark', isDark);

	const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
	if (loggedIn) {
		currentUser = JSON.parse(localStorage.getItem('user'));
	} else {
		currentUser = null;
	}
});


  
	// Smooth scrolling
	function scrollIntoView({ target }) {
	  const el = document.querySelector(target.getAttribute('href'));
	  if (!el) return;
	  el.scrollIntoView({ behavior: 'smooth' });
	}
  </script>
  
  <nav class="navbar">
	<div class="logo">
	  <span>Bertils</span>
	</div>
	<ul>
	  <li><a href="#landing" on:click|preventDefault={scrollIntoView}>Home</a></li>
	  <li><a href="#login" on:click|preventDefault={scrollIntoView}>Login</a></li>
	  <li><a href="#wordle" on:click|preventDefault={scrollIntoView}>Wordle</a></li>
	</ul>
	
	<!-- Dark Mode / Light Mode Toggle -->
	<button class="theme-toggle" on:click={toggleTheme}>
	  <span class="sr-only">Toggle Dark Mode</span>
	  {#if isDark}
		🌙
	  {:else}
		🌞
	  {/if}
	</button>
	{#if currentUser}
  <div class="user-menu">
	<button on:click={toggleMenu}>
	  {currentUser.username} ⌄
	</button>
	{#if showMenu}
	  <div class="dropdown">
		<button on:click={logout}>Logout</button>
	  </div>
	{/if}
  </div>
{/if}

  </nav>
  
  <main class="bg-gradient text-white font-inter">
	<slot />
  </main>
  
  <style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');
  
	/* Navbar */
	.navbar {
	  position: fixed;
	  top: 0;
	  left: 0;
	  width: 100%;
	  padding: 16px 5%;
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  background: rgba(0, 0, 20, 0.2);
	  backdrop-filter: blur(2px);
	  z-index: 100;
	  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	  transition: background-color 0.3s;
	  opacity: 0;
	  animation: navbarIntro 1s forwards;
	}

	.user-menu {
  position: relative;
}

.user-menu button {
  background: none;
  border: none;
  color: white;
  font-weight: 500;
  cursor: pointer;
  padding: 8px;
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: #1f1f1f;
  border-radius: 6px;
  padding: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.dropdown button {
  width: 100%;
  background: none;
  border: none;
  color: white;
  text-align: left;
  padding: 6px 12px;
  cursor: pointer;
}

.dropdown button:hover {
  background: rgba(255,255,255,0.1);
}

  
	/* Logo Styling */
	.navbar .logo {
	  font-size: 1.5rem;
	  font-weight: 600;
	  color: #ffffff;
	}
  
	/* Navbar links */
	.navbar ul {
	  display: flex;
	  gap: 25px;
	}
  
	.navbar ul li {
	  list-style: none;
	}
  
	.navbar ul li a {
	  text-decoration: none;
	  color: white;
	  font-weight: 500;
	  font-size: 1rem;
	  padding: 8px 15px;
	  border-radius: 25px;
	  position: relative;
	  transition: all 0.3s ease;
	  display: inline-block;
	}
  
	/* Hover effects: Scaling and underline animation */
	.navbar ul li a::before {
	  content: '';
	  position: absolute;
	  bottom: 0;
	  left: 0;
	  width: 0%;
	  height: 2px;
	  background: #7a5aff;
	  transition: width 0.3s ease;
	}
  
	.navbar ul li a:hover {
	  transform: scale(1.1);
	  color: #7a5aff;
	  background-color: rgba(122, 90, 255, 0.1);  /* subtle background change */
	}
  
	.navbar ul li a:hover::before {
	  width: 100%;
	}
  
	/* Dark Mode Toggle Button */
	.theme-toggle {
	  background: transparent;
	  border: none;
	  color: white;
	  font-size: 1.5rem;
	  cursor: pointer;
	  padding: 8px 16px;
	  border-radius: 50%;
	  transition: background-color 0.3s;
	}
  
	.theme-toggle:hover {
	  background-color: rgba(255, 255, 255, 0.1);
	}
  
	/* Background Animation */
	.bg-gradient {
	  background: linear-gradient(-45deg, #1f2a44, #020617, black);
	  animation: gradientShift 6s infinite alternate;
	}
  
	@keyframes gradientShift {
	  0% {
		background: linear-gradient(-45deg, #1f2a44, #020617, black);
	  }
	  100% {
		background: linear-gradient(-45deg, #212b46, #010409, black);
	  }
	}
	/* Intro Animation for Navbar */
	@keyframes navbarIntro {
	  0% {
		opacity: 0;
		transform: translateY(-50px);
	  }
	  100% {
		opacity: 1;
		transform: translateY(0);
	  }
	}
  </style>
  