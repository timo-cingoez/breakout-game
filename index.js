const grid = document.querySelector('.grid');
const scoreEl = document.getElementById('score');
const infoEl = document.querySelector('.info');
const BLOCKWIDTH = 100;
const BLOCKHEIGHT = 20;
const USERSTARTCOORDINATES = {
    left: 230,
    bottom: 10
};
const BALLSTARTCOORDINATES = {
    left: 270,
    bottom: 40
};
const BOARDWIDTH = 560;
const BOARDHEIGHT = 300;
const BALLDIAMETER = 20;

let currentUserPosition = USERSTARTCOORDINATES;
let currentBallPosition = BALLSTARTCOORDINATES;

let ballInterval;
let ballDirection = {
    x: 2,
    y: 2
};

let score = 0;

class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis];
        this.bottomRight = [xAxis + BLOCKWIDTH, yAxis];
        this.topLeft = [xAxis, yAxis + BLOCKHEIGHT];
        this.topRight = [xAxis + BLOCKWIDTH, yAxis + BLOCKHEIGHT];
    }
}

// All visible blocks within the grid.
const blocks = [
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),
    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),
    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210)
];

function addBlocks() {
    for (let i = 0; i < blocks.length; i++) {
        const block = document.createElement('div');
        block.setAttribute('data-id', i);
        block.classList.add('block');
        block.style.left = blocks[i].bottomLeft[0] + 'px';
        block.style.bottom = blocks[i].bottomLeft[1] + 'px';
        grid.appendChild(block);
    }
}

addBlocks();

// Create and append user element.
const user = document.createElement('div');
user.classList.add('user');
updateUserPosition();
grid.appendChild(user);

// Input handling.
function moveUser(event) {
    switch (event.key) {
        case 'ArrowLeft':
            if (currentUserPosition.left > 0) {
                currentUserPosition.left -= 10;
            }
            break;

        case 'ArrowRight':
            if (currentUserPosition.left < BOARDWIDTH - BLOCKWIDTH) {
                currentUserPosition.left += 10;
            }
            break;

        case 'ArrowUp':
            if (currentUserPosition.bottom < BOARDHEIGHT - BLOCKHEIGHT) {
                currentUserPosition.bottom += 10;
            }
            break;

        case 'ArrowDown':
            if (currentUserPosition.bottom > 0) {
                currentUserPosition.bottom -= 10;
            }
            break;
    }
    updateUserPosition();
}

function updateUserPosition() {
    user.style.left = currentUserPosition.left + 'px';
    user.style.bottom = currentUserPosition.bottom + 'px';
}

document.addEventListener('keydown', moveUser);

// Create and append ball element.
const ball = document.createElement('div');
ball.classList.add('ball');
updateBallPosition();
grid.appendChild(ball);

function updateBallPosition() {
    ball.style.left = currentBallPosition.left + 'px';
    ball.style.bottom = currentBallPosition.bottom + 'px';
}

function moveBall() {
    currentBallPosition.left += ballDirection.x;
    currentBallPosition.bottom += ballDirection.y;
    updateBallPosition();
    checkCollisions();
}

function startGame() {
    clearInterval(ballInterval);
    currentUserPosition = USERSTARTCOORDINATES;
    updateUserPosition();
    currentBallPosition = BALLSTARTCOORDINATES;
    updateBallPosition();
    scoreEl.innerText = 0;
    ballInterval = setInterval(moveBall, 20);
}

function checkCollisions() {
    // Check block collisions.
    for (let i = 0; i < blocks.length; i++) {
        if (
            (currentBallPosition.left > blocks[i].bottomLeft[0] && currentBallPosition.left < blocks[i].bottomRight[0]) &&
            ((currentBallPosition.bottom + BALLDIAMETER) > blocks[i].bottomLeft[1] && currentBallPosition.bottom < blocks[i].topLeft[1])
        ) {
            const allBlocks = Array.from(document.querySelectorAll('.block'));
            allBlocks[i].classList.remove('block');
            blocks.splice(i, 1);
            changeBallDirection();
            score++;
            scoreEl.innerText = score;

            // WIN
            if (blocks.length === 0) {
                infoEl.innerText = 'YOU WON';
                clearInterval(ballInterval);
                document.removeEventListener('keydown', moveUser);
            }
        }
    }

    // Check user collisions.
    if (
        (currentBallPosition.left > currentUserPosition.left && currentBallPosition.left < currentUserPosition.left + BLOCKWIDTH) &&
        (currentBallPosition.bottom > currentUserPosition.bottom && currentBallPosition.bottom < currentUserPosition.bottom + BLOCKHEIGHT)
    ) {
        changeBallDirection();
    }

    // Check wall collisions.
    if (currentBallPosition.left >= (BOARDWIDTH - BALLDIAMETER) || currentBallPosition.bottom >= (BOARDHEIGHT - BALLDIAMETER) || currentBallPosition.left <= 0) {
        changeBallDirection();
    }

    // GAME OVER
    if (currentBallPosition.bottom <= 0) {
        clearInterval(ballInterval);
        document.removeEventListener('keydown', moveUser);
        infoEl.innerHTML = 'GAME OVER';
    }
}

function changeBallDirection() {
    // MOVING TOWARDS TOP RIGHT
    if (ballDirection.x === 2 && ballDirection.y === 2) {
        ballDirection.y = -2;
        return;
    }
    if (ballDirection.x === 2 && ballDirection.y === -2) {
        ballDirection.x = -2;
        return;
    }
    if (ballDirection.x === -2 && ballDirection.y === -2) {
        ballDirection.y = 2;
        return;
    }
    if (ballDirection.x === -2 && ballDirection.y === 2) {
        ballDirection.x = 2;
        return;
    }
}