const playerInput = document.getElementById('player-input');
const menu = document.getElementById('menu');
const playerSpan = document.getElementById('player-choices');
const resultHeader = document.getElementById('result');
const scoreDisplay = document.getElementById('current-score');
const newHighScoreDisplay = document.getElementById('new-high-score');

document.querySelector('[data-choices="rock"]').innerText = 'Rock';
document.querySelector('[data-choices="paper"]').innerText = 'Paper';
document.querySelector('[data-choices="scissors"]').innerText = 'Scissors';

let userChoices = 'none';
let score = parseInt(localStorage.getItem('scoreRPS'), 10) || 0;

const CHOICES = ['rock', 'paper', 'scissors'];
const WINNING_CONDITIONS = {
	rock: 'scissors',
	paper: 'rock',
	scissors: 'paper',
};

function generateRandomChoice() {
	const random = Math.floor(Math.random() * CHOICES.length);
	return CHOICES[random];
}

function determineWinner(playerChoice, computerChoice) {
	if (playerChoice === computerChoice) {
		return `It's a tie! You both chose ${playerChoice.toUpperCase()}. Try Again!`;
	}

	if (WINNING_CONDITIONS[playerChoice] === computerChoice) {
		return `You win! ${playerChoice.toUpperCase()} beats ${computerChoice.toUpperCase()}. Good Job!`;
	}

	return `You lose! ${computerChoice.toUpperCase()} beats ${playerChoice.toUpperCase()}.`;
}

function resetGame() {
	score = 0;
	scoreDisplay.innerHTML = '';
	newHighScoreDisplay.innerHTML = '';
}

function logicGame(userChoices) {
	const computerChoices = generateRandomChoice();
	console.log(`Computer choose: ${computerChoices.toUpperCase()}`);
	console.log(`You clicked: ${userChoices.toUpperCase()}`);

	playerSpan.innerHTML = `Player choose: ${userChoices.toUpperCase()} VS Computer choose: ${computerChoices.toUpperCase()}`;

	const result = determineWinner(userChoices, computerChoices);
	console.log(`${result}`);
	resultHeader.innerHTML = `${result}`;

	if (result.includes('win')) {
		score += 10;
		scoreDisplay.innerHTML = `Current Score: ${score}`;
	} else if (result.includes('lose')) {
		resetGame();
	}
	localStorage.setItem('score', score);

	const highScore = parseInt(localStorage.getItem('highScoreRPS'), 10) || 0;
	if (score > highScore) {
		localStorage.setItem('highScoreRPS', score);
		newHighScoreDisplay.innerHTML = `New High Score: ${score}!`;
	}
}

function handleChoices(event) {
	const choices = event.target.getAttribute('data-choices');
	userChoices = choices;
	logicGame(userChoices);
}

document.querySelectorAll('#choices-btn').forEach((button) => {
	button.addEventListener('click', handleChoices);
});
