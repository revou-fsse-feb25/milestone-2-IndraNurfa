// Get DOM elements
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;
document.body.appendChild(canvas);

let dots = [];
let time = 60;
let isGameOver = false;
let score = 0;
// let highScore = localStorage.getItem('survivalHighScore') || 0;

// Function to create a dot
function createDot() {
	if (dots.length < 3) {
		let newDot;
		let isOverlapping;

		do {
			// Generate a new dot
			newDot = {
				x: Math.random() * (canvas.width - 50) + 25, // Ensure within canvas boundaries
				y: Math.random() * (canvas.height - 50) + 25, // Ensure within canvas boundaries
				radius: 25,
			};

			// Check if the new dot overlaps with any existing dots
			isOverlapping = dots.some((dot) => {
				const distance = Math.sqrt(
					(newDot.x - dot.x) ** 2 + (newDot.y - dot.y) ** 2
				);
				return distance < newDot.radius + dot.radius; // Overlap if distance is less than the sum of radii
			});
		} while (isOverlapping); // Repeat until no overlap

		// Add the new dot to the array
		dots.push(newDot);
	}
}

// Function to draw dots on the canvas
function drawDots() {
	ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before redrawing
	dots.forEach((dot) => {
		ctx.beginPath();
		ctx.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI);
		ctx.fillStyle = 'red'; // Set dot color
		ctx.fill();
		ctx.closePath();
	});
}

// Function to handle dot clicks
canvas.addEventListener('click', (event) => {
	const rect = canvas.getBoundingClientRect();
	const mouseX = event.clientX - rect.left;
	const mouseY = event.clientY - rect.top;

	// Check if the click is inside any dot
	dots = dots.filter((dot) => {
		const distanceSquared = (mouseX - dot.x) ** 2 + (mouseY - dot.y) ** 2;
		if (distanceSquared > dot.radius ** 2) {
			return true; // Keep the dot if not clicked
		} else {
			score++;
			createDot(); // Replace the clicked dot with a new one
			return false; // Remove the clicked dot
		}
	});
	console.log(dots);
	console.log(`Score: ${score}`);
});

// Main game loop
function gameLoop() {
	if (!isGameOver) {
		createDot(); // Create a new dot if less than 3 exist
		drawDots(); // Draw all dots
		requestAnimationFrame(gameLoop); // Loop the game
	}
}

// Start the game loop
gameLoop();
