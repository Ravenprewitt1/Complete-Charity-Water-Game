const rows = 10;
const cols = 8;

const sourceCell = { row: 0, col: 0 };
const goalCell = { row: rows - 1, col: cols - 1 };

const blockedCells = [
	{ row: 2, col: 4 },
	{ row: 3, col: 4 },
	{ row: 4, col: 1 },
	{ row: 6, col: 6 },
	{ row: 7, col: 2 }
];

const jugCells = [
	{ row: 1, col: 2 },
	{ row: 3, col: 6 },
	{ row: 5, col: 3 },
	{ row: 8, col: 5 }
];

const dirtyWaterCells = [
	{ row: 2, col: 1 },
	{ row: 4, col: 6 },
	{ row: 6, col: 3 }
];

const boardElement = document.getElementById('game-board');
const startButton = document.getElementById('start-water');
const resetButton = document.getElementById('reset-game');
const progressBar = document.getElementById('water-progress');
const progressText = document.getElementById('progress-text');
const statusMessage = document.getElementById('status-message');
const starElements = document.querySelectorAll('.star-icon');
const victoryOverlay = document.getElementById('victory-overlay');
const victoryMessage = document.getElementById('victory-message');
const victoryJugs = document.getElementById('victory-jugs');
const victoryPlayAgainButton = document.getElementById('victory-play-again');
const confettiLayer = document.getElementById('confetti-layer');
const lossOverlay = document.getElementById('loss-overlay');
const lossMessage = document.getElementById('loss-message');
const lossPlayAgainButton = document.getElementById('loss-play-again');

let board = [];
let waterIntervalId = null;
let tankFillIntervalId = null;
let progressValue = 0;
let waterStarted = false;
let isDragging = false;
let collectedJugCount = 0;
let confettiTimeoutId = null;
let isGameOver = false;

function isSameCell(a, b) {
	return a.row === b.row && a.col === b.col;
}

function updateStarTracker() {
	for (let index = 0; index < starElements.length; index++) {
		const star = starElements[index];
		const collected = index < collectedJugCount;

		star.classList.toggle('collected', collected);
		star.setAttribute('aria-label', collected ? 'Collected star' : 'Uncollected star');
	}
}

function collectJugAt(row, col) {
	const cell = getCell(row, col);

	if (!cell || !cell.hasJug) {
		return false;
	}

	cell.hasJug = false;
	collectedJugCount = Math.min(starElements.length, collectedJugCount + 1);
	updateStarTracker();
	statusMessage.textContent = `Water collected a jug! Stars: ${collectedJugCount}/${starElements.length}`;
	return true;
}

function launchConfetti() {
	const colors = ['#FFC907', '#2E9DF7', '#8BD1CB', '#4FCB53', '#FF902A'];
	confettiLayer.innerHTML = '';

	for (let index = 0; index < 90; index++) {
		const piece = document.createElement('span');
		const startX = Math.random() * 100;
		const drift = (Math.random() - 0.5) * 30;
		const durationMs = 1700 + Math.random() * 1700;
		const delayMs = Math.random() * 450;
		const spinDeg = 300 + Math.random() * 520;
		const color = colors[index % colors.length];

		piece.className = 'confetti-piece';
		piece.style.setProperty('--x-start', `${startX}vw`);
		piece.style.setProperty('--x-end', `${startX + drift}vw`);
		piece.style.setProperty('--fall-duration', `${durationMs}ms`);
		piece.style.setProperty('--fall-delay', `${delayMs}ms`);
		piece.style.setProperty('--spin', `${spinDeg}deg`);
		piece.style.setProperty('--confetti-color', color);

		confettiLayer.appendChild(piece);
	}

	if (confettiTimeoutId) {
		clearTimeout(confettiTimeoutId);
	}

	confettiTimeoutId = setTimeout(() => {
		confettiLayer.innerHTML = '';
		confettiTimeoutId = null;
	}, 3400);
}

function showVictoryScreen() {
	victoryMessage.textContent = 'You filled the tank one drop at a time.';
	victoryJugs.textContent = `Jugs collected: ${collectedJugCount}/${jugCells.length}`;
	victoryOverlay.classList.add('is-visible');
	victoryOverlay.setAttribute('aria-hidden', 'false');
	launchConfetti();
}

function hideVictoryScreen() {
	victoryOverlay.classList.remove('is-visible');
	victoryOverlay.setAttribute('aria-hidden', 'true');
	confettiLayer.innerHTML = '';

	if (confettiTimeoutId) {
		clearTimeout(confettiTimeoutId);
		confettiTimeoutId = null;
	}
}

function showLossScreen(message) {
	lossMessage.textContent = message;
	lossOverlay.classList.add('is-visible');
	lossOverlay.setAttribute('aria-hidden', 'false');
}

function hideLossScreen() {
	lossOverlay.classList.remove('is-visible');
	lossOverlay.setAttribute('aria-hidden', 'true');
}

