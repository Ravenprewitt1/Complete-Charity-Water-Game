const rows = 10;
const cols = 8;

const sourceCell = { row: 0, col: 0 };
const goalCell = { row: rows - 1, col: cols - 1 };

const baseLevels = [
	{
		mission: 'Build a safe beginner path to the tank while collecting all 4 jugs.',
		fact: '771 million people still live without clean water close to home.',
		blockedCells: [
			{ row: 3, col: 4 },
			{ row: 6, col: 6 },
			{ row: 7, col: 2 }
		],
		jugCells: [
			{ row: 1, col: 2 },
			{ row: 3, col: 6 },
			{ row: 5, col: 3 },
			{ row: 8, col: 5 }
		],
		dirtyWaterCells: [
			{ row: 4, col: 6 },
			{ row: 6, col: 3 }
		]
	},
	{
		mission: 'Plan around new rock blocks and keep water away from dirty pockets.',
		fact: 'Access to clean water can reduce waterborne diseases and save lives every day.',
		blockedCells: [
			{ row: 0, col: 4 },
			{ row: 1, col: 4 },
			{ row: 2, col: 4 },
			{ row: 3, col: 2 },
			{ row: 5, col: 5 },
			{ row: 7, col: 1 }
		],
		jugCells: [
			{ row: 1, col: 1 },
			{ row: 2, col: 6 },
			{ row: 6, col: 2 },
			{ row: 8, col: 4 }
		],
		dirtyWaterCells: [
			{ row: 1, col: 6 },
			{ row: 3, col: 5 },
			{ row: 5, col: 2 },
			{ row: 7, col: 6 }
		]
	},
	{
		mission: 'Use careful turns to collect every jug before reaching the tank.',
		fact: 'When communities get clean water, kids can spend more time in school.',
		blockedCells: [
			{ row: 0, col: 2 },
			{ row: 1, col: 2 },
			{ row: 2, col: 2 },
			{ row: 3, col: 5 },
			{ row: 4, col: 5 },
			{ row: 6, col: 4 },
			{ row: 7, col: 6 }
		],
		jugCells: [
			{ row: 1, col: 5 },
			{ row: 3, col: 1 },
			{ row: 5, col: 6 },
			{ row: 8, col: 2 }
		],
		dirtyWaterCells: [
			{ row: 1, col: 6 },
			{ row: 2, col: 6 },
			{ row: 4, col: 2 },
			{ row: 6, col: 1 },
			{ row: 7, col: 4 }
		]
	},
	{
		mission: 'Create a zigzag tunnel to dodge rock walls and protect clean water.',
		fact: 'Women and girls spend an estimated 200 million hours each day collecting water.',
		blockedCells: [
			{ row: 0, col: 3 },
			{ row: 1, col: 3 },
			{ row: 2, col: 3 },
			{ row: 3, col: 3 },
			{ row: 4, col: 5 },
			{ row: 5, col: 6 },
			{ row: 6, col: 1 },
			{ row: 8, col: 4 }
		],
		jugCells: [
			{ row: 1, col: 6 },
			{ row: 4, col: 2 },
			{ row: 6, col: 5 },
			{ row: 8, col: 3 }
		],
		dirtyWaterCells: [
			{ row: 1, col: 1 },
			{ row: 2, col: 1 },
			{ row: 3, col: 6 },
			{ row: 4, col: 6 },
			{ row: 6, col: 4 },
			{ row: 7, col: 5 }
		]
	},
	{
		mission: 'Final level: collect all jugs and guide water through a narrow safe route.',
		fact: 'Clean water projects can transform health, education, and local economies.',
		blockedCells: [
			{ row: 0, col: 4 },
			{ row: 1, col: 4 },
			{ row: 2, col: 1 },
			{ row: 2, col: 5 },
			{ row: 3, col: 5 },
			{ row: 5, col: 2 },
			{ row: 5, col: 6 },
			{ row: 6, col: 6 },
			{ row: 7, col: 3 },
			{ row: 8, col: 2 }
		],
		jugCells: [
			{ row: 1, col: 2 },
			{ row: 3, col: 6 },
			{ row: 6, col: 4 },
			{ row: 8, col: 5 }
		],
		dirtyWaterCells: [
			{ row: 1, col: 6 },
			{ row: 2, col: 6 },
			{ row: 3, col: 2 },
			{ row: 4, col: 3 },
			{ row: 6, col: 1 },
			{ row: 6, col: 5 },
			{ row: 7, col: 1 }
		]
	}
];

