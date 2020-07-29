
// -----GLOBAL VARIABLES-----//

let timer;
let started = false;
let over = true;
let score = 0;
let playedTetrominoes = 0;
let level = 1;
let change = 9;
let interval = 1000;
let currentPosition = 4;
let currentRotation = 0;
let topFive = [0, 0, 0, 0, 0];
let songPlaying = 0;

const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById("start_button");
const startBtnIcon = document.getElementById("startIcon");
const startBtnText = document.getElementById("startText");
const resetBtn = document.getElementById("reset");
const audio = document.getElementById("music");
const musicBtn = document.getElementById("musicBtn");

const width = 10;
const colors = [
'#ffca75',
'#49efa6',
'#ed6f84',
'#e7ec71',
'#50c2ff',
'#9ea2da',
'#e89ac2',
'#000000'
];

const jTetromino = [
[1, width + 1, width * 2 + 1, 2],
[width, width + 1, width + 2, width * 2 + 2],
[1, width + 1, width * 2 + 1, width * 2],
[width, width * 2, width * 2 + 1, width * 2 + 2]
];

const sTetromino = [
[0, width, width + 1, width * 2 + 1],
[width + 1, width + 2, width * 2, width * 2 + 1],
[0, width, width + 1, width * 2 + 1],
[width + 1, width + 2, width * 2, width * 2 + 1]
];

const tTetromino = [
[1, width, width + 1,width + 2],
[1, width + 1, width + 2, width * 2 + 1],
[width, width + 1, width + 2, width * 2 + 1],
[1,width,width+1,width*2+1]
];

const oTetromino = [
[0, 1, width, width + 1],
[0, 1, width, width + 1],
[0, 1, width, width + 1],
[0, 1, width, width + 1]
];

const iTetromino = [
[1, width + 1, width * 2 + 1, width * 3 + 1],
[width, width + 1, width + 2, width + 3],
[1, width + 1, width * 2 + 1, width * 3 + 1],
[width, width + 1, width + 2, width + 3]
];

const lTetromino = [
[1, width + 1, width * 2 + 1, 0],
[width + 2, width * 2, width * 2 + 1, width * 2 + 2],
[1, width + 1, width * 2 + 1, width * 2 + 2],
[width, width + 1, width + 2, width * 2]
];

const zTetromino = [
[1, width, width + 1, width * 2],
[width + 1, width, width * 2 + 2, width * 2 + 1],
[1, width, width + 1, width * 2],
[width + 1, width, width * 2 + 2, width * 2 + 1]
];

const bomb = [
[0, 1, width, width + 1],
[0, 1, width, width + 1],
[0, 1, width, width + 1],
[0, 1, width, width + 1]
];

const tetrominoes = [jTetromino, sTetromino, tTetromino, oTetromino, iTetromino, lTetromino, zTetromino, bomb];

const displayWidth = 4;
const displayIndex = 0;

const nextTetromino = [
[5, 6, 9, 13],
[6, 7, 9, 10],
[5, 8, 9, 10],
[5, 6, 9, 10],
[2, 6, 10, 14],
[5, 6, 10, 14],
[5, 6, 10, 11],
[5, 6, 9, 10]
];

//generate random tetrominoes index excluding the bomb
let random = Math.floor(Math.random()*(tetrominoes.length - 1));
let nextRandom = 0;
let currentTetromino = tetrominoes[random][0];


// -----FUNCTIONS-----//


let createBoard = function() {
	//create board grid with extra row at the bottom for last-row reference

	for (i = 0; i < 21; i++) {
		for (j = 0; j < 10; j++) {
			var square = document.createElement("div");

			if (i == 20) {
				square.classList.add("taken");
			}

			document.getElementById("container").appendChild(square);
		}
	}
}


let createDisplay = function() {
	//create next-tetromino display grid

	for (i = 0; i < 4; i++) {
		for (j = 0; j < 4; j++) {
			var square = document.createElement("div");

			document.getElementById("preview").appendChild(square);
		}
	}
}


let formatNumber = function(num) {
	//add "." as thousands separator
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}


let draw = function() {

	currentTetromino.forEach(index => {
		squares[currentPosition + index].classList.add("tetromino");
		squares[currentPosition + index].style.backgroundColor = colors[random];
	});
}


let undraw = function() {

	currentTetromino.forEach(index => {
		squares[currentPosition + index].classList.remove("tetromino");
		squares[currentPosition + index].style.backgroundColor = "transparent";
	});
}


let changeDifficulty = function() {
	//reduce interval every 10 played tetrominoes and add 50 points to the score

	if(playedTetrominoes > change && interval > 50) {

		clearInterval(timer);
		interval -= 50;
		timer = setInterval(moveDown, interval);
		change+=10;
		level++;
		score+=50;
		document.getElementById("level").textContent = level;
		scoreDisplay.textContent = formatNumber(score);
	}
}


