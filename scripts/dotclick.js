// Get DOM elements
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;
document.body.appendChild(canvas);

const titleHeader = document.getElementById('title');
const scoreText = document.getElementById('score');

titleHeader.innerText = 'Click the Dots!';

let dots = [];
let time = 10;
let isGameOver = false;
let score = 0;
let countdown = null;

// Function to create a dot
function createDot() {
	if (dots.length < 3) {
		let newDot;
		let isOverlapping;

		do {
			newDot = {
				x: Math.random() * (canvas.width - 50) + 25, // Ensure within canvas boundaries
				y: Math.random() * (canvas.height - 50) + 25, // Ensure within canvas boundaries
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
		ctx.fillStyle = 'red';
		ctx.fill();
		ctx.closePath();
	});
}

// Function to handle clicks on the canvas
canvas.addEventListener('click', (event) => {
	const rect = canvas.getBoundingClientRect();
	const mouseX = event.clientX - rect.left;
	const mouseY = event.clientY - rect.top;

	// Check if the click is inside any dot
	dots = dots.filter((dot) => {
		const distanceSquared = (mouseX - dot.x) ** 2 + (mouseY - dot.y) ** 2;
		if (distanceSquared > dot.radius ** 2) {
			return true; // Keep the dot if not clicked
		} else {
			score++;
			scoreText.innerText = `Score: ${score}`;
			createDot(); // Replace the clicked dot with a new one
			return false; // Remove the clicked dot
		}
	});

	// Check if the reset button is clicked
	if (
		isGameOver &&
		mouseX >= 350 &&
		mouseX <= 450 &&
		mouseY >= 250 &&
		mouseY <= 290
	) {
		resetGame();
	}
});

// Function to draw the game over screen
function drawGameOver() {
	ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'white';
	ctx.font = '48px Arial';
	ctx.fillText('Game Over!', 275, 200);

	// Draw reset button
	ctx.fillStyle = '#290628';
	ctx.fillRect(350, 250, 100, 40);
	ctx.fillStyle = 'white';
	ctx.font = '20px Arial';
	ctx.fillText('Reset', 375, 275);
}

// Function to draw the start screen
function drawGameStart() {
	ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'white';
	ctx.font = '48px Arial';
	ctx.fillText('Start Game!', 275, 200);

	// Draw ready button
	ctx.fillStyle = '#136F63';
	ctx.fillRect(350, 250, 100, 40);
	ctx.fillStyle = 'white';
	ctx.font = '20px Arial';
	ctx.fillText('Ready', 375, 275);

	isGameOver = true;
}

// Function to reset the game
function resetGame() {
	isGameOver = false;
	score = 0;
	time = 10;
	dots = [];
	countdown = null;
	gameLoop();
}

// Main game loop
function gameLoop() {
	if (isGameOver || time <= 0) {
		isGameOver = true;
		scoreText.innerText = `Score: ${score}`;
		drawGameOver();
		return;
	}

	createDot();
	drawDots();

	if (!countdown) {
		countdown = setInterval(() => {
			if (time <= 0) {
				clearInterval(countdown);
				countdown = null;
				isGameOver = true;
				drawGameOver();
			} else {
				time--;
				titleHeader.innerText = `Time left: ${time} seconds`;
			}
		}, 1000);
	}

	requestAnimationFrame(gameLoop);
}

// Start the game
drawGameStart();
