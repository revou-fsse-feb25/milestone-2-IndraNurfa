import {
	applyTransition,
	getRandomNumber,
	updateLeaderboard,
} from './utils.js';

const playerSpan = document.getElementById('player-choices');
const resultHeader = document.getElementById('result');
const scoreDisplay = document.getElementById('current-score');
const newHighScoreDisplay = document.getElementById('new-high-score');

let userChoices = 'none';
let currentScore = 0;

const CHOICES = [
	{ data: 'rock', color: '#FE2BF1' },
	{ data: 'paper', color: '#00DFBA' },
	{ data: 'scissors', color: '#0C7CEB' },
];

const WINNING_CONDITIONS = {
	rock: 'scissors',
	paper: 'rock',
	scissors: 'paper',
};

function generateRandomChoice() {
	const random = getRandomNumber(0, CHOICES.length);
	return CHOICES[random].data;
}

function getColor(choice) {
	const selectedChoice = CHOICES.findIndex((item) => item.data === choice);
	return CHOICES[selectedChoice].color;
}

function determineWinner(playerChoice, computerChoice) {
	const userColor = getColor(playerChoice);
	const computerColor = getColor(computerChoice);
	if (playerChoice === computerChoice) {
		return `It's a tie! You both chose <span style="color: ${userColor};">${playerChoice.toUpperCase()}</span>. Try Again!`;
	}

	if (WINNING_CONDITIONS[playerChoice] === computerChoice) {
		return `You win! <span style="color: ${userColor};">${playerChoice.toUpperCase()}</span> beats <span style="color: ${computerColor};">${computerChoice.toUpperCase()}</span>. Good Job!`;
	}

	return `You lose! <span style="color: ${computerColor};">${computerChoice.toUpperCase()}</span> beats <span style="color: ${userColor};">${playerChoice.toUpperCase()}</span>.`;
}

function resetGame() {
	currentScore = 0;
	scoreDisplay.innerHTML = '';
	newHighScoreDisplay.innerHTML = '';
}

function logicGame(userChoices) {
	const computerChoices = generateRandomChoice();
	console.log(`Computer chose: ${computerChoices.toUpperCase()}`);
	console.log(`You clicked: ${userChoices.toUpperCase()}`);

	const userColor = getColor(userChoices);
	const computerColor = getColor(computerChoices);

	const newText = `
        Player: <span style="color: ${userColor};">${userChoices.toUpperCase()}</span> 
        VS 
        Computer: <span style="color: ${computerColor};">${computerChoices.toUpperCase()}</span>`;
	applyTransition(playerSpan, newText, 200);

	const result = determineWinner(userChoices, computerChoices);
	console.log(result);
	applyTransition(resultHeader, result, 250);

	if (result.includes('win')) {
		currentScore += 10;
		const scoreText = `Current Score: ${currentScore}`;
		applyTransition(scoreDisplay, scoreText, 300);
	} else if (result.includes('lose')) {
		resetGame();
	}

	let cachesData = { username: 'test', score: currentScore };

	updateLeaderboard('highScoreRPS', cachesData);
	const highScore = parseInt(localStorage.getItem('highScoreRPS'), 10) || 0;
	if (currentScore > highScore) {
		// localStorage.setItem('highScoreRPS', currentScore);
		let newHighScoreText = `New High Score: ${currentScore}!`;
		applyTransition(newHighScoreDisplay, newHighScoreText, 300);
	}
}

function handleChoices(event) {
	const choices = event.target.getAttribute('data-choices');
	userChoices = choices;
	if (userChoices === 'none') {
		alert('Please select a choice!');
		return;
	}
	logicGame(userChoices);
}

document.querySelectorAll('.choices-btn').forEach((button) => {
	button.addEventListener('click', handleChoices);
});