function loseGame(message) {
	if (isGameOver) {
		return;
	}

	isGameOver = true;
	waterStarted = false;
	startButton.disabled = true;
	statusMessage.textContent = message;

	if (waterIntervalId) {
		clearInterval(waterIntervalId);
		waterIntervalId = null;
	}

	if (tankFillIntervalId) {
		clearInterval(tankFillIntervalId);
		tankFillIntervalId = null;
	}

	showLossScreen(message);
}

function createBoardData() {
	board = [];

	for (let row = 0; row < rows; row++) {
		const rowData = [];

		for (let col = 0; col < cols; col++) {
			rowData.push({
				type: 'dirt',
				hasWater: false,
				hasJug: false,
				hasDirtyWater: false
			});
		}

		board.push(rowData);
	}

	board[sourceCell.row][sourceCell.col].type = 'source';
	board[goalCell.row][goalCell.col].type = 'goal';

	for (let i = 0; i < blockedCells.length; i++) {
		const blocked = blockedCells[i];
		board[blocked.row][blocked.col].type = 'blocked';
	}

	for (let i = 0; i < jugCells.length; i++) {
		const jug = jugCells[i];

		if (isSameCell(jug, sourceCell) || isSameCell(jug, goalCell)) {
			continue;
		}

		if (board[jug.row][jug.col].type === 'dirt') {
			board[jug.row][jug.col].hasJug = true;
		}
	}

	for (let i = 0; i < dirtyWaterCells.length; i++) {
		const pocket = dirtyWaterCells[i];

		if (isSameCell(pocket, sourceCell) || isSameCell(pocket, goalCell)) {
			continue;
		}

		if (board[pocket.row][pocket.col].type === 'dirt') {
			board[pocket.row][pocket.col].hasDirtyWater = true;
		}
	}
}

function renderBoard() {
	boardElement.innerHTML = '';

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const cell = board[row][col];
			const cellElement = document.createElement('button');
			cellElement.className = 'cell';
			cellElement.dataset.row = String(row);
			cellElement.dataset.col = String(col);
			cellElement.type = 'button';
			cellElement.setAttribute('aria-label', `Cell ${row + 1}, ${col + 1}`);

			updateCellClass(cellElement, cell, row);
			boardElement.appendChild(cellElement);
		}
	}
}

function updateCellClass(cellElement, cell, row) {
	cellElement.className = 'cell';

	if (cell.hasWater) {
		cellElement.classList.add('water');
		return;
	}

	if (cell.type === 'dirt' && row === 0) {
		if (cell.hasDirtyWater) {
			cellElement.classList.add('dirty-pocket-top');
		} else {
			cellElement.classList.add('top-dirt');
		}

		if (cell.hasJug) {
			cellElement.classList.add('jug-top-dirt');
		}

		return;
	}

	if (cell.type === 'dirt' && cell.hasJug) {
		cellElement.classList.add('jug-dirt');
		return;
	}

	if (cell.type === 'dirt' && cell.hasDirtyWater) {
		cellElement.classList.add('dirty-pocket');
		return;
	}

	if (cell.type === 'tunnel' && cell.hasDirtyWater) {
		cellElement.classList.add('dirty-pocket-open');
		return;
	}

	if (cell.type === 'tunnel' && cell.hasJug) {
		cellElement.classList.add('jug-tunnel');
		return;
	}

	cellElement.classList.add(cell.type);
}

function getCell(row, col) {
	if (row < 0 || row >= rows || col < 0 || col >= cols) {
		return null;
	}

	return board[row][col];
}

function digCell(row, col) {
	const cell = getCell(row, col);

	if (!cell) {
		return;
	}

	if (isGameOver) {
		statusMessage.textContent = 'Round over. Press Reset or Try Again.';
		return;
	}

	if (waterStarted) {
		statusMessage.textContent = 'Water is flowing. Press Reset to dig again.';
		return;
	}

	if (cell.type === 'dirt') {
		cell.type = 'tunnel';

		if (cell.hasJug) {
			statusMessage.textContent = 'Jug uncovered! Route water through it to collect the star.';
		} else if (cell.hasDirtyWater) {
			statusMessage.textContent = 'Dirty water pocket found. Keep clean water away from it!';
		} else {
			statusMessage.textContent = 'Nice! Keep digging a path to the green tank.';
		}

	}

	renderBoard();
}

function digFromCellElement(cellElement) {
	if (!cellElement || !cellElement.classList.contains('cell')) {
		return;
	}

	const row = Number(cellElement.dataset.row);
	const col = Number(cellElement.dataset.col);
	digCell(row, col);
}

