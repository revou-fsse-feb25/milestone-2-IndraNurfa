import { getRandomNumber, updateLeaderboard, getLeaderboard } from './utils.js';

class DotClickGame {
	constructor() {
		// DOM Elements
		this.canvas = document.getElementById('myCanvas');
		this.ctx = this.canvas.getContext('2d');
		this.timeCountdown = document.getElementById('time-countdown');

		// Canvas Dimensions
		this.canvas.width = 800;
		this.canvas.height = 400;

		// Game Variables
		this.dots = [];
		this.time = 10;
		this.isGameOver = true;
		this.score = 0;
		this.countdown = null;
		this.leaderboardName = 'highScoreDC';
		this.currentUsername = localStorage.getItem('username') || 'Guest';

		// Initialize Event Listeners
		this.initEventListeners();

		// Draw Start Screen
		this.drawGameStart();
	}

	// Function to create a dot
	createDot() {
		if (this.dots.length < 3) {
			let newDot;
			let isOverlapping;

			do {
				newDot = {
					x: getRandomNumber(25, this.canvas.width - 50),
					y: getRandomNumber(25, this.canvas.height - 50),
					radius: 25,
				};

				isOverlapping = this.dots.some((dot) => {
					const distance = Math.sqrt(
						(newDot.x - dot.x) ** 2 + (newDot.y - dot.y) ** 2
					);
					return distance < newDot.radius + dot.radius;
				});
			} while (isOverlapping);

			this.dots.push(newDot);
		}
	}

	// Function to draw dots
	drawDots() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.dots.forEach((dot) => {
			this.ctx.beginPath();
			this.ctx.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI);
			this.ctx.fillStyle = '#53dfd1';
			this.ctx.fill();
			this.ctx.closePath();
		});
	}

	// Function to handle clicks on the canvas
	handleCanvasClick(event) {
		const rect = this.canvas.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;

		if (
			this.isGameOver &&
			mouseX >= 350 &&
			mouseX <= 450 &&
			mouseY >= 250 &&
			mouseY <= 290
		) {
			this.resetGame();
		} else if (this.isGameOver && this.time <= 0) {
			return;
		}

		// Check if the click is inside any dot
		this.dots = this.dots.filter((dot) => {
			const distanceSquared = (mouseX - dot.x) ** 2 + (mouseY - dot.y) ** 2;
			if (distanceSquared > dot.radius ** 2) {
				return true; // Keep the dot if not clicked
			} else {
				this.score++;
				this.createDot(); // Replace the clicked dot with a new one
				return false; // Remove the clicked dot
			}
		});
	}

	// Function to draw the game over screen
	drawGameOver() {
		this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.ctx.fillStyle = 'white';
		this.ctx.font = '48px "Playpen Sans", cursive';
		this.ctx.textAlign = 'center';
		this.ctx.fillText('Game Over', this.canvas.width / 2, 100);

		let textScore = `Your Score: ${this.score}`;
		const highScore =
			parseInt(localStorage.getItem('highScoreDotClick'), 10) || 0;
		if (this.score > highScore) {
			localStorage.setItem('highScoreDotClick', this.score);
			textScore = `New High Score : ${this.score}!`;
		}

		this.ctx.fillStyle = 'white';
		this.ctx.font = '36px "Playpen Sans", cursive';
		this.ctx.fillText(textScore, this.canvas.width / 2, 200);

		this.ctx.fillStyle = '#F51720';
		this.ctx.fillRect(350, 250, 100, 40);
		this.ctx.fillStyle = 'white';
		this.ctx.font = '20px "Playpen Sans", cursive';
		this.ctx.fillText('Restart', this.canvas.width / 2, 275);
	}

	// Function to draw the start screen
	drawGameStart() {
		this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = 'white';
		this.ctx.font = '48px "Playpen Sans", cursive';
		this.ctx.fillText('Start Game!', 280, 200);

		this.ctx.fillStyle = '#136F63';
		this.ctx.fillRect(350, 250, 100, 40);
		this.ctx.fillStyle = 'white';
		this.ctx.font = '20px "Playpen Sans", cursive';
		this.ctx.fillText('Ready', 370, 275);
	}

	// Function to reset the game
	resetGame() {
		this.isGameOver = false;
		this.score = 0;
		this.time = 10;
		this.countdown = null;
		this.gameLoop();
	}

	// Main game loop
	gameLoop() {
		if (this.isGameOver || this.time <= 0) {
			this.endGame();
			return;
		}

		this.createDot();
		this.drawDots();
		this.startCountdown();
		requestAnimationFrame(this.gameLoop.bind(this));
	}

	// End the game
	async endGame() {
		clearInterval(this.countdown);
		this.countdown = null;
		this.isGameOver = true;
		this.drawGameOver();
		const data = { username: this.currentUsername, score: this.score };
		await updateLeaderboard(this.leaderboardName, data);
		await getLeaderboard(this.leaderboardName);
	}

	// Start the countdown timer
	startCountdown() {
		if (!this.countdown) {
			this.countdown = setInterval(() => {
				if (this.time <= 0) {
					this.endGame();
				} else {
					this.time--;
					this.timeCountdown.innerText = `Time left: ${this.time} seconds`;
				}
			}, 1000);
		}
	}

	// Handle keyboard input
	handleInput(e) {
		if (this.isGameOver) {
			if (e.code === 'Enter' || e.code === 'Space') {
				this.resetGame();
			}
		} else {
			if (e.code === 'Escape') {
				this.endGame();
			}
		}
	}

	// Initialize event listeners
	initEventListeners() {
		this.canvas.addEventListener('click', this.handleCanvasClick.bind(this));
		document.addEventListener('keypress', this.handleInput.bind(this));
	}
}

// Initialize the game
const game = new DotClickGame();
document.addEventListener('DOMContentLoaded', () => {
	getLeaderboard(game.leaderboardName);
});
