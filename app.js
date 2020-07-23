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
		// console.log([currentPosition + index]);
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
	// console.log(over);

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


//prueba
let adjustedTetro;

let adjustFinalTetromino = function () {
	// console.log(currentTetromino, "tetro");

	adjustedTetro = currentTetromino;

	adjustedTetro = adjustedTetro.filter(function(x){
		return x > -1 }
		);

	for (j = 0; j < adjustedTetro.length; j++) {
		adjustedTetro[j] -= width;
	}

	adjustedTetro = adjustedTetro.filter(function(x){
		return x > -1 }
		);

	// console.log(adjustedTetro, "tetro");

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

	console.log(currentTetromino);

	let isPositionTaken = currentTetromino.some(index => squares[currentPosition + index].classList.contains("taken"));

	let isFirstRow = currentTetromino.some(index => squares[currentPosition + index + width].classList.contains("taken"));

	
	if (isPositionTaken || isFirstRow) {
		// scoreDisplay.textContent = "";
		console.log("gameOver");
		clearInterval(timer);
		over = true;
		startBtn.style.display = "none";
		document.getElementById("gameover").style.display = "initial";

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


//arreglar rotacion de Ztetromino
//ordenar
//chequear game over con movedown manual
//cartel gameover




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
		console.log("hola");
		if (!started) {
			console.log("hola2");
			nextRandom = Math.floor(Math.random() * tetrominoes.length);
			displayNextTetromino();
			started = true;
			musicBtn.classList.remove("paused");
			audio.play();
			resetBtn.style.display = "initial";
		}

		over = false;
		draw();
		timer = setInterval(moveDown, 1000);
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

