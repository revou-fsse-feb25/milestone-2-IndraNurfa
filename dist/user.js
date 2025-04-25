import { getRandomNumber } from './utils';
(function () {
    // DOM Elements
    const submitButton = document.getElementById('submit-username');
    const guestButton = document.getElementById('continue-as-guest');
    const modal = document.getElementById('username-modal');
    const usernameInput = document.getElementById('username-input');
    const usernameText = document.getElementById('username-span');
    // Check if required elements exist
    if (!modal ||
        !usernameInput ||
        !submitButton ||
        !guestButton ||
        !usernameText) {
        console.error('Error: Required DOM elements not found.');
        return;
    }
    // Function to update the username display
    function updateUsernameDisplay(username) {
        if (usernameText)
            usernameText.innerHTML = username || 'Guest';
    }
    // Function to handle username submission
    function handleUsernameSubmission() {
        let username = '';
        if (usernameInput) {
            username = usernameInput.value.trim();
        }
        if (username) {
            // Save the username to localStorage
            localStorage.setItem('username', username);
            // Update the username display and hide the modal
            updateUsernameDisplay(username);
            if (modal)
                modal.classList.add('hidden');
        }
        else {
            alert('Please enter a valid username.');
        }
    }
    // Function to handle guest login
    function handleGuestLogin() {
        const randomNumber = getRandomNumber(100, 999);
        const guestUsername = `Guest${randomNumber}`;
        // Save the guest username to localStorage
        localStorage.setItem('username', guestUsername);
        // Update the username display and hide the modal
        updateUsernameDisplay(guestUsername);
        if (modal)
            modal.classList.add('hidden');
    }
    // Function to initialize the username modal
    function initializeUsernameModal() {
        // Show the modal
        if (modal)
            modal.classList.remove('hidden');
        // Attach event listeners
        submitButton === null || submitButton === void 0 ? void 0 : submitButton.addEventListener('click', handleUsernameSubmission);
        guestButton === null || guestButton === void 0 ? void 0 : guestButton.addEventListener('click', handleGuestLogin);
    }
    // Main logic
    const localUsername = localStorage.getItem('username') || '';
    if (!localUsername) {
        initializeUsernameModal();
    }
    else {
        updateUsernameDisplay(localUsername);
    }
})();
