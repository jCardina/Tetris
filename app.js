const grid = document.querySelector("#container");
const width = 10;
// const height = 20;
const score = document.getElementById("score");
const startBtn = document.getElementById("start_button");
let nextRandom = 0;


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
	});
}

// draw();

let undraw = function () {
	currentTetromino.forEach(index => {
		squares[currentPosition + index].classList.remove("tetromino");
	});
}




let freeze = function () {

	let isNextRowTaken = currentTetromino.some(index => squares[currentPosition + index + width].classList.contains("taken"));
	

	if (isNextRowTaken) {
		currentTetromino.forEach(index => {
			squares[currentPosition + index].classList.add("taken");
			
		});

		random = nextRandom;
		nextRandom = Math.floor(Math.random() * tetrominoes.length);
		currentTetromino = tetrominoes[random][currentRotation];
		currentPosition = 4;
		draw();
		displayNextTetromino();
	}
}



let moveDown = function () {
	undraw();
	currentPosition += width;
	draw();
	freeze();
}

let moveLeft = function () {


	let isAtLeftEdge = currentTetromino.some(index => (currentPosition + index) % width === 0);

	let isLeftTaken = currentTetromino.some(index => squares[currentPosition + index - 1].classList.contains("taken")); //(minuto 55.30)

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

//prueba

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

const nextTetromino = [[1, displayWidth+1, displayWidth*2+1, 2],
    [0, displayWidth, displayWidth+1, displayWidth*2+1],
    [1, displayWidth, displayWidth+1, displayWidth+2],
    [0, 1, displayWidth, displayWidth+1],
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
    ];


let displayNextTetromino = function () {


	displaySquares.forEach(square => {
		square.classList.remove("tetromino");
	});

	nextTetromino[nextRandom].forEach(index => {
		displaySquares[displayIndex + index].classList.add("tetromino");

	});
}

//SEGUIR desde 1:13:59


let controls = function (event) {

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

// moveDown();
draw();
let timer = setInterval(moveDown, 1000);
document.addEventListener('keyup', controls);

