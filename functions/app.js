const grid = document.querySelector("#container");
const width = 10;
// const height = 20;
const scoreDisplay = document.getElementById("score");
let score = 0;
const startBtn = document.getElementById("start_button");
let nextRandom = 0;
let interval = 1000;
let playedTetrominoes = 0;

const colors = [
'#ffca75',
'#49efa6',
'#ed6f84',
'#e7ec71',
'#50c2ff'
];


let createBoard = function () {


	for (i = 0; i < 21; i++) {
		for (j = 0; j < 10; j++) {
			var square = document.createElement("div");
			square.style.width = "30px";
			square.style.height = "30px";

			if (i == 20) {
				square.classList.add("taken");
			}

			document.getElementById("container").appendChild(square);

		}

	}
}

let createDisplay = function () {

	for (i = 0; i < 4; i++) {
		for (j = 0; j < 4; j++) {
			var square = document.createElement("div");
			square.style.width = "30px";
			square.style.height = "30px";


			document.getElementById("preview").appendChild(square);

		}

	}
}

createBoard();
createDisplay();

let squares = Array.from(document.querySelectorAll(".grid div"));


const lTetromino = [
[1, width+1, width*2+1, 2],
[width, width+1, width+2, width*2+2],
[1, width+1, width*2+1, width*2],
[width, width*2, width*2+1, width*2+2]
];

const zTetromino = [
[0,width,width+1,width*2+1],
[width+1, width+2,width*2,width*2+1],
[0,width,width+1,width*2+1],
[width+1, width+2,width*2,width*2+1]
];

const tTetromino = [
[1,width,width+1,width+2],
[1,width+1,width+2,width*2+1],
[width,width+1,width+2,width*2+1],
[1,width,width+1,width*2+1]
];

const oTetromino = [
[0,1,width,width+1],
[0,1,width,width+1],
[0,1,width,width+1],
[0,1,width,width+1]
];

const iTetromino = [
[1,width+1,width*2+1,width*3+1],
[width,width+1,width+2,width+3],
[1,width+1,width*2+1,width*3+1],
[width,width+1,width+2,width+3]
];


const tetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

let currentPosition = 4;
let currentRotation = 0;


let random = Math.floor(Math.random()*tetrominoes.length);


let currentTetromino = tetrominoes[random][0];


let draw = function () {

	// console.log(currentTetromino);
	currentTetromino.forEach(index => {
		// console.log([currentPosition + index]);
		squares[currentPosition + index].classList.add("tetromino");
		squares[currentPosition + index].style.backgroundColor = colors[random];
	});
	
}


let undraw = function () {
	currentTetromino.forEach(index => {
		squares[currentPosition + index].classList.remove("tetromino");
		squares[currentPosition + index].style.backgroundColor = "transparent";
	});
}


let over = true;


let change = 9;

let changeDifficulty = function() {

	console.log("change", change);

	if(playedTetrominoes > change && interval > 100) {
		clearInterval(timer);
		console.log("interval1", interval);
		interval -= 50;
		console.log("interval2", interval);
		timer = setInterval(moveDown, interval);
		change+=9;

	}


}

let freeze = function() {

	let isNextRowTaken = currentTetromino.some(index => squares[currentPosition + index + width].classList.contains("taken"));


	if (isNextRowTaken) {
		currentTetromino.forEach(index => {
			squares[currentPosition + index].classList.add("taken");

		});

		random = nextRandom;
		nextRandom = Math.floor(Math.random() * tetrominoes.length);
		currentRotation = 0;
		currentTetromino = tetrominoes[random][currentRotation];
		// console.log(currentPosition + "b");
		displayNextTetromino();
		addScore();
		currentPosition = 4;

		gameOver();

		if (!over) {
			playedTetrominoes++;
			console.log(playedTetrominoes, "played");
			draw();
			// console.log("not over");
			changeDifficulty();
			
		}
		// console.log(currentPosition + "c");
	}
}



let moveDown = function () {
	// console.log(over);

	let isPositionTaken = currentTetromino.some(index => squares[currentPosition + index + width].classList.contains("taken"));
	// console.log(isPositionAvailable, "positionrot");
	// console.log(over)

	if(!over && !isPositionTaken) {
		undraw();
		currentPosition += width;
		// console.log(currentPosition);
		draw();
		freeze();
	} else if (!over && isPositionTaken) {
		freeze();
	}
}

let moveLeft = function () {


	let isAtLeftEdge = currentTetromino.some(index => (currentPosition + index) % width === 0);

	let isLeftTaken = currentTetromino.some(index => squares[currentPosition + index - 1].classList.contains("taken"));

	if (!isAtLeftEdge && !isLeftTaken) {
		undraw();

		currentPosition--;
		draw();

	}


}

