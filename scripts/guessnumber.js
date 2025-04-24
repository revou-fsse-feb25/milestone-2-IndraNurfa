import {
	applyTransition,
	getRandomNumber,
	updateLeaderboard,
} from './utils.js';

class GuessNumberGame {
	constructor() {
		// DOM Elements
		this.addBtn = document.getElementById('add-btn');
		this.newItemInput = document.getElementById('new-item');
		this.itemList = document.getElementById('item-list');
		this.resultHeader = document.getElementById('result-game');
		this.resetBtn = document.getElementById('reset-btn');

		// Game Variables
		this.attempts = 2;
		this.randomNumber = 0;
		this.startTime = 0;
		this.score = 0;
		this.isGameOver = false;

		// Initialize the game
		this.resetBtn.style.display = 'none';
		this.initEventListeners();
	}

	// Handle adding a new guess
	handleAddItem() {
		if (this.attempts === 0 || this.isGameOver) {
			alert('You have already lost');
			return;
		}

		if (this.randomNumber === 0) {
			this.randomNumber = getRandomNumber(1, 100);
			this.startTime = Date.now();
		}

		console.log('Random number:', this.randomNumber);

		const numberInput = this.newItemInput.value.trim();
		const number = parseInt(numberInput, 10);

		if (!isNaN(number) && number >= 1 && number <= 100 && !this.isGameOver) {
			const li = document.createElement('li');
			li.className = 'text-center text-lg font-bold';

			const hintText = document.createElement('span');
			const difference = Math.abs(number - this.randomNumber);
			let hintTextContent = `${number}`;
			if (number > this.randomNumber) {
				hintTextContent +=
					difference <= 10 ? ' too high, but you are close' : ' too high';
			} else if (number < this.randomNumber) {
				hintTextContent +=
					difference <= 10 ? ' too low, but you are close' : ' too low';
			} else {
				hintTextContent += ' is the correct number!';
			}

			li.appendChild(hintText);
			applyTransition(li, hintTextContent, 250);
			this.itemList.appendChild(li);

			this.newItemInput.value = '';
			if (number === this.randomNumber) {
				this.finishGame();
				return;
			}

			this.attempts--;
			if (this.attempts === 0) {
				this.isGameOver = true;
				applyTransition(
					this.resultHeader,
					`You Lose, guess number is ${this.randomNumber} :')`,
					500
				);
				applyTransition(this.resetBtn, 'Restart Game', 500);
				this.resetBtn.style.display = 'block';
				return;
			}
		} else {
			alert('Please enter a valid number between 1 and 100.');
		}
	}

	// Finish the game
	finishGame() {
		this.isGameOver = true;
		const endTime = Date.now();
		const elapsedTime = (endTime - this.startTime) / 1000;

		this.score = Math.max(
			100 - Math.floor(elapsedTime * 10) + this.attempts * 10,
			0
		);

		const data = { username: 'test', score: this.score };
		updateLeaderboard('highScoreGN', data);

		applyTransition(
			this.resultHeader,
			`Nice, guess number is ${this.randomNumber}. Your score: ${this.score}`,
			500
		);
		applyTransition(this.resetBtn, 'Restart Game', 500);
		this.resetBtn.style.display = 'block';
	}

	// Reset the game
	resetGame() {
		try {
			const items = Array.from(this.itemList.children);
			this.newItemInput.disabled = true;

			let completedTransitions = 0;
			const totalItems = items.length;

			items.forEach((item, index) => {
				setTimeout(() => {
					item.style.transition = 'all 500ms ease-in';
					item.style.opacity = '0';
					item.addEventListener(
						'transitionend',
						() => {
							if (item.parentNode) {
								this.itemList.removeChild(item);
							}
							completedTransitions++;

							if (completedTransitions === totalItems) {
								this.newItemInput.disabled = false;
							}
						},
						{ once: true }
					);
				}, Math.min(index * 300, 3000));
			});

			// Reset game state
			this.attempts = 2;
			this.randomNumber = 0;
			this.isGameOver = false;
			this.score = 0;
			this.startTime = 0;

			applyTransition(this.resultHeader, '');
			applyTransition(this.resetBtn, '');
			this.resultHeader.innerText = '';

			this.newItemInput.value = '';
			this.resetBtn.style.display = 'none';

			if (totalItems === 0) {
				this.newItemInput.disabled = false;
			}
		} catch (error) {
			console.error('Error resetting the game:', error);
			alert(
				'An error occurred while resetting the game. Please refresh the page.'
			);
			this.newItemInput.disabled = false;
		}
	}

	// Handle keypress events
	handleKeyPress(e) {
		if (e.code === 'Enter') {
			this.addBtn.click();
		}
	}

	// Initialize event listeners
	initEventListeners() {
		this.addBtn.addEventListener('click', this.handleAddItem.bind(this));
		this.newItemInput.addEventListener(
			'keypress',
			this.handleKeyPress.bind(this)
		);
		this.resetBtn.addEventListener('click', this.resetGame.bind(this));
	}
}

// Initialize the game
const game = new GuessNumberGame();
