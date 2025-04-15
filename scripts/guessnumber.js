const addBtn = document.getElementById('add-btn');
const newItemInput = document.getElementById('new-item');
const itemList = document.getElementById('item-list');
const resultHeader = document.getElementById('result-game');
const resetBtn = document.getElementById('reset-btn');

let attempts = 2;
let randomNumber = 0;

resetBtn.style.display = 'none';

function handleAddItem() {
	if (attempts === 0) {
		alert('You already lose');
		return;
	}

	if (randomNumber == 0) {
		randomNumber = generateRandomNumber();
	}
	console.log(randomNumber);

	const numberInput = newItemInput.value.trim();
	const number = parseInt(numberInput, 10);

	if (!isNaN(number) && number >= 0 && number <= 100) {
		const li = document.createElement('li');
		li.textContent = number;

		const deleteBtn = document.createElement('span');
		deleteBtn.textContent = 'low or high';
		deleteBtn.className = 'delete-btn';

		li.appendChild(deleteBtn);
		itemList.appendChild(li);

		newItemInput.value = '';
		if (number == randomNumber) {
			finishGame();
			return;
		}

		attempts--;
		if (attempts == 0) {
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
	resultHeader.innerText = `Nice, guess number is ${randomNumber}`;
	resetBtn.style.display = 'block';
	resetBtn.textContent = 'Restart Game';
}

function generateRandomNumber() {
	return Math.floor(Math.random() * 100);
}

function resetGame() {
	while (itemList.firstChild) {
		itemList.removeChild(itemList.firstChild);
	}

	attempts = 2;
	randomNumber = 0;

	resultHeader.innerText = '';

	newItemInput.value = '';

	resetBtn.style.display = 'none';
}

function handleDeleteItem() {
	this.parentElement.remove();
}

function handleKeyPress(e) {
	if (e.key === 'Enter') {
		addBtn.click();
	}
}

addBtn.addEventListener('click', handleAddItem);
newItemInput.addEventListener('click', handleKeyPress);
resetBtn.addEventListener('click', resetGame);