let setBomb = function(grid) {

	//round position of top left corner to lowest 10 to locate rows to be affected
	let position = currentTetromino[0] + currentPosition;
	let line = Math.floor(position / 10) * 10;

	//disable controls to avoid glitches with animation
	over = true;

	//clear the two rows where the bomb is and add "flash"
	for (i = line; i < (line + 20); i ++) {

		squares[i].style.backgroundColor = "rgba(243, 255, 254, 0.53)";
		squares[i].classList.remove("taken", "tetromino");
	}

	//remove "flash" and readjust interval to avoid glitches
	clearInterval(timer);

	setTimeout(function(){

		for (i = line; i < (line + 20); i ++) {

			squares[i].style.backgroundColor = "transparent";
		}

		const squaresRemoved = squares.splice(line, 20);

		squares = squaresRemoved.concat(squares);

		squares.forEach(square => {
			grid.appendChild(square);
		});

		timer = setInterval(moveDown, interval);

		//enable controls
		over = false;

	}, 90);

	score +=20;
	scoreDisplay.textContent = formatNumber(score);
}


let displayNextTetromino = function() {

	displaySquares.forEach(square => {
		square.classList.remove("tetromino");
		square.style.backgroundColor = "transparent";
	});

	nextTetromino[nextRandom].forEach(index => {
		displaySquares[displayIndex + index].classList.add("tetromino");
		displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];

	});
}

let addScore = function(grid) {

	let rowsCleared = 0;

	for (i = 0; i < 199; i += width) {

		const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

		let isRowTaken = row.every(index => squares[index].classList.contains("taken"));

		if (isRowTaken) {

			rowsCleared++;
			score += 10;
			scoreDisplay.textContent = formatNumber(score);

			row.forEach(index => {
				squares[index].classList.remove("taken", "tetromino");
				squares[index].style.backgroundColor = "transparent";
			});

			//remove completed row and add it at the beginning
			const squaresRemoved = squares.splice(i, width);
			squares = squaresRemoved.concat(squares);

			squares.forEach(square => {
				grid.appendChild(square);
			});
		}
	}

	let comboNumberDisplay = document.querySelector("h4.combo span");
	let comboScoreDisplay = document.querySelector("h5.combo span");

	let comboNumber = [4, 3, 2];
	let comboScore = [45, 35, 25];

	//check if two or more rows were cleared together and add bonus points
	for (j = 0; j < comboNumber.length; j++) {
		
		if (rowsCleared == comboNumber[j] && random != 7) {

			score += comboScore[j];
			scoreDisplay.textContent = formatNumber(score);
			comboNumberDisplay.textContent = comboNumber[j];
			comboScoreDisplay.textContent = comboScore[j];
			animate();
			break;
		}
	}
}


let checkNewHighscore = function(score) {

	topFive.push(score);

	topFive.sort(function(value1, value2) {
		if (value1 < value2) {
			return 1;
		} else {
			return -1;
		}
	});

	topFive.pop();

	window.localStorage.highscores = JSON.stringify(topFive);
}


let getHighscores = function() {

	if (window.localStorage.highscores) {

		topFive = JSON.parse(window.localStorage.getItem("highscores"));

	} else {
		window.localStorage.setItem("highscores", JSON.stringify(topFive));
	}
}


let adjustFinalTetromino = function() {

	//copy tetromino array
	let adjustedTetro = currentTetromino.slice(0);

	//move tetromino up one row
	for (j = 0; j < adjustedTetro.length; j++) {
		adjustedTetro[j] -= width;
	}

	//remove squares with a negative index (outside the grid)
	adjustedTetro = adjustedTetro.filter(function(x){
		return x > -1 }
		);

	//check if tetromino can be displayed in the new position and move up one row
	for (i = 0; i < 3; i++) {

		let isNewPositionTaken = adjustedTetro.some(index => squares[currentPosition + index].classList.contains("taken"));

		if (isNewPositionTaken) {

			for (z = 0; z < adjustedTetro.length; z++) {
				adjustedTetro[z] -= width;
			}

			adjustedTetro = adjustedTetro.filter(function(x){
				return x > -1 }
				);
		} else {
			
			return adjustedTetro;
		}
	}
}


