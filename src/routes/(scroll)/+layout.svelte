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

	let stats = {
		gamesPlayed: 0,
		wins: 0,
		maxStreak: 0
	};


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
	const savedStats = localStorage.getItem('wordleStats');
  if (savedStats) {
    try {
      stats = JSON.parse(savedStats);
    } catch(e) {
      console.error('Failed to parse stats from localStorage', e);
    }
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
	<div class="right-controls">
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
    <div class="avatar-wrapper" on:click={toggleMenu}>
      <img src="https://api.dicebear.com/7.x/identicon/svg?seed={currentUser.username}" alt="Avatar" class="avatar" />
    </div>
	{#if showMenu}
  <div class="dropdown">
	<div class="dropdown-header">{currentUser.username}</div>
    <div class="stats-section">
      <h3>Stats</h3>
{#if stats}
  <p>Games Played: {stats.gamesPlayed}</p>
  <p>Win %: {stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0}%</p>
  <p>Longest Streak: {stats.maxStreak}</p>
{:else}
  <p>Loading stats...</p>
{/if}

    </div>
    <hr />
    <button on:click={logout}>Logout</button>
  </div>
{/if}
  </div>
{/if}
</div>
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

.right-controls {
  display: flex;
  align-items: center;
  gap: 16px; /* lagom avstånd mellan toggle och user-menu */
}

.user-menu button {
  background: none;
  border: none;
  color: white;
  font-weight: 500;
  cursor: pointer;
  padding: 8px;
}

.avatar-wrapper {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #0ff;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.4);
  transition: box-shadow 0.3s ease;
}

.avatar-wrapper:hover {
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.7);
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: #1f1f1f;
  border-radius: 6px;
  padding: 12px 16px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.4);
  width: 220px;
  color: white;
  font-size: 0.9rem;
  user-select: none;
}

.stats-section h3 {
  margin: 0 0 8px 0;
  font-weight: 600;
  color: #7a5aff; /* neon-ish accent */
  text-shadow: 0 0 6px #7a5aff;
}

.stats-section p {
  margin: 4px 0;
  line-height: 1.3;
}

hr {
  border: none;
  border-top: 1px solid rgba(122, 90, 255, 0.3);
  margin: 12px 0;
}

.dropdown button {
  width: 100%;
  background: none;
  border: none;
  color: #ff6c6c;
  font-weight: 600;
  padding: 8px 0;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.dropdown button:hover {
  background-color: rgba(255, 108, 108, 0.2);
}


.dropdown-header {
  padding: 8px 16px;
  color: #0ff;
  font-weight: bold;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
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
  