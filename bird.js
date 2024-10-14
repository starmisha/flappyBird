const font = new FontFace('Digital-7', 'url(fonts/Digital-7/digital_7.ttf)');
font.load().then(function (loadedFont) {
	document.fonts.add(loadedFont);
}).catch(function (error) {
	console.error('Failed to load font:', error);
});
class Physics {
	constructor(gravity, lift) {
		this.gravity = gravity;
		this.lift = lift;
	}

	applyGravity(bird) {
		bird.velocity += this.gravity;
		bird.y += bird.velocity;
	}

	applyLift(bird) {
		bird.velocity = -Math.sqrt(2 * this.gravity * (pipeGap / 2));
	}
	checkCollisionWithGround(bird, canvasHeight) {
		if (bird.y + bird.height >= canvasHeight) {
			return true;
		}
		return false;
	}

	checkCollisionWithPipes(bird, pipes, pipeWidth, pipeGap) {
		for (let pipe of pipes) {
			if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipeWidth &&
				(bird.y < pipe.topHeight || bird.y + bird.height > pipe.topHeight + pipeGap)) {
				return true;
			}
		}
		return false;
	}
}

class Bird {
	constructor(x, y, width, height, rotationSpeed, birdImage, physics) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.velocity = 0;
		this.rotation = 0;
		this.rotationSpeed = rotationSpeed;
		this.birdImage = birdImage;
		this.physics = physics;
	}

	update(canvasHeight, pipes, pipeWidth, pipeGap) {
		this.physics.applyGravity(this);

		// Flapping animation
		this.rotation = Math.min(Math.max(this.velocity * this.rotationSpeed, -Math.PI / 4), Math.PI / 4);

		if (this.y < 0) {
			this.y = 0;
			this.velocity = 0;
		}

		if (this.physics.checkCollisionWithGround(this, canvasHeight)) {
			return true; // Collision with ground
		}

		if (this.physics.checkCollisionWithPipes(this, pipes, pipeWidth, pipeGap)) {
			return true; // Collision with pipes
		}

		return false; // No collision
	}

	draw(ctx) {
		ctx.save();
		ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
		ctx.rotate(this.rotation);
		ctx.drawImage(this.birdImage, -this.width / 2, -this.height / 2, this.width, this.height);
		ctx.restore();
	}

	flap() {
		this.physics.applyLift(this);
	}
}

window.onload = function () {
	const canvas = document.getElementById('gameCanvas');
	const ctx = canvas.getContext('2d');
	const scoreBoard = document.getElementById('scoreBoard');
	const currentScore = document.getElementById('currentScore');
	const bestScore = document.getElementById('bestScore');
	const birdImage = new Image();
	birdImage.src = 'images/Flappy-Bird-PNG-HD.png';
	const backgroundImage = new Image();
	let backgroundX = 0;
	backgroundImage.src = 'images/flap.png';
	const restartButton = document.getElementById('restartButton');

	const physics = new Physics(0.6,);
	const bird = new Bird(50, 300, 20, 20, 0.05, birdImage, physics);

	const pipeWidth = bird.width * 2;
	const pipeGap = canvas.height * 0.25;
	const pipeSpeed = 2;
	const pipeFrequency = 1000; // 1 second

	let pipes = [];
	let score = 0;
	let bestScoreValue = localStorage.getItem('bestScore') || 0;
	bestScore.textContent = bestScoreValue;
	let gameOver = false;
	let lastPipeTime = 0;
	let imagesLoaded = 0;
	const totalImages = 2;
	const jumpHeight = pipeGap / 2;

	function drawBackground() {
		ctx.drawImage(backgroundImage, backgroundX, 0, canvas.width, canvas.height);
		ctx.drawImage(backgroundImage, backgroundX + canvas.width, 0, canvas.width, canvas.height);

		if (!gameOver) {
			backgroundX -= 0.5; // Измените это значение для настройки скорости движения фона
			if (backgroundX <= -canvas.width) {
				backgroundX = 0;
			}
		}
	}

	function drawPipes() {
		ctx.fillStyle = 'green';
		pipes.forEach(pipe => {
			ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
			ctx.fillRect(pipe.x, pipe.topHeight + pipeGap, pipeWidth, canvas.height - pipe.topHeight - pipeGap);
		});
	}

	function updatePipes() {
		if (!gameOver) {
			const currentTime = new Date().getTime();
			if (currentTime - lastPipeTime > pipeFrequency) {
				const topHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
				pipes.push({
					x: canvas.width,
					topHeight: topHeight
				});
				lastPipeTime = currentTime;
			}

			pipes.forEach(pipe => {
				pipe.x -= pipeSpeed;

				if (!pipe.passed && bird.x > pipe.x + pipeWidth / 2) {
					score++;
					currentScore.textContent = score;
					pipe.passed = true;
				}

				if (pipe.x + pipeWidth < 0) {
					pipes.shift();
				}
			});
		}
	}
	function drawGlowingText(ctx, text, x, y, fontSize, glowColor, textColor) {
		ctx.font = `${fontSize}px 'Digital-7', monospace`;
		ctx.shadowColor = glowColor;
		ctx.shadowBlur = 10;
		ctx.fillStyle = glowColor;
		ctx.fillText(text, x, y);
		ctx.shadowBlur = 0;
		ctx.fillStyle = textColor;
		ctx.fillText(text, x, y);
	}

	function drawScoreboard() {
		const scoreboardWidth = 200;
		const scoreboardHeight = 100;
		const scoreboardX = canvas.width - scoreboardWidth - 10;
		const scoreboardY = 10;

		// рисуем табло
		ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
		ctx.fillRect(scoreboardX, scoreboardY, scoreboardWidth, scoreboardHeight);

		// выодим текущий счёт
		drawGlowingText(ctx, `Score: ${score}`, scoreboardX + 10, scoreboardY + 40, 24, '#00ff00', '#ffffff');

		// Выводим рекорд
		drawGlowingText(ctx, `Best: ${bestScoreValue}`, scoreboardX + 10, scoreboardY + 80, 24, '#00ff00', '#ffffff');
	}

	function gameLoop() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBackground();

		bird.draw(ctx);
		if (bird.update(canvas.height, pipes, pipeWidth, pipeGap)) {
			gameOver = true;
		}

		drawPipes();
		updatePipes();

		drawScoreboard();

		if (!gameOver) {
			requestAnimationFrame(gameLoop);
		} else {
			ctx.fillStyle = 'red';
			ctx.font = '40px Arial';
			ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);

			if (gameOver && score > bestScoreValue) {
				bestScoreValue = score;
				localStorage.setItem('bestScore', bestScoreValue);
			}
			restartButton.style.display = 'block';
		}
	}

	function startGame() {
		if (imagesLoaded === totalImages) {
			gameLoop();
		}
	}

	birdImage.onload = function () {
		imagesLoaded++;
		startGame();
	};

	backgroundImage.onload = function () {
		imagesLoaded++;
		startGame();
	};

	function restartGame() {
		bird.x = 50;
		bird.y = 300;
		bird.velocity = 0;
		bird.rotation = 0;
		pipes = [];
		score = 0;
		gameOver = false;
		currentScore.textContent = score;
		restartButton.style.display = 'none';
		gameLoop();
		backgroundX = 0;
	}

	document.addEventListener('keydown', (event) => {
		if (!gameOver && event.code === 'Space') {
			bird.flap();
		}
	});

	restartButton.addEventListener('click', restartGame);
};