let gameOver = function() {

	//check if final tetromino can be displayed completely
	let isPositionTaken = currentTetromino.some(index => squares[currentPosition + index].classList.contains("taken"));

	let isFirstRow = currentTetromino.some(index => squares[currentPosition + index + width].classList.contains("taken"));

	
	if (isPositionTaken || isFirstRow) {

		clearInterval(timer);
		over = true;
		startBtn.style.display = "none";
		document.getElementById("gameover").style.display = "initial";
		
		if (score > 0) {
			checkNewHighscore(score);
		}

		let topScores = document.getElementsByClassName("highScore");

		for (i = 0; i < topScores.length; i++) {
			topScores[i].textContent = formatNumber(topFive[i]);
		}

		document.getElementById("highScoreTable").style.display = "initial";
	}


	if (!isPositionTaken && isFirstRow) {
		draw();
	}

	//move up and cut final tetromino if it doesn't fit
	if (isPositionTaken && isFirstRow) {

		let adjusted = adjustFinalTetromino();

		adjusted.forEach(index => {

			let squareToDraw = squares[currentPosition + index];

			squareToDraw.classList.add("tetromino", "taken");
			squareToDraw.style.backgroundColor = colors[random];
		});
	}
}


let freeze = function() {

	const grid = document.querySelector("#container");

	let isNextRowTaken = currentTetromino.some(index => squares[currentPosition + index + width].classList.contains("taken"));

	if (!isNextRowTaken) {
		return;
	}


	currentTetromino.forEach(index => {
		squares[currentPosition + index].classList.add("taken");
	});

	let exploded = false;

	if (random == 7) {
		setBomb(grid);
		exploded = true;
	}

	random = nextRandom;

	//set bomb as next tetromino each level change from level 6 onwards
	if (playedTetrominoes > 48 && (playedTetrominoes + 1) % 10 === 0) {
		nextRandom = 7;
	} else {
		nextRandom = Math.floor(Math.random() * (tetrominoes.length - 1));
	}

	currentRotation = 0;
	currentTetromino = tetrominoes[random][currentRotation];

	displayNextTetromino();

	addScore(grid);
	currentPosition = 4;

	gameOver();

	if (!over) {

		playedTetrominoes++;

		//set timeout to avoid glitches with bomb
		if (!exploded) {
			draw();
		} else {
			setTimeout(draw, 100);
		}

		changeDifficulty();
	}
}


let moveDown = function() {

	if(over) {
		return;
	}

	//check if next line is taken
	let isPositionTaken = currentTetromino.some(index => squares[currentPosition + index + width].classList.contains("taken"));

	if(!isPositionTaken) {
		undraw();
		currentPosition += width;
		draw();
	}

	freeze();
}


let moveLeft = function() {

	if(over) {
		return;
	}

	let isAtLeftEdge = currentTetromino.some(index => (currentPosition + index) % width === 0);

	let isLeftTaken = currentTetromino.some(index => squares[currentPosition + index - 1].classList.contains("taken"));

	if (!isAtLeftEdge && !isLeftTaken) {
		undraw();
		currentPosition--;
		draw();
	}
}


let moveRight = function() {

	if(over) {
		return;
	}

	let isAtRightEdge = currentTetromino.some(index => (currentPosition + index) % width === width - 1);

	let isRightTaken = currentTetromino.some(index => squares[currentPosition + index + 1].classList.contains("taken"));

	if (!isAtRightEdge && !isRightTaken) {
		undraw();
		currentPosition++;
		draw();
	}
}


let checkPosition = function() {

	let isNewPositionTaken = tetrominoes[random][currentRotation].some(index => squares[currentPosition + index].classList.contains("taken"));

	if (isNewPositionTaken) {
		return false;
	} else {
		return true;
	}
}


let checkRotationEdges = function() {

	//check if tetromino is at left or right edge of the grid
	let isLeft = currentTetromino.every(index => (currentPosition + index) % 10 < 3);
	let isRight = currentTetromino.every(index => (currentPosition + index) % 10 > 6);

	currentRotation++;
	currentRotation = (currentRotation % 4 + 4) % 4;

	let isPositionAvailable;

	//check if new rotation will split at left edge
	let willSplitL = tetrominoes[random][currentRotation].some(index => (currentPosition + index) % 10 > 8);

	if (isLeft && willSplitL) {

		currentPosition++;
		isPositionAvailable = checkPosition();

		if (!isPositionAvailable) {
			currentPosition--;
			currentRotation--;
			currentRotation = (currentRotation % 4 + 4) % 4;
			return;
		} else {
			return;
		}
	}

	//check twice (for iTetromino) if new rotation will split at right edge
	for (i = 0; i < 2; i++) {

		let willSplitR = tetrominoes[random][currentRotation].some(index => (currentPosition + index) % 10 == 0);

		if (isRight && willSplitR) {

			currentPosition--;
			isPositionAvailable = checkPosition();

			if (!isPositionAvailable && i == 0) {
				currentPosition++;
				currentRotation--;
				currentRotation = (currentRotation % 4 + 4) % 4;
				return;
			} else if (!isPositionAvailable && i == 1) {
				currentPosition += 2;
				currentRotation--;
				currentRotation = (currentRotation % 4 + 4) % 4;
				return;
			}
		}
	}
}


