const startButton = 
    document.getElementById('start-button');

const hitButton =
    document.getElementById('hit-button');

const ball =
    document.getElementById('ball');

const message =
    document.getElementById('message');

const score =
    document.getElementById('score');

let gameRunning = false;

let ballPosition = 0;

let animationId = null;

//成績
let atBasts = 0;
let hits = 0;

startButton.addEventListener('click', startGame);
