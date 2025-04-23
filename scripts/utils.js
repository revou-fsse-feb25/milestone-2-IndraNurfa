// Utility Library

/**
 * Applies a transition effect to an element and updates its content.
 * @param {HTMLElement} element - The DOM element to apply the transition to.
 * @param {string} newText - The new content to set after the transition.
 * @param {number} duration - The duration of the transition in milliseconds (default: 200ms).
 */
export function applyTransition(element, newText, duration = 200) {
	element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
	element.style.transform = 'translateY(10px)';
	element.style.opacity = '0';

	setTimeout(() => {
		element.innerHTML = newText;
		element.style.transform = 'translateY(0)';
		element.style.opacity = '1';
	}, duration);
}

/**
 * Generates a random number between a specified minimum and maximum value.
 * @param {number} max - The maximum value (exclusive).
 * @param {number} [min] - The minimum value (inclusive).
 * @returns {number} A random number between min and max.
 */
export function getRandomNumber(min, max) {
	try {
		if (min == null || max == null) {
			throw new Error('Both min and max must be provided.');
		}
		if (typeof min !== 'number' || typeof max !== 'number') {
			throw new Error('Both min and max must be numbers.');
		}
		if (min >= max) {
			throw new Error('Minimum value must be less than maximum value.');
		}

		return Math.floor(Math.random() * (max - min) + min);
	} catch (error) {
		console.error('Error generating random number:', error.message);
		return null;
	}
}

/**
 * Retrieves a leaderboard from localStorage, updates it with new data, sorts it, and keeps only the top 10 entries.
 * @param {string} leaderboardName - The name of the leaderboard in localStorage.
 * @param {Object} newEntry - The new leaderboard entry (must have `name` and `score`).
 */
export function updateLeaderboard(leaderboardName, newEntry) {
	try {
		// Validate the new entry
		if (
			typeof newEntry.username !== 'string' ||
			typeof newEntry.score !== 'number'
		) {
			throw new Error(
				'New entry must have a "username" (string) and "score" (number).'
			);
		}

		// Retrieve the existing leaderboard from localStorage
		let leaderboard = JSON.parse(localStorage.getItem(leaderboardName)) || [];

		// Add the new entry to the leaderboard
		leaderboard.push(newEntry);

		// Sort the leaderboard by score in descending order
		leaderboard.sort((a, b) => b.score - a.score);

		// Keep only the top 10 entries
		leaderboard = leaderboard.slice(0, 10);

		// Save the updated leaderboard back to localStorage
		localStorage.setItem(leaderboardName, JSON.stringify(leaderboard));
	} catch (error) {
		// Log the error to the console
		console.error(`Failed to update leaderboard "${leaderboardName}":`, error);
	}
}

/**
 * Validates a username. If invalid, returns a default username.
 * @param {string} username - The username to validate.
 * @param {string} [defaultUsername='Guest'] - The default username to return if validation fails.
 * @returns {string} A valid username.
 */
export function validateUsername(username, defaultUsername = 'Guest') {
	try {
		// Check if the username is a string and not empty or whitespace
		if (typeof username === 'string' && username.trim().length > 0) {
			return username.trim(); // Return the trimmed valid username
		} else {
			throw new Error('Invalid username provided.');
		}
	} catch (error) {
		console.warn(error.message); // Log a warning for debugging
		return defaultUsername; // Return the default username
	}
}
