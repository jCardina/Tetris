const grid = document.querySelector("#container");
const width = 10;
// const height = 20;
const scoreDisplay = document.getElementById("score");
let score = 0;
const startBtn = document.getElementById("start_button");
let nextRandom = 0;

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

// console.log(squares);

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
// console.log(random)


let currentTetromino = tetrominoes[random][0];





let draw = function () {
	currentTetromino.forEach(index => {
		squares[currentPosition + index].classList.add("tetromino");
		squares[currentPosition + index].style.backgroundColor = colors[random];
	});
}

// draw();

let undraw = function () {
	currentTetromino.forEach(index => {
		squares[currentPosition + index].classList.remove("tetromino");
		squares[currentPosition + index].style.backgroundColor = "transparent";
	});
}


let over = true;

let freeze = function () {

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
		// draw();
		gameOver();

		if (!over) {
			draw();
			console.log("not over");
		}
		// console.log(currentPosition + "c");
	}
}



let moveDown = function () {
	console.log(over);

	if(!over) {
		undraw();
		currentPosition += width;
		// console.log(currentPosition);
		draw();
		freeze();
	}
}

let moveLeft = function () {


	let isAtLeftEdge = currentTetromino.some(index => (currentPosition + index) % width === 0);

	let isLeftTaken = currentTetromino.some(index => squares[currentPosition + index - 1].classList.contains("taken"));

	if (!isAtLeftEdge && !isLeftTaken) {
		undraw();

		currentPosition -=1;
		draw();

	}


}

let moveRight = function () {


	let isAtRightEdge = currentTetromino.some(index => (currentPosition + index) % width === width - 1);

	let isRightTaken = currentTetromino.some(index => squares[currentPosition + index + 1].classList.contains("taken"));

	if (!isAtRightEdge && !isRightTaken) {
		undraw();

		currentPosition +=1;
		draw();

	}


}



let rotate = function () {

	//agregar bordes y otras piezas

	undraw();
	currentRotation++;

	if (currentRotation == currentTetromino.length) {
		currentRotation = 0;
	}

	currentTetromino = tetrominoes[random][currentRotation];
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

let addScore = function () {

	for (i = 0; i < 199; i += width) {

		const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

		let isRowTaken = row.every(index => squares[index].classList.contains("taken"));

		if (isRowTaken) {
			// clearInterval(timer);
			score += 10;
			scoreDisplay.textContent = score;
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


			// currentPosition = 4;
			// draw();
			// timer = setInterval(moveDown, 1000);
			// return "red";
			// currentRotation = 0;

		}
		
	}
}

let gameOver = function () {

	let isPositionTaken = currentTetromino.some(index => squares[currentPosition + index].classList.contains("taken"));

	let isFirstRow = currentTetromino.some(index => squares[currentPosition + index + width].classList.contains("taken"));

	// let isFirstRow = function () {

	// 	let firstRow = false;

	// 	for (i = 0; i < 10; i++) {
	// 		if(squares[i].classList.contains("taken")) {
	// 			firstRow = true;
	// 			break;
	// 		}
	// 	}

	// 	return firstRow;
	// }

	// let row = isFirstRow();

	// let isFirstRow = currentTetromino.some(index => console.log(index));
		// currentPosition < 10);
	// console.log(row);
	// console.log(currentPosition + index - width);
	if (!isPositionTaken && isFirstRow) {
		draw();
	}

	if (isPositionTaken || isFirstRow) {
		// scoreDisplay.textContent = "";
		console.log("gameOver");
		clearInterval(timer);
		over = true;
	}

}

//arreglar rotacion de Ztetromino
//ordenar



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
		over = false;
		draw();
		timer = setInterval(moveDown, 1000);
		startBtn.textContent = "PAUSE";

		if (!started) {
			nextRandom = Math.floor(Math.random() * tetrominoes.length);
			displayNextTetromino();
			started = true;
			musicBtn.classList.remove("paused");
			audio.play();
		}
	}
});

// audio.autoplay = true;


musicBtn.addEventListener("click", function() {

	if (audio.paused) {
		audio.play();
		musicBtn.classList.remove("paused");
	} else {
		audio.pause();
		musicBtn.classList.add("paused");
	}
});

let songs = ["./bensound-endlessmotion.mp3", "./bensound-dreams.mp3", "./bensound-perception.mp3", "./bensound-summer.mp3", "./bensound-goinghigher.mp3"];

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

// musicBtn.click();

//agregar logo y reset
//niveles??
//higscore local

