import { getRandomNumber } from './utils.js';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;
document.body.appendChild(canvas);

const timeCountdown = document.getElementById('time-countdown');

let dots = [];
let time = 60;
let isGameOver = true;
let score = 0;
let countdown = null;

// Function to create a dot
function createDot() {
	if (dots.length < 3) {
		let newDot;
		let isOverlapping;

		do {
			newDot = {
				x: getRandomNumber(25, canvas.width - 50), // Ensure within canvas boundaries
				y: getRandomNumber(25, canvas.height - 50), // Ensure within canvas boundaries
				radius: 25,
			};

			isOverlapping = dots.some((dot) => {
				const distance = Math.sqrt(
					(newDot.x - dot.x) ** 2 + (newDot.y - dot.y) ** 2
				);
				return distance < newDot.radius + dot.radius; // Check for overlap
			});
		} while (isOverlapping);

		dots.push(newDot);
	}
}

// Function to draw dots
function drawDots() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	dots.forEach((dot) => {
		ctx.beginPath();
		ctx.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI);
		ctx.fillStyle = '#53dfd1';
		ctx.fill();
		ctx.closePath();
	});
}

// Function to handle clicks on the canvas
canvas.addEventListener('click', (event) => {
	const rect = canvas.getBoundingClientRect();
	const mouseX = event.clientX - rect.left;
	const mouseY = event.clientY - rect.top;

	if (
		isGameOver &&
		mouseX >= 350 &&
		mouseX <= 450 &&
		mouseY >= 250 &&
		mouseY <= 290
	) {
		resetGame();
	} else if (isGameOver && time <= 0) {
		return;
	}

	// Check if the click is inside any dot
	dots = dots.filter((dot) => {
		const distanceSquared = (mouseX - dot.x) ** 2 + (mouseY - dot.y) ** 2;
		if (distanceSquared > dot.radius ** 2) {
			return true; // Keep the dot if not clicked
		} else {
			score++;
			createDot(); // Replace the clicked dot with a new one
			return false; // Remove the clicked dot
		}
	});
});

// Function to draw the game over screen
function drawGameOver() {
	// Draw background with opacity
	ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Draw game over text
	ctx.fillStyle = 'white';
	ctx.font = '48px "Playpen Sans", cursive';
	ctx.textAlign = 'center';
	ctx.fillText('Game Over', canvas.width / 2, 100);

	let textScore = `Your Score: ${score}`;
	let highScore = parseInt(localStorage.getItem('highScoreDotClick'), 10) || 0;
	if (score > highScore) {
		localStorage.setItem('highScoreDotClick', score);
		textScore = `New High Score : ${score}!`;
	}
	// Draw final score
	ctx.fillStyle = 'white';
	ctx.font = '36px "Playpen Sans", cursive';
	ctx.fillText(textScore, canvas.width / 2, 200);

	// Draw reset button
	ctx.fillStyle = '#F51720';
	ctx.fillRect(350, 250, 100, 40);
	ctx.fillStyle = 'white';
	ctx.font = '20px "Playpen Sans", cursive';
	ctx.textAlign = 'center';
	ctx.fillText('Restart', canvas.width / 2, 275);
}

// Function to draw the start screen
function drawGameStart() {
	ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'white';
	ctx.font = '48px "Playpen Sans", cursive';
	ctx.fillText('Start Game!', 280, 200);

	// Draw ready button
	ctx.fillStyle = '#136F63';
	ctx.fillRect(350, 250, 100, 40);
	ctx.fillStyle = 'white';
	ctx.font = '20px "Playpen Sans", cursive';
	ctx.fillText('Ready', 370, 275);
}

// Function to reset the game
function resetGame() {
	isGameOver = false;
	score = 0;
	time = 60;
	countdown = null;
	gameLoop();
}

function gameLoop() {
	if (isGameOver || time <= 0) {
		endGame();
		return;
	}

	createDot();
	drawDots();
	startCountdown();
	requestAnimationFrame(gameLoop);
}

function endGame() {
	clearInterval(countdown);
	countdown = null;
	isGameOver = true;
	drawGameOver();
}

function startCountdown() {
	if (!countdown) {
		countdown = setInterval(() => {
			if (time <= 0) {
				endGame();
			} else {
				time--;
				timeCountdown.innerText = `Time left: ${time} seconds`;
			}
		}, 1000);
	}
}

function handleInput(e) {
	if (isGameOver) {
		if (e.code === 'Enter' || e.code === 'Space') {
			resetGame();
		}
	} else {
		if (e.code === 'Escape') {
			endGame();
		}
	}
}

drawGameStart();
document.addEventListener('keypress', handleInput);
