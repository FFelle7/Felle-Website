<script>
	export let letter = '';
	export let status = ''; // 'correct', 'present', 'absent'
	export let flip = false;
</script>

<div class="tile {status} {flip ? 'flip' : ''}">
	{letter}
</div>

<style>
.tile {
	width: 50px;
	height: 50px;
	border: 2px solid #444;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.5rem;
	font-weight: bold;
	text-transform: uppercase;
	transition: background-color 0.3s, border-color 0.3s;
	background: #111;
	color: white;
}

.tile.correct {
	background: #6aaa64;
	border-color: #6aaa64;
}

.tile.present {
	background: #c9b458;
	border-color: #c9b458;
}

.tile.absent {
	background: #3a3a3c;
	border-color: #3a3a3c;
}

.flip {
	animation: flip 0.6s ease forwards;
}

@keyframes flip {
	0% {
		transform: rotateX(0);
	}
	50% {
		transform: rotateX(90deg);
	}
	100% {
		transform: rotateX(0);
	}
}
</style>
