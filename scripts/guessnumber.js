const addBtn = document.getElementById('add-btn');
const newItemInput = document.getElementById('new-item');
const itemList = document.getElementById('item-list');
const resultHeader = document.getElementById('result-game');
const resetBtn = document.getElementById('reset-btn');

let attempts = 5;
let randomNumber = 0;
let startTime = 0; // Track the start time
let score = 0; // Track the score

resetBtn.style.display = 'none';

function handleAddItem() {
	if (attempts === 0) {
		alert('You already lose');
		return;
	}

	if (randomNumber === 0) {
		randomNumber = generateRandomNumber();
		startTime = Date.now();
	}
	console.log(randomNumber);

	const numberInput = newItemInput.value.trim();
	const number = parseInt(numberInput, 10);

	if (!isNaN(number) && number >= 1 && number <= 100) {
		const li = document.createElement('li');
		li.className = 'text-center';
		li.textContent = number;

		const hintText = document.createElement('span');
		const difference = Math.abs(number - randomNumber);
		if (number > randomNumber) {
			hintText.textContent =
				difference <= 10 ? " too high, but you're close" : ' too high';
		} else {
			hintText.textContent =
				difference <= 10 ? " too low, but you're close" : ' too low';
		}

		li.appendChild(hintText);
		itemList.appendChild(li);

		newItemInput.value = '';
		if (number === randomNumber) {
			finishGame();
			return;
		}

		attempts--;
		if (attempts === 0) {
			resultHeader.innerText = "You Lose :')";
			resetBtn.style.display = 'block';
			resetBtn.textContent = 'Restart Game';
			return;
		}
	} else {
		alert('Please enter a valid number between 0 and 100.');
	}
}

function finishGame() {
	const endTime = Date.now(); // Get the end time
	const elapsedTime = (endTime - startTime) / 1000; // Calculate elapsed time in seconds

	// Calculate score based on elapsed time and remaining attempts
	score = Math.max(100 - Math.floor(elapsedTime * 10) + attempts * 10, 0);

	resultHeader.innerText = `Nice, guess number is ${randomNumber}. Your score: ${score}`;
	resetBtn.style.display = 'block';
	resetBtn.textContent = 'Restart Game';
}

function generateRandomNumber() {
	return Math.floor(Math.random() * 100) + 1;
}

function resetGame() {
	while (itemList.firstChild) {
		itemList.removeChild(itemList.firstChild);
	}

	attempts = 5;
	randomNumber = 0;

	resultHeader.innerText = '';

	newItemInput.value = '';

	resetBtn.style.display = 'none';
}

function handleDeleteItem() {
	this.parentElement.remove();
}

function handleKeyPress(e) {
	if (e.code === 'Enter') {
		addBtn.click();
	}
}

addBtn.addEventListener('click', handleAddItem);
newItemInput.addEventListener('keypress', handleKeyPress);
resetBtn.addEventListener('click', resetGame);
