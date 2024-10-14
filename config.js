// Configuration file for the game

// Font configuration
const FONT_CONFIG = {
	fontFamily: 'Digital-7',
	fontSrc: 'url(fonts/Digital-7/digital_7.ttf)',
	fontFallback: 'monospace',
	glowColor: '#00ff00',
	textColor: '#ffffff',
	scoreFontSize: 24,
	gameOverFontSize: 40,
};

// Bird configuration
const BIRD_CONFIG = {
	initialX: 50,
	initialY: 300,
	width: 20,
	height: 20,
	rotationSpeed: 0.05,
	imageSrc: 'images/Flappy-Bird-PNG-HD.png',
	jumpHeight: pipeGap => pipeGap / 2,
};

// Physics configuration
const PHYSICS_CONFIG = {
	gravity: 0.6,
	lift: Math.sqrt(2 * 0.6 * (pipeGap / 2)), // Calculated based on gravity and pipe gap
};

// Pipe configuration
const PIPE_CONFIG = {
	width: BIRD_CONFIG.width * 2,
	gap: canvas.height * 0.25, // 25% of canvas height
	speed: 2,
	frequency: 1000, // 1 second between pipe spawns
};

// Background configuration
const BACKGROUND_CONFIG = {
	imageSrc: 'images/flap.png',
	scrollSpeed: 0.5, // Speed of background scrolling
};

// Canvas configuration
const CANVAS_CONFIG = {
	elementId: 'gameCanvas',
};

// UI elements configuration
const UI_CONFIG = {
	scoreBoardId: 'scoreBoard',
	currentScoreId: 'currentScore',
	bestScoreId: 'bestScore',
	restartButtonId: 'restartButton',
};

// Export all configurations
export {
	FONT_CONFIG,
	BIRD_CONFIG,
	PHYSICS_CONFIG,
	PIPE_CONFIG,
	BACKGROUND_CONFIG,
	CANVAS_CONFIG,
	UI_CONFIG,
};