let rotate = function() {

	if(over) {
		return;
	}

	undraw();
	checkRotationEdges();
	
	let isPositionAvailable = checkPosition();

	if (!isPositionAvailable) {
		currentRotation--;
		currentRotation = (currentRotation % 4 + 4) % 4;
	}
	
	currentTetromino = tetrominoes[random][currentRotation];
	draw();
}


let animate = function() {
	//display combo information
	
	let combo = Array.from(document.querySelectorAll(".combo"));

	combo.forEach( elm => {
		elm.style.display = "initial";
		elm.classList.add("newCombo");
	});

	setTimeout( function() {

		combo.forEach( elm => {
			elm.style.display = "none";
			elm.classList.remove("newCombo");
		});
	}, 4980);
}


let controls = function(event) {

	if (event.keyCode === 37) {
		event.preventDefault();
		moveLeft();

	} else if (event.keyCode === 38) {
		event.preventDefault();
		rotate();

	} else if (event.keyCode === 39) {
		event.preventDefault();
		moveRight();

	} else if (event.keyCode === 40) {
		event.preventDefault();
		moveDown();
	}
}


let addButtonControls = function() {

	let arrows = Array.from(document.querySelectorAll(".controls button"));
	let actions = [rotate, moveDown, moveLeft, moveRight];

	for (var i = 0; i < arrows.length; i++) {
		arrows[i].addEventListener('click', actions[i]);
	}
}


let startPauseGame = function() {

	if (timer) {
		clearInterval(timer);
		timer = null;
		over = true;
		startBtnText.textContent = "START";
		startBtnIcon.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
		
	} else {
		
		if (!started) {
			
			nextRandom = Math.floor(Math.random() * (tetrominoes.length - 1));
			displayNextTetromino();
			started = true;
			resetBtn.style.display = "block";
			
			if (musicBtn.classList.contains("stopped")) {
				musicBtn.classList.remove("paused");
				musicBtn.classList.remove("stopped");
				audio.volume = 0.1;
				audio.play();
			}
		}

		over = false;
		draw();
		timer = setInterval(moveDown, interval);
		startBtnText.textContent = "PAUSE";
		startBtnIcon.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';

	}
}


let reset = function() {

	clearInterval(timer);
	timer = null;
	score = 0;
	scoreDisplay.textContent = "0";
	document.getElementById("level").textContent = "1";
	started = false;
	over = true;
	startBtnText.textContent = "START";
	startBtnIcon.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
	startBtn.style.display = "block";
	resetBtn.style.display = "none";
	document.getElementById("gameover").style.display = "none";
	random = Math.floor(Math.random()*(tetrominoes.length - 1));
	currentTetromino = tetrominoes[random][0];
	currentPosition = 4;
	level = 1;
	change = 9;
	interval = 1000;
	playedTetrominoes = 0
	document.getElementById("highScoreTable").style.display = "none";

	for (var i = 0; i < 200; i++) {
		squares[i].classList.remove("taken", "tetromino");
		squares[i].style.backgroundColor = "transparent";
	}

	displaySquares.forEach(square => {
		square.classList.remove("tetromino");
		square.style.backgroundColor = "transparent";
	});
}


let playPauseMusic = function() {

	if (audio.paused) {
		audio.play();
		musicBtn.classList.remove("paused");
	} else {
		audio.pause();
		musicBtn.classList.add("paused");
	}
}


let changeSong = function() {

	let songs = ["./music/bensound-endlessmotion.mp3", "./music/bensound-dreams.mp3", "./music/bensound-perception.mp3", "./music/bensound-summer.mp3", "./music/bensound-goinghigher.mp3"];
	
	songPlaying++;

	if (songPlaying > 4) {

		songPlaying = 0;
	}

	audio.src = songs[songPlaying];
	audio.pause();
	audio.load();
	audio.play();
}


//-----CREATE GRIDS-----//

createBoard();
createDisplay();

let squares = Array.from(document.querySelectorAll(".grid div"));
let displaySquares = document.querySelectorAll(".mini-grid div");


//-----HANDLERS-----//

addButtonControls();
window.addEventListener("load", getHighscores);
document.addEventListener('keydown', controls);
startBtn.addEventListener('click', startPauseGame);
resetBtn.addEventListener('click', reset);
musicBtn.addEventListener("click", playPauseMusic);
audio.addEventListener('ended', changeSong);