import { getRandomNumber } from './utils.js';

(function () {
	// Generate random numbers
	function generateRandomNumbers(count, min, max) {
		let numbers = [];
		for (let i = 0; i < count; i++) {
			numbers.push(getRandomNumber(min, max));
		}
		return numbers;
	}

	// Variables
	const randomNumbers = generateRandomNumbers(10, 1, 100);
	const typer = document.querySelector('span[typing-speed]');
	if (!typer) {
		console.error('Error: Element with attribute [typing-speed] not found.');
		return;
	}

	const typingSpeed = parseInt(typer.getAttribute('typing-speed')) || 500;
	const typingDelay = parseInt(typer.getAttribute('typing-delay')) || 1000;
	let currentNumberIndex = 0;
	let currentCharacterIndex = 0;

	// Typing function
	function type() {
		if (!randomNumbers.length) {
			console.error('Error: No random numbers generated.');
			return;
		}

		const numberToType =
			randomNumbers[currentNumberIndex % randomNumbers.length].toString();

		if (currentCharacterIndex < numberToType.length) {
			typer.innerHTML += numberToType[currentCharacterIndex++];
			setTimeout(type, typingSpeed);
		} else {
			setTimeout(erase, typingDelay);
		}
	}

	// Erasing function
	function erase() {
		if (!randomNumbers.length) {
			console.error('Error: No random numbers generated.');
			return;
		}

		const numberToType =
			randomNumbers[currentNumberIndex % randomNumbers.length].toString();
		if (currentCharacterIndex > 0) {
			typer.innerHTML = numberToType.substr(0, --currentCharacterIndex);
			setTimeout(erase, typingSpeed);
		} else {
			currentNumberIndex++;
			setTimeout(type, typingDelay);
		}
	}

	// Start typing on window load
	window.onload = function () {
		if (randomNumbers.length === 0) {
			console.error('Error: Random numbers array is empty.');
			return;
		}
		type();
	};
})();
