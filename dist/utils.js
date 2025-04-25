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
}
export function updateLeaderboard(leaderboardName, newEntry) {
    try {
        // Validate the new entry
        if (typeof newEntry.username !== 'string' ||
            typeof newEntry.score !== 'number') {
            throw new Error('New entry must have a "username" (string) and "score" (number).');
        }
        // Retrieve the existing leaderboard from localStorage
        const storedData = localStorage.getItem(leaderboardName);
        let leaderboard = storedData
            ? JSON.parse(storedData)
            : [];
        // Add the new entry to the leaderboard
        leaderboard.push(newEntry);
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard.sort((a, b) => b.score - a.score);
        // Keep only the top 10 entries
        leaderboard = leaderboard.slice(0, 10);
        // Save the updated leaderboard back to localStorage
        localStorage.setItem(leaderboardName, JSON.stringify(leaderboard));
    }
    catch (error) {
        // Log the error to the console
        console.error(`Failed to update leaderboard "${leaderboardName}":`, error);
    }
}
/**
 * Retrieves leaderboard data from localStorage and populates the leaderboard table.
 *
 * @param {string} leaderboardName - The key name used to retrieve the leaderboard data from localStorage.
 */
export function getLeaderboard(leaderboardName) {
    // Retrieve leaderboard data from localStorage
    const leaderboardData = localStorage.getItem(leaderboardName);
    let leaderboard = leaderboardData
        ? JSON.parse(leaderboardData)
        : [];
    // Select the table body
    const tableBody = document.querySelector('#leaderboard-table tbody');
    if (!tableBody) {
        console.error('Leaderboard table body not found.');
        return;
    }
    // Clear existing rows
    tableBody.innerHTML = '';
    // Populate the table with data
    leaderboard.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
			<td class="px-2">${index + 1}</td>
			<td class="px-2">${entry.username}</td>
			<td class="px-2">${entry.score}</td>
		`;
        tableBody.appendChild(row);
    });
}
