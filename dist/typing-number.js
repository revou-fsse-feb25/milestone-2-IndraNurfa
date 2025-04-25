import { getRandomNumber } from './utils';
(function () {
    // Generate random numbers
    function generateRandomNumbers(count, min, max) {
        const numbers = [];
        for (let i = 0; i < count; i++) {
            const randomValue = getRandomNumber(min, max);
            if (randomValue === null) {
                throw new Error('Failed to generate a random number');
            }
            const random = randomValue;
            numbers.push(random);
        }
        return numbers;
    }
    // Variables
    const typer = document.querySelector('span[typing-speed]');
    if (!typer) {
        console.error('Error: Element with attribute [typing-speed] not found.');
        return;
    }
    const typingSpeed = parseInt(typer.getAttribute('typing-speed') || '500', 10);
    const typingDelay = parseInt(typer.getAttribute('typing-delay') || '1000', 10);
    const randomNumbers = generateRandomNumbers(10, 1, 100);
    let currentNumberIndex = 0;
    let currentCharacterIndex = 0;
    // Typing function
    function type() {
        if (!randomNumbers.length) {
            console.error('Error: No random numbers generated.');
            return;
        }
        const numberToType = randomNumbers[currentNumberIndex % randomNumbers.length].toString();
        if (currentCharacterIndex < numberToType.length) {
            if (typer) {
                typer.innerHTML += numberToType[currentCharacterIndex++];
            }
            setTimeout(type, typingSpeed);
        }
        else {
            setTimeout(erase, typingDelay);
        }
    }
    // Erasing function
    function erase() {
        if (!randomNumbers.length) {
            console.error('Error: No random numbers generated.');
            return;
        }
        const numberToType = randomNumbers[currentNumberIndex % randomNumbers.length].toString();
        if (currentCharacterIndex > 0) {
            if (typer) {
                typer.innerHTML = numberToType.substr(0, --currentCharacterIndex);
            }
            setTimeout(erase, typingSpeed);
        }
        else {
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