const difficultyConfigs = {
	easy: {
		label: 'Easy',
		blockedMultiplier: 0.6,
		dirtyMultiplier: 0.55
	},
	medium: {
		label: 'Medium',
		blockedMultiplier: 0.8,
		dirtyMultiplier: 0.8
	},
	hard: {
		label: 'Hard',
		blockedMultiplier: 1,
		dirtyMultiplier: 1
	}
};

const boardElement = document.getElementById('game-board');
const gamePage = document.querySelector('.game-page');
const gameTitle = document.querySelector('.game-title');
const levelList = document.getElementById('level-list');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
const levelFact = document.getElementById('level-fact');
const levelMission = document.getElementById('level-mission');
const topChrome = document.querySelector('.top-chrome');
const boardPanel = document.querySelector('.board-panel');
const hud = document.querySelector('.hud');
const startButton = document.getElementById('start-water');
const resetButton = document.getElementById('reset-game');
const progressBar = document.getElementById('water-progress');
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
let currentLevelIndex = 0;
let highestUnlockedLevelIndex = 0;
let currentDifficulty = 'medium';
let levels = buildLevelsForDifficulty(currentDifficulty);

function buildLevelsForDifficulty(difficultyKey) {
	const config = difficultyConfigs[difficultyKey] || difficultyConfigs.medium;
	const includeDirtyWater = difficultyKey === 'medium' || difficultyKey === 'hard';

	return baseLevels.map((level) => {
		const blockedCount = Math.max(1, Math.round(level.blockedCells.length * config.blockedMultiplier));
		const dirtyCount = includeDirtyWater
			? Math.max(1, Math.round(level.dirtyWaterCells.length * config.dirtyMultiplier))
			: 0;

		return {
			...level,
			blockedCells: level.blockedCells.slice(0, blockedCount),
			dirtyWaterCells: level.dirtyWaterCells.slice(0, dirtyCount),
			jugCells: [...level.jugCells]
		};
	});
}

function updateDifficultyButtons() {
	for (let index = 0; index < difficultyButtons.length; index++) {
		const button = difficultyButtons[index];
		const isCurrent = button.dataset.difficulty === currentDifficulty;

		button.classList.toggle('current', isCurrent);
		button.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
	}
}

function setDifficulty(difficultyKey) {
	if (!difficultyConfigs[difficultyKey] || difficultyKey === currentDifficulty) {
		return;
	}

	currentDifficulty = difficultyKey;
	levels = buildLevelsForDifficulty(currentDifficulty);
	currentLevelIndex = 0;
	highestUnlockedLevelIndex = 0;
	updateDifficultyButtons();
	resetGame();
	statusMessage.textContent = `${difficultyConfigs[currentDifficulty].label} mode selected. Complete levels to unlock more.`;
}

function getCurrentLevel() {
	return levels[currentLevelIndex];
}

function updateLevelPanel() {
	const level = getCurrentLevel();
	const levelNumber = currentLevelIndex + 1;

	levelFact.textContent = level.fact;
	levelMission.textContent = level.mission;
	gameTitle.textContent = `One Drop at a Time - Level ${levelNumber} (${difficultyConfigs[currentDifficulty].label})`;
	updateLevelListDisplay();
}

function updateLevelListDisplay() {
	if (!levelList) {
		return;
	}

	levelList.innerHTML = '';

	for (let index = 0; index < levels.length; index++) {
		const levelPill = document.createElement('button');
		const levelNumber = index + 1;
		const isCurrent = index === currentLevelIndex;
		const isUnlocked = index <= highestUnlockedLevelIndex;

		levelPill.className = 'level-pill';
		levelPill.type = 'button';
		levelPill.textContent = `Level ${levelNumber}`;
		levelPill.disabled = !isUnlocked;
		levelPill.setAttribute('aria-current', isCurrent ? 'true' : 'false');

		if (isUnlocked) {
			levelPill.addEventListener('click', () => {
				goToLevel(index);
			});
		}

		if (isCurrent) {
			levelPill.classList.add('current');
		}

		if (!isUnlocked) {
			levelPill.classList.add('locked');
		}

		levelList.appendChild(levelPill);
	}
}

