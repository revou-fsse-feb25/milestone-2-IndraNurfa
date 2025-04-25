import {
	applyTransition,
	getRandomNumber,
	updateLeaderboard,
	getLeaderboard,
} from './utils';

class GuessNumberGame {
	private addBtn: HTMLElement | null;
	private newItemInput: HTMLElement | null;
	private itemList: HTMLElement | null;
	private resultHeader: HTMLElement | null;
	private resetBtn: HTMLElement | null;
	private attempDisplay: HTMLElement | null;

	private attempts: number;
	private randomNumber: number;
	private startTime: number;
	private score: number;
	private isGameOver: boolean;
	public leaderboardName: string;
	private currentUsername: string;

	constructor() {
		// DOM Elements
		this.addBtn = document.getElementById('add-btn');
		this.newItemInput = document.getElementById('new-item');
		this.itemList = document.getElementById('item-list');
		this.resultHeader = document.getElementById('result-game');
		this.resetBtn = document.getElementById('reset-btn');
		this.attempDisplay = document.getElementById('attempts-left');

		// Game Variables
		this.attempts = 5;
		this.randomNumber = 0;
		this.startTime = 0;
		this.score = 0;
		this.isGameOver = false;
		this.leaderboardName = 'highScoreGN';
		this.currentUsername = localStorage.getItem('username') || 'Guest';

		// Initialize the game
		if (this.resetBtn) {
			this.resetBtn.style.display = 'none';
		}
		this.initEventListeners();
	}

	// Handle adding a new guess
	handleAddItem(): void {
		if (this.attempts === 0 || this.isGameOver) {
			alert('You have already lost');
			return;
		}

		if (this.randomNumber === 0) {
			this.randomNumber = getRandomNumber(1, 100);
			this.startTime = Date.now();
		}

		console.log('Random number:', this.randomNumber);

		if (!this.newItemInput) {
			alert('Input element not found.');
			return;
		}
		const numberInput = (this.newItemInput as HTMLInputElement).value.trim();
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
			if (this.itemList) {
				this.itemList.appendChild(li);
			}

			if (this.newItemInput) {
				(this.newItemInput as HTMLInputElement).value = '';
			}
			if (number === this.randomNumber) {
				this.finishGame();
				return;
			}

			this.attempts--;
			if (this.attempDisplay)
				this.attempDisplay.innerText = `You have ${this.attempts} attempts left`;

			if (this.attempts === 0 && this.resultHeader && this.resetBtn) {
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
	async finishGame(): Promise<void> {
		this.isGameOver = true;
		const endTime = Date.now();
		const elapsedTime = (endTime - this.startTime) / 1000;

		this.score = Math.max(
			100 - Math.floor(elapsedTime * 10) + this.attempts * 10,
			0
		);

		const data = { username: this.currentUsername, score: this.score };
		await updateLeaderboard('highScoreGN', data);
		await getLeaderboard(this.leaderboardName);
		if (this.resetBtn && this.resultHeader) {
			applyTransition(
				this.resultHeader,
				`Nice, guess number is ${this.randomNumber}. Your score: ${this.score}`,
				500
			);
			applyTransition(this.resetBtn, 'Restart Game', 500);
			this.resetBtn.style.display = 'block';
		}
	}

	// Reset the game
	resetGame(): void {
		try {
			// Get all items in the list
			const items: HTMLElement[] = Array.from(
				this.itemList?.children || []
			).map((child) => child as HTMLElement);
			if (!this.newItemInput) {
				throw new Error('Input element not found.');
			}
			(this.newItemInput as HTMLInputElement).disabled = true;

			let completedTransitions = 0;
			const totalItems = items.length;

			// Animate and remove each item
			items.forEach((item, index) => {
				setTimeout(() => {
					item.style.transition = 'all 500ms ease-in';
					item.style.opacity = '0';

					item.addEventListener(
						'transitionend',
						() => {
							if (item.parentNode) {
								this.itemList?.removeChild(item);
							}
							completedTransitions++;

							// Re-enable input after all transitions are complete
							if (completedTransitions === totalItems) {
								(this.newItemInput as HTMLInputElement).disabled = false;
							}
						},
						{ once: true }
					);
				}, Math.min(index * 300, 3000));
			});

			// Reset game state
			this.attempts = 5;
			this.randomNumber = 0;
			this.isGameOver = false;
			this.score = 0;
			this.startTime = 0;

			// Clear UI elements
			if (
				this.resultHeader &&
				this.attempDisplay &&
				this.resetBtn &&
				this.newItemInput
			) {
				applyTransition(this.resultHeader, '');
				applyTransition(this.resetBtn, '');
				this.resultHeader.innerText = '';

				this.attempDisplay.innerText = `You have ${this.attempts} attempts left`;
				(this.newItemInput as HTMLInputElement).value = '';
			}
			if (this.newItemInput)
				if (this.resetBtn) this.resetBtn.style.display = 'none';

			// Re-enable input if no items exist
			if (totalItems === 0) {
				(this.newItemInput as HTMLInputElement).disabled = false;
			}
		} catch (error) {
			console.error('Error resetting the game:', error);
			alert(
				'An error occurred while resetting the game. Please refresh the page.'
			);
			(this.newItemInput as HTMLInputElement).disabled = false;
		}
	}

	// Handle keypress events
	handleKeyPress(event: Event): void {
		const keyboardEvent = event as KeyboardEvent;
		if (keyboardEvent.code === 'Enter' && this.addBtn) {
			this.addBtn.click();
		}
	}

	// Initialize event listeners
	initEventListeners(): void {
		if (this.addBtn)
			this.addBtn.addEventListener('click', this.handleAddItem.bind(this));
		if (this.newItemInput)
			this.newItemInput.addEventListener(
				'keypress',
				this.handleKeyPress.bind(this)
			);
		if (this.resetBtn)
			this.resetBtn.addEventListener('click', this.resetGame.bind(this));
	}
}

// Initialize the game
const game = new GuessNumberGame();
document.addEventListener('DOMContentLoaded', () => {
	getLeaderboard(game.leaderboardName);
});
