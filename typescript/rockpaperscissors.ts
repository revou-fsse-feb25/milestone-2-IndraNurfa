import {
	applyTransition,
	getRandomNumber,
	updateLeaderboard,
	getLeaderboard,
	LeaderboardEntry,
} from './utils';

interface Choice {
	data: string;
	color: string;
}

class RockPaperScissors {
	private playerSpan: HTMLElement | null;
	private resultHeader: HTMLElement | null;
	private scoreDisplay: HTMLElement | null;

	private userChoices: string;
	private currentScore: number;
	private currentUsername: string;
	public leaderboardName: string;

	private CHOICES: Choice[];
	private WINNING_CONDITIONS: Record<string, string>;

	constructor() {
		// DOM Elements
		this.playerSpan = document.getElementById('player-choices');
		this.resultHeader = document.getElementById('result');
		this.scoreDisplay = document.getElementById('current-score');

		// Game Variables
		this.userChoices = 'none';
		this.currentScore = 0;
		this.currentUsername = localStorage.getItem('username') || 'Guest';
		this.leaderboardName = 'highScoreRPS';

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
	generateRandomChoice(): string {
		const random = getRandomNumber(0, this.CHOICES.length);
		return this.CHOICES[random].data;
	}

	// Get the color associated with a choice
	getColor(choice: string): string {
		const selectedChoice = this.CHOICES.find((item) => item.data === choice);
		return selectedChoice ? selectedChoice.color : '#000'; // Default to black if not found
	}

	// Determine the winner
	determineWinner(playerChoice: string, computerChoice: string): string {
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
	async resetGame(): Promise<void> {
		const data: LeaderboardEntry = {
			username: this.currentUsername,
			score: this.currentScore,
		};

		await updateLeaderboard(this.leaderboardName, data);
		await getLeaderboard(this.leaderboardName);

		this.currentScore = 0;
		if (this.scoreDisplay) this.scoreDisplay.innerHTML = '';
	}

	// Main game logic
	logicGame(userChoices: string): void {
		const computerChoices = this.generateRandomChoice();
		console.log(`Computer chose: ${computerChoices.toUpperCase()}`);
		console.log(`You clicked: ${userChoices.toUpperCase()}`);

		const userColor = this.getColor(userChoices);
		const computerColor = this.getColor(computerChoices);

		const newText = `
            Player: <span style="color: ${userColor};">${userChoices.toUpperCase()}</span> 
            VS 
            Computer: <span style="color: ${computerColor};">${computerChoices.toUpperCase()}</span>`;
		if (this.playerSpan) applyTransition(this.playerSpan, newText, 200);

		const result = this.determineWinner(userChoices, computerChoices);
		console.log(result);
		if (this.resultHeader) applyTransition(this.resultHeader, result, 250);

		if (result.includes('win')) {
			this.currentScore += 10;
			const scoreText: string = `Current Score: ${this.currentScore}`;
			if (this.scoreDisplay) applyTransition(this.scoreDisplay, scoreText, 300);
		} else if (result.includes('lose') && this.currentScore > 0) {
			this.resetGame();
		}
	}

	// Handle user choices
	handleChoices(event: Event): void {
		const target = event.target as HTMLElement;
		const choices = target.getAttribute('data-choices');
		this.userChoices = choices || 'none';
		if (this.userChoices === 'none') {
			alert('Please select a choice!');
			return;
		}
		this.logicGame(this.userChoices);
	}

	// Initialize event listeners
	initEventListeners(): void {
		document.querySelectorAll('.choices-btn').forEach((button) => {
			button.addEventListener('click', this.handleChoices.bind(this));
		});
	}
}

// Initialize the game
const game = new RockPaperScissors();
document.addEventListener('DOMContentLoaded', () => {
	getLeaderboard(game.leaderboardName);
});
