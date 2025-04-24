import {
	applyTransition,
	getRandomNumber,
	updateLeaderboard,
} from './utils.js';

class RockPaperScissors {
	constructor() {
		// DOM Elements
		this.playerSpan = document.getElementById('player-choices');
		this.resultHeader = document.getElementById('result');
		this.scoreDisplay = document.getElementById('current-score');
		this.newHighScoreDisplay = document.getElementById('new-high-score');

		// Game Variables
		this.userChoices = 'none';
		this.currentScore = 0;

		// Choices and Winning Conditions
		this.CHOICES = [
			{ data: 'rock', color: '#FE2BF1' },
			{ data: 'paper', color: '#00DFBA' },
			{ data: 'scissors', color: '#0C7CEB' },
		];

		this.WINNING_CONDITIONS = {
			rock: 'scissors',
			paper: 'rock',
			scissors: 'paper',
		};

		// Initialize Event Listeners
		this.initEventListeners();
	}

	// Generate a random choice for the computer
	generateRandomChoice() {
		const random = getRandomNumber(0, this.CHOICES.length);
		return this.CHOICES[random].data;
	}

	// Get the color associated with a choice
	getColor(choice) {
		const selectedChoice = this.CHOICES.find((item) => item.data === choice);
		return selectedChoice ? selectedChoice.color : '#000'; // Default to black if not found
	}

	// Determine the winner
	determineWinner(playerChoice, computerChoice) {
		const userColor = this.getColor(playerChoice);
		const computerColor = this.getColor(computerChoice);

		if (playerChoice === computerChoice) {
			return `It's a tie! You both chose <span style="color: ${userColor};">${playerChoice.toUpperCase()}</span>. Try Again!`;
		}

		if (this.WINNING_CONDITIONS[playerChoice] === computerChoice) {
			return `You win! <span style="color: ${userColor};">${playerChoice.toUpperCase()}</span> beats <span style="color: ${computerColor};">${computerChoice.toUpperCase()}</span>. Good Job!`;
		}

		return `You lose! <span style="color: ${computerColor};">${computerChoice.toUpperCase()}</span> beats <span style="color: ${userColor};">${playerChoice.toUpperCase()}</span>.`;
	}

	// Reset the game
	resetGame() {
		const cachesData = { username: 'test', score: this.currentScore };
		updateLeaderboard('highScoreRPS', cachesData);

		this.currentScore = 0;
		this.scoreDisplay.innerHTML = '';
		this.newHighScoreDisplay.innerHTML = '';
	}

	// Main game logic
	logicGame(userChoices) {
		const computerChoices = this.generateRandomChoice();
		console.log(`Computer chose: ${computerChoices.toUpperCase()}`);
		console.log(`You clicked: ${userChoices.toUpperCase()}`);

		const userColor = this.getColor(userChoices);
		const computerColor = this.getColor(computerChoices);

		const newText = `
            Player: <span style="color: ${userColor};">${userChoices.toUpperCase()}</span> 
            VS 
            Computer: <span style="color: ${computerColor};">${computerChoices.toUpperCase()}</span>`;
		applyTransition(this.playerSpan, newText, 200);

		const result = this.determineWinner(userChoices, computerChoices);
		console.log(result);
		applyTransition(this.resultHeader, result, 250);

		if (result.includes('win')) {
			this.currentScore += 10;
			const scoreText = `Current Score: ${this.currentScore}`;
			applyTransition(this.scoreDisplay, scoreText, 300);
		} else if (result.includes('lose') && this.currentScore > 0) {
			this.resetGame();
		}

		const highScore = parseInt(localStorage.getItem('highScoreRPS'), 10) || 0;
		if (this.currentScore > highScore) {
			const newHighScoreText = `New High Score: ${this.currentScore}!`;
			applyTransition(this.newHighScoreDisplay, newHighScoreText, 300);
		}
	}

	// Handle user choices
	handleChoices(event) {
		const choices = event.target.getAttribute('data-choices');
		this.userChoices = choices;
		if (this.userChoices === 'none') {
			alert('Please select a choice!');
			return;
		}
		this.logicGame(this.userChoices);
	}

	// Initialize event listeners
	initEventListeners() {
		document.querySelectorAll('.choices-btn').forEach((button) => {
			button.addEventListener('click', this.handleChoices.bind(this));
		});
	}
}

// Initialize the game
const game = new RockPaperScissors();