let moveRight = function () {


	let isAtRightEdge = currentTetromino.some(index => (currentPosition + index) % width === width - 1);

	let isRightTaken = currentTetromino.some(index => squares[currentPosition + index + 1].classList.contains("taken"));

	if (!isAtRightEdge && !isRightTaken) {
		undraw();

		currentPosition++;
		draw();

	}


}


let checkRotationEdges = function() {

	let rotated = currentTetromino.slice(0);
	
	let isLeft = rotated.every(index => (currentPosition + index) % 10 < 3);
	// console.log(isLeft, "left");

	let isRight = rotated.every(index => (currentPosition + index) % 10 > 6);
	// console.log(isRight, "right");

	currentRotation++; //++ % 4 y sacar if

	if (currentRotation == currentTetromino.length) {
		currentRotation = 0;
	}

	let isPositionAvailable;

	//LEFT
	// console.log(tetrominoes[random][currentRotation]);

	let willSplitL = tetrominoes[random][currentRotation].some(index => (currentPosition + index) % 10 > 8);
	// console.log(willSplitL, "splitL");

	if (isLeft && willSplitL) {

		currentPosition++;
		isPositionAvailable = checkPosition();
		// console.log(isPositionAvailable, "position");

		if (!isPositionAvailable) {
			currentPosition--;
			currentRotation--;
			if (currentRotation < 0) {
				currentRotation = 3;
			}
			return;
		}

	}


	//RIGHT

	for (i = 0; i < 2; i++) {
		let willSplitR = tetrominoes[random][currentRotation].some(index => (currentPosition + index) % 10 == 0);

		if (isRight && willSplitR) {

			currentPosition--;
			isPositionAvailable = checkPosition();

			if (!isPositionAvailable && i == 0) {
				currentPosition++;
				currentRotation--;
				if (currentRotation < 0) {
					currentRotation = 3;
				}
				return;
			} else if (!isPositionAvailable && i == 1) {
				currentPosition += 2;
				currentRotation--;
				if (currentRotation < 0) {
					currentRotation = 3;
				}
				return;
			}

		}

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


let rotate = function() {

	undraw();
	checkRotationEdges();
	
	let isPositionAvailable = checkPosition();
	// console.log(isPositionAvailable, "positionNeutro");

	if (!isPositionAvailable) {
		currentRotation--;
		if (currentRotation < 0) {
			currentRotation = 3;
		}
		// console.log(currentRotation, "rotation");
	}
	// console.log("before", currentTetromino);
	currentTetromino = tetrominoes[random][currentRotation];
	// console.log("after", currentTetromino);

	draw();
}


let displaySquares = document.querySelectorAll(".mini-grid div");
const displayWidth = 4;
let displayIndex = 0;

const nextTetromino = [
[5, 6, 9, 13],
[6, 7, 9, 10],
[5, 8, 9, 10],
[5, 6, 9, 10],
[2, 6, 10, 14]
];


let displayNextTetromino = function () {


	displaySquares.forEach(square => {
		square.classList.remove("tetromino");
		square.style.backgroundColor = "transparent";
	});

	nextTetromino[nextRandom].forEach(index => {
		displaySquares[displayIndex + index].classList.add("tetromino");
		displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];

	});
}
let timer;

let formatNumber = function(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

let addScore = function () {

	for (i = 0; i < 199; i += width) {

		const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

		let isRowTaken = row.every(index => squares[index].classList.contains("taken"));

		if (isRowTaken) {
			// clearInterval(timer);
			score += 10;
			scoreDisplay.textContent = formatNumber(score);
			row.forEach(index => {
				squares[index].classList.remove("taken", "tetromino");
				squares[index].style.backgroundColor = "transparent";
			});

			const squaresRemoved = squares.splice(i, width);
			squares = squaresRemoved.concat(squares);
			// console.log(squares);

			// squares[4].style.backgroundColor = "red";
			squares.forEach(square => {
				grid.appendChild(square);
			});

		}
		
	}
}


//prueba
let adjustedTetro;

let adjustFinalTetromino = function () {
	//copy of array
	adjustedTetro = currentTetromino.slice(0);

	// adjustedTetro = adjustedTetro.filter(function(x){
	// 	return x > -1 }
	// 	);

	for (j = 0; j < adjustedTetro.length; j++) {
		adjustedTetro[j] -= width;
	}
	// console.log(currentTetromino, "tetro");
	// console.log(adjustedTetro, "tetronuevo");

	adjustedTetro = adjustedTetro.filter(function(x){
		return x > -1 }
		);


	for (i = 0; i < 3; i++) {

		let isNewPositionTaken = adjustedTetro.some(index => squares[currentPosition + index].classList.contains("taken"));

		if (isNewPositionTaken) {

			for (z = 0; z < adjustedTetro.length; z++) {
				adjustedTetro[z] -= width;
			}

			adjustedTetro = adjustedTetro.filter(function(x){
				return x > -1 }
				);
			// console.log(adjustedTetro, "tetro");
		} else {
			break;
		}
	}

	// console.log(adjustedTetro, "tetronuevo");
	// console.log(currentTetromino, "tetroviejo");

}


let gameOver = function () {

	// console.log(currentTetromino);

	let isPositionTaken = currentTetromino.some(index => squares[currentPosition + index].classList.contains("taken"));

	let isFirstRow = currentTetromino.some(index => squares[currentPosition + index + width].classList.contains("taken"));

	
	if (isPositionTaken || isFirstRow) {
		// scoreDisplay.textContent = "";
		console.log("gameOver");
		clearInterval(timer);
		over = true;
		startBtn.style.display = "none";
		document.getElementById("gameover").style.display = "initial";
		if (score > 0) {
			console.log(score);
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

	// console.log(isPositionTaken, "position");
	// console.log(isFirstRow, "1row");

	if (isPositionTaken && isFirstRow) {

		adjustFinalTetromino();
		// console.log(currentTetromino, "tetro");

		adjustedTetro.forEach(index => {

			let squareToDraw = squares[currentPosition + index];

			squareToDraw.classList.add("tetromino");
			squareToDraw.style.backgroundColor = colors[random];

		});
	}	

}



let controls = function (event) {

	if (!over) {

		if (event.keyCode === 37) {
			moveLeft();

		} else if (event.keyCode === 38) {
			rotate();

		} else if (event.keyCode === 39) {
			moveRight();

		} else if (event.keyCode === 40) {
			moveDown();
		}
	}
}

let avoidScrolling = function (event) {

	if (event.keyCode === 37) {
		event.preventDefault();

	} else if (event.keyCode === 38) {
		event.preventDefault();

	} else if (event.keyCode === 39) {
		event.preventDefault();

	} else if (event.keyCode === 40) {
		event.preventDefault();
	}
}

let started = false;
let resetBtn = document.getElementById("reset");

document.addEventListener('keyup', controls);
window.addEventListener('keydown', avoidScrolling);



let audio = document.getElementById("music");
audio.volume = 0.2;
let musicBtn = document.getElementById("musicBtn");

startBtn.addEventListener('click', () => {

	if (timer) {
		clearInterval(timer);
		timer = null;
		over = true;
		startBtn.textContent = "START";
	} else {
		
		if (!started) {
			
			nextRandom = Math.floor(Math.random() * tetrominoes.length);
			displayNextTetromino();
			started = true;
			musicBtn.classList.remove("paused");
			audio.play();
			resetBtn.style.display = "initial";
		}

		over = false;
		draw();
		timer = setInterval(moveDown, interval);
		startBtn.textContent = "PAUSE";

	}
});



resetBtn.addEventListener("click", function() {

	clearInterval(timer);
	timer = null;
	score = 0;
	scoreDisplay.textContent = "0";
	started = false;
	over = true;
	startBtn.textContent = "START";
	startBtn.style.display = "initial";
	resetBtn.style.display = "none";
	document.getElementById("gameover").style.display = "none";
	random = Math.floor(Math.random()*tetrominoes.length);
	currentTetromino = tetrominoes[random][0];
	currentPosition = 4;
	document.getElementById("highScoreTable").style.display = "none";

	for (var i = 0; i < 200; i++) {
		squares[i].classList.remove("taken", "tetromino");
		squares[i].style.backgroundColor = "transparent";
	}

	displaySquares.forEach(square => {
		square.classList.remove("tetromino");
		square.style.backgroundColor = "transparent";
	});
});


musicBtn.addEventListener("click", function() {

	if (audio.paused) {
		audio.play();
		musicBtn.classList.remove("paused");
	} else {
		audio.pause();
		musicBtn.classList.add("paused");
	}
});

let songs = ["./music/bensound-endlessmotion.mp3", "./music/bensound-dreams.mp3", "./music/bensound-perception.mp3", "./music/bensound-summer.mp3", "./music/bensound-goinghigher.mp3"];

let songPlaying = 0;

audio.addEventListener('ended', function() {
	
	songPlaying++;

	if (songPlaying > 4) {

		songPlaying = 0;
	}

	audio.src = songs[songPlaying];
	audio.pause();
	audio.load();
	audio.play();
});

let topFive = [0, 0, 0, 0, 0];


let getHighscores = function() {

	if (window.localStorage.highscores) {

		topFive = JSON.parse(window.localStorage.getItem("highscores"));

	} else {
		window.localStorage.setItem("highscores", JSON.stringify(topFive));
	}

}




let checkNewHighscore = function(score) {

	topFive.push(score);
	console.log(topFive);

	let newHighScore = topFive.sort(function(value1, value2) {
		if (value1 < value2) {
			return 1;
		} else {
			return -1;
		}
	});

	newHighScore.pop();
	console.log(newHighScore);
	window.localStorage.highscores = JSON.stringify(newHighScore);


}



window.addEventListener("load", getHighscores);

//arreglar rotacion de Ztetromino
//ordenar


