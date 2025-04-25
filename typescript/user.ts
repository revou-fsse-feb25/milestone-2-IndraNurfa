import { getRandomNumber } from './utils';

(function () {
	// DOM Elements
	const submitButton: HTMLElement | null =
		document.getElementById('submit-username');
	const guestButton: HTMLElement | null =
		document.getElementById('continue-as-guest');
	const modal: HTMLElement | null = document.getElementById('username-modal');
	const usernameInput: HTMLElement | null =
		document.getElementById('username-input');
	const usernameText: HTMLElement | null =
		document.getElementById('username-span');

	// Check if required elements exist
	if (
		!modal ||
		!usernameInput ||
		!submitButton ||
		!guestButton ||
		!usernameText
	) {
		console.error('Error: Required DOM elements not found.');
		return;
	}

	// Function to update the username display
	function updateUsernameDisplay(username: string): void {
		if (usernameText) usernameText.innerHTML = username || 'Guest';
	}

	// Function to handle username submission
	function handleUsernameSubmission(): void {
		let username: string = '';
		if (usernameInput) {
			username = (usernameInput as HTMLInputElement).value.trim();
		}

		if (username) {
			// Save the username to localStorage
			localStorage.setItem('username', username);

			// Update the username display and hide the modal
			updateUsernameDisplay(username);
			if (modal) modal.classList.add('hidden');
		} else {
			alert('Please enter a valid username.');
		}
	}

	// Function to handle guest login
	function handleGuestLogin(): void {
		const randomNumber = getRandomNumber(100, 999);
		const guestUsername = `Guest${randomNumber}`;

		// Save the guest username to localStorage
		localStorage.setItem('username', guestUsername);

		// Update the username display and hide the modal
		updateUsernameDisplay(guestUsername);
		if (modal) modal.classList.add('hidden');
	}

	// Function to initialize the username modal
	function initializeUsernameModal(): void {
		// Show the modal
		if (modal) modal.classList.remove('hidden');

		// Attach event listeners
		submitButton?.addEventListener('click', handleUsernameSubmission);
		guestButton?.addEventListener('click', handleGuestLogin);
	}

	// Main logic
	const localUsername = localStorage.getItem('username') || '';
	if (!localUsername) {
		initializeUsernameModal();
	} else {
		updateUsernameDisplay(localUsername);
	}
})();