function goToLevel(levelIndex) {
	if (levelIndex < 0 || levelIndex >= levels.length) {
		return;
	}

	if (levelIndex > highestUnlockedLevelIndex) {
		statusMessage.textContent = `Beat Level ${highestUnlockedLevelIndex + 1} to unlock more levels.`;
		return;
	}

	currentLevelIndex = levelIndex;
	resetGame();
}

function fitBoardToViewport() {
	if (!gamePage || !gameTitle || !topChrome || !boardPanel || !hud) {
		return;
	}

	const boardPanelStyles = window.getComputedStyle(boardPanel);
	const boardPanelPaddingX = parseFloat(boardPanelStyles.paddingLeft) + parseFloat(boardPanelStyles.paddingRight);
	const boardPanelPaddingY = parseFloat(boardPanelStyles.paddingTop) + parseFloat(boardPanelStyles.paddingBottom);
	const boardPanelRect = boardPanel.getBoundingClientRect();
	const panelInnerWidth = Math.max(0, boardPanelRect.width - boardPanelPaddingX);
	const panelInnerHeight = Math.max(0, boardPanelRect.height - boardPanelPaddingY);
	const boardHorizontalExtras = (cols - 1) + 8;
	const boardVerticalExtras = (rows - 1) + 8;
	const maxCellWidth = Math.floor((panelInnerWidth - boardHorizontalExtras) / cols);
	const maxCellHeight = Math.floor((panelInnerHeight - boardVerticalExtras) / rows);
	const preferredCellSize = Math.min(maxCellWidth, maxCellHeight, 88);
	const safeCellSize = Math.max(28, preferredCellSize);

	document.documentElement.style.setProperty('--cell-size', `${safeCellSize}px`);
}

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
	const level = getCurrentLevel();
	const isFinalLevel = currentLevelIndex === levels.length - 1;

	victoryMessage.textContent = `Level ${currentLevelIndex + 1} complete! ${level.mission}`;
	victoryJugs.textContent = `Jugs collected: ${collectedJugCount}/${level.jugCells.length}`;
	victoryPlayAgainButton.textContent = isFinalLevel ? 'Play From Level 1' : 'Next Level';
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
	const level = getCurrentLevel();
	const blockedCells = level.blockedCells;
	const jugCells = level.jugCells;
	const dirtyWaterCells = level.dirtyWaterCells;

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
			statusMessage.textContent = 'Jug uncovered! Route water through it to collect the jug.';
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
			highestUnlockedLevelIndex = Math.max(
				highestUnlockedLevelIndex,
				Math.min(levels.length - 1, currentLevelIndex + 1)
			);
			updateLevelListDisplay();
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
	updateLevelPanel();
	createBoardData();
	renderBoard();
	fitBoardToViewport();
	statusMessage.textContent = `Level ${currentLevelIndex + 1}: ${getCurrentLevel().mission}`;
}

function advanceToNextLevel() {
	const nextLevelIndex = (currentLevelIndex + 1) % levels.length;

	if (nextLevelIndex > highestUnlockedLevelIndex) {
		return;
	}

	currentLevelIndex = nextLevelIndex;
	resetGame();
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
victoryPlayAgainButton.addEventListener('click', advanceToNextLevel);
lossPlayAgainButton.addEventListener('click', resetGame);

for (let index = 0; index < difficultyButtons.length; index++) {
	const button = difficultyButtons[index];

	button.addEventListener('click', () => {
		const difficultyKey = button.dataset.difficulty;
		setDifficulty(difficultyKey);
	});
}

window.addEventListener('resize', fitBoardToViewport);
window.visualViewport?.addEventListener('resize', fitBoardToViewport);

updateDifficultyButtons();
resetGame();