function findWaterPath() {
	const queue = [{ row: sourceCell.row, col: sourceCell.col, path: [] }];
	const visited = new Set([`${sourceCell.row}-${sourceCell.col}`]);

	while (queue.length > 0) {
		const current = queue.shift();

		if (current.row === goalCell.row && current.col === goalCell.col) {
			return current.path;
		}

		// We prioritize down movement to feel more like gravity.
		const directions = [
			{ rowChange: 1, colChange: 0 },
			{ rowChange: 0, colChange: 1 },
			{ rowChange: 0, colChange: -1 },
			{ rowChange: -1, colChange: 0 }
		];

		for (let i = 0; i < directions.length; i++) {
			const direction = directions[i];
			const nextRow = current.row + direction.rowChange;
			const nextCol = current.col + direction.colChange;
			const key = `${nextRow}-${nextCol}`;
			const nextCell = getCell(nextRow, nextCol);

			if (!nextCell || visited.has(key) || nextCell.type === 'dirt' || nextCell.type === 'blocked') {
				continue;
			}

			visited.add(key);
			queue.push({
				row: nextRow,
				col: nextCol,
				path: [...current.path, { row: nextRow, col: nextCol }]
			});
		}
	}

	return null;
}

function clearWater() {
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			board[row][col].hasWater = false;
		}
	}
}

function setProgress(value) {
	progressValue = Math.max(0, Math.min(100, value));
	progressBar.value = progressValue;
	progressText.textContent = `${progressValue}%`;
}

function animateWater(path) {
	if (isGameOver) {
		return;
	}

	if (!path || path.length === 0) {
		statusMessage.textContent = 'No path found. Dig more tunnels from blue spring to green tank.';
		waterStarted = false;
		return;
	}

	clearWater();
	board[sourceCell.row][sourceCell.col].hasWater = true;
	collectJugAt(sourceCell.row, sourceCell.col);
	renderBoard();

	let step = 0;

	if (waterIntervalId) {
		clearInterval(waterIntervalId);
	}

	waterIntervalId = setInterval(() => {
		if (step < path.length) {
			const point = path[step];
			collectJugAt(point.row, point.col);
			board[point.row][point.col].hasWater = true;

			if (board[point.row][point.col].hasDirtyWater) {
				renderBoard();
				loseGame('You lost! Clean water touched a dirty water pocket.');
				return;
			}

			renderBoard();
			step++;
			return;
		}

		clearInterval(waterIntervalId);
		waterIntervalId = null;
		fillTankToComplete();
	}, 260);
}

function fillTankToComplete() {
	if (isGameOver) {
		return;
	}

	statusMessage.textContent = 'Water reached the tank. Filling up...';
	setProgress(0);

	tankFillIntervalId = setInterval(() => {
		if (progressValue >= 100) {
			clearInterval(tankFillIntervalId);
			tankFillIntervalId = null;
			statusMessage.textContent = 'Success! The tank is full.';
			startButton.disabled = true;
			showVictoryScreen();
			return;
		}

		setProgress(progressValue + 4);
	}, 120);
}

function startWaterFlow() {
	if (waterStarted || isGameOver) {
		return;
	}

	waterStarted = true;
	statusMessage.textContent = 'Water started!';

	const path = findWaterPath();
	animateWater(path);
}

function resetGame() {
	if (waterIntervalId) {
		clearInterval(waterIntervalId);
		waterIntervalId = null;
	}

	if (tankFillIntervalId) {
		clearInterval(tankFillIntervalId);
		tankFillIntervalId = null;
	}

	waterStarted = false;
	isGameOver = false;
	collectedJugCount = 0;
	updateStarTracker();
	hideVictoryScreen();
	hideLossScreen();
	startButton.disabled = false;
	setProgress(0);
	createBoardData();
	renderBoard();
	statusMessage.textContent = 'Dig a path, then start the water.';
}

boardElement.addEventListener('pointerdown', (event) => {
	if (event.pointerType === 'mouse' && event.button !== 0) {
		return;
	}

	isDragging = true;
	boardElement.setPointerCapture(event.pointerId);
	digFromCellElement(event.target.closest('.cell'));
	event.preventDefault();
});

boardElement.addEventListener('pointermove', (event) => {
	if (!isDragging) {
		return;
	}

	const hoveredElement = document.elementFromPoint(event.clientX, event.clientY);

	if (!hoveredElement) {
		return;
	}

	digFromCellElement(hoveredElement.closest('.cell'));
	if (event.cancelable) {
		event.preventDefault();
	}
});

boardElement.addEventListener('pointerup', (event) => {
	isDragging = false;

	if (boardElement.hasPointerCapture(event.pointerId)) {
		boardElement.releasePointerCapture(event.pointerId);
	}
});

boardElement.addEventListener('pointercancel', (event) => {
	isDragging = false;

	if (boardElement.hasPointerCapture(event.pointerId)) {
		boardElement.releasePointerCapture(event.pointerId);
	}
});

boardElement.addEventListener('click', (event) => {
	const clicked = event.target;

	if (!clicked.classList.contains('cell')) {
		return;
	}

	const row = Number(clicked.dataset.row);
	const col = Number(clicked.dataset.col);
	digCell(row, col);
});

startButton.addEventListener('click', startWaterFlow);
resetButton.addEventListener('click', resetGame);
victoryPlayAgainButton.addEventListener('click', resetGame);
lossPlayAgainButton.addEventListener('click', resetGame);

resetGame();
