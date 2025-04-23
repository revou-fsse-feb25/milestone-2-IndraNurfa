import {
	applyTransition,
	getRandomNumber,
	updateLeaderboard,
} from './utils.js';

const addBtn = document.getElementById('add-btn');
const newItemInput = document.getElementById('new-item');
const itemList = document.getElementById('item-list');
const resultHeader = document.getElementById('result-game');
const resetBtn = document.getElementById('reset-btn');

let attempts = 2;
let randomNumber = 0;
let startTime = 0;
let score = 0;
let isGameOver = false;

resetBtn.style.display = 'none';

function handleAddItem() {
	if (attempts === 0 || isGameOver) {
		alert('You have already lost');
		return;
	}

	if (randomNumber === 0) {
		randomNumber = getRandomNumber(1, 100);
		startTime = Date.now();
	}

	console.log('Random number:', randomNumber);

	const numberInput = newItemInput.value.trim();
	const number = parseInt(numberInput, 10);

	if (!isNaN(number) && number >= 1 && number <= 100 && !isGameOver) {
		const li = document.createElement('li');
		li.className = 'text-center text-lg font-bold';

		const hintText = document.createElement('span');
		const difference = Math.abs(number - randomNumber);
		let hintTextContent = `${number}`;
		if (number > randomNumber) {
			hintTextContent +=
				difference <= 10 ? ' too high, but you are close' : ' too high';
		} else if (number < randomNumber) {
			hintTextContent +=
				difference <= 10 ? ' too low, but you are close' : ' too low';
		} else {
			hintTextContent += ' is the correct number!';
		}

		li.appendChild(hintText);
		applyTransition(li, hintTextContent, 250);
		itemList.appendChild(li);

		newItemInput.value = '';
		if (number === randomNumber) {
			finishGame();
			return;
		}

		attempts--;
		if (attempts === 0) {
			isGameOver = true;
			applyTransition(
				resultHeader,
				`You Lose, guess number is ${randomNumber} :')`,
				500
			);
			applyTransition(resetBtn, 'Restart Game', 500);
			resetBtn.style.display = 'block';
			return;
		}
	} else {
		alert('Please enter a valid number between 1 and 100.');
	}
}

function finishGame() {
	isGameOver = true; // Set game over flag to true
	const endTime = Date.now(); // Get the end time
	const elapsedTime = (endTime - startTime) / 1000; // Calculate elapsed time in seconds

	score = Math.max(100 - Math.floor(elapsedTime * 10) + attempts * 10, 0);

	const data = { username: 'test', score: score };
	updateLeaderboard('highScoreGN', data);

	applyTransition(
		resultHeader,
		`Nice, guess number is ${randomNumber}. Your score: ${score}`,
		500
	);
	applyTransition(resetBtn, 'Restart Game', 500);
	resetBtn.style.display = 'block';
}

function resetGame() {
	try {
		const items = Array.from(itemList.children);
		newItemInput.disabled = true; // Disable input during reset

		let completedTransitions = 0; // Track completed transitions
		const totalItems = items.length;

		items.forEach((item, index) => {
			setTimeout(() => {
				item.style.transition = 'all 500ms ease-in';
				item.style.opacity = '0';
				item.addEventListener(
					'transitionend',
					() => {
						if (item.parentNode) {
							itemList.removeChild(item);
						}
						completedTransitions++;

						// Re-enable input after all transitions are complete
						if (completedTransitions === totalItems) {
							newItemInput.disabled = false;
						}
					},
					{ once: true }
				);
			}, Math.min(index * 300, 3000)); // Limit maximum delay
		});

		// Reset game state
		attempts = 2;
		randomNumber = 0;
		isGameOver = false;
		score = 0;
		startTime = 0;

		applyTransition(resultHeader, '');
		applyTransition(resetBtn, '');
		resultHeader.innerText = '';

		newItemInput.value = '';
		resetBtn.style.display = 'none';

		// If there are no items, re-enable input immediately
		if (totalItems === 0) {
			newItemInput.disabled = false;
		}
	} catch (error) {
		console.error('Error resetting the game:', error);
		alert(
			'An error occurred while resetting the game. Please refresh the page.'
		);
		newItemInput.disabled = false; // Ensure input is re-enabled in case of error
	}
}

function handleKeyPress(e) {
	if (e.code === 'Enter') {
		addBtn.click();
	}
}

addBtn.addEventListener('click', handleAddItem);
newItemInput.addEventListener('keypress', handleKeyPress);
resetBtn.addEventListener('click', resetGame);
