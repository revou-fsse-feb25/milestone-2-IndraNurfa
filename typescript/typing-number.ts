import { getRandomNumber } from './utils';

(function () {
	// Generate random numbers
	function generateRandomNumbers(
		count: number,
		min: number,
		max: number
	): number[] {
		const numbers: number[] = [];
		for (let i = 0; i < count; i++) {
			const randomValue = getRandomNumber(min, max);
			if (randomValue === null) {
				throw new Error('Failed to generate a random number');
			}
			const random: number = randomValue;
			numbers.push(random);
		}
		return numbers;
	}

	// Variables
	const typer: HTMLElement | null =
		document.querySelector('span[typing-speed]');
	if (!typer) {
		console.error('Error: Element with attribute [typing-speed] not found.');
		return;
	}

	const typingSpeed: number = parseInt(
		typer.getAttribute('typing-speed') || '500',
		10
	);
	const typingDelay: number = parseInt(
		typer.getAttribute('typing-delay') || '1000',
		10
	);
	const randomNumbers: number[] = generateRandomNumbers(10, 1, 100);
	let currentNumberIndex: number = 0;
	let currentCharacterIndex: number = 0;

	// Typing function
	function type(): void {
		if (!randomNumbers.length) {
			console.error('Error: No random numbers generated.');
			return;
		}

		const numberToType: string =
			randomNumbers[currentNumberIndex % randomNumbers.length].toString();

		if (currentCharacterIndex < numberToType.length) {
			if (typer) {
				typer.innerHTML += numberToType[currentCharacterIndex++];
			}
			setTimeout(type, typingSpeed);
		} else {
			setTimeout(erase, typingDelay);
		}
	}

	// Erasing function
	function erase(): void {
		if (!randomNumbers.length) {
			console.error('Error: No random numbers generated.');
			return;
		}

		const numberToType: string =
			randomNumbers[currentNumberIndex % randomNumbers.length].toString();
		if (currentCharacterIndex > 0) {
			if (typer) {
				typer.innerHTML = numberToType.substr(0, --currentCharacterIndex);
			}
			setTimeout(erase, typingSpeed);
		} else {
			currentNumberIndex++;
			setTimeout(type, typingDelay);
		}
	}

	// Start typing on window load
	window.onload = function (): void {
		if (randomNumbers.length === 0) {
			console.error('Error: Random numbers array is empty.');
			return;
		}
		type();
	};
})();
