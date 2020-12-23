const cols = 19;
const rows = 19;
const unit = 30;
const speed = 10;
let snake;
let food;
let dir;
let score;
let gameOver;
let dirChanged;

function setup() {
    let canvas = createCanvas(cols * unit, rows * unit);
    canvas.parent("canvasContainer");
    select("#gameOver").elt.textContent = "";

    // init variables
    let startX = floor(cols / 2);
    let startY = floor(rows / 2);
    snake = new Array(createVector(startX, startY));
    dir = createVector(0, 0);
    score = 0;
    food = getFreeSpot();
    gameOver = false;
    dirChanged = false;
}

function draw() {
    // show score
    let percent = (score / (cols * rows - 1) * 100).toFixed(2);
    select("#score").elt.textContent = `Score: ${score} (${percent}%)`;

    // draw background
    // background(0);
    noStroke();
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if ((i % 2 + j) % 2 === 0) {
                fill(0, 120, 120);
            } else {
                fill(0, 180, 100);
            }
            square(i * unit, j * unit, unit);
        }
    }

    let offset = floor(unit * 0.075);
    // draw snake
    fill(255);
    for (let i = 0; i < snake.length - 1; i++) {
        let w = abs(snake[i + 1].x - snake[i].x) * unit + unit - 2 * offset;
        let h = abs(snake[i + 1].y - snake[i].y) * unit + unit - 2 * offset;
        rect(min(snake[i].x, snake[i + 1].x) * unit + offset, min(snake[i].y, snake[i + 1].y) * unit + offset, w, h);
    }
    fill(0, 0, 255);
    square(snake[0].x * unit + offset, snake[0].y * unit + offset, unit - offset * 2);

    // draw food
    if (food) {
        fill(255, 0, 0);
        square(food.x * unit + offset, food.y * unit + offset, unit - offset * 2);
    }

    // update game status all x frames as long as game not over
    if (frameCount % speed === 0 && !gameOver) {
        // move snake
        let newHead = createVector(snake[0].x + dir.x, snake[0].y + dir.y);
        snake.unshift(newHead);

        // check if food reached
        if (isEating()) {
            food = getFreeSpot();
            score++;
        } else {
            snake.pop();
        }

        // check if game is over
        if (isGameOver()) {
            gameOver = true;
            select("#gameOver").elt.textContent = "Game Over! Press Enter to continue.";
        } else if (isGameWon()) {
            gameOver = true;
            select("#gameOver").elt.textContent = "You won! Press Enter to continue.";
        }

        // reset dirChanged to receive new user input
        dirChanged = false;
    }
}

function keyPressed() {
    if (gameOver && key === "Enter") { // restart game
        setup();
    } else if (!dirChanged) { // change direction
        switch (key) {
            case "ArrowUp":
                if (dir.y !== 1) {
                    dir = createVector(0, -1);
                    dirChanged = true;
                }
                break;
            case "ArrowDown":
                if (dir.y !== -1) {
                    dir = createVector(0, 1);
                    dirChanged = true;
                }
                break;
            case "ArrowRight":
                if (dir.x !== -1) {
                    dir = createVector(1, 0);
                    dirChanged = true;
                }
                break;
            case "ArrowLeft":
                if (dir.x !== 1) {
                    dir = createVector(-1, 0);
                    dirChanged = true;
                }
                break;
            default:
                break;
        }
    }
}

function isGameOver() {
    let head = snake[0];
    let edgeCollision = head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows;

    let bodyCollision = false;
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            bodyCollision = true;
            break;
        }
    }
    return edgeCollision || bodyCollision;
}

function isGameWon() {
    return snake.length === cols * rows;
}

function getFreeSpot() {
    // get all possible spots in the grid
    let spots = [];
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let spotTaken = false;
            for (let k = 0; k < snake.length; k++) {
                if (snake[k].x === i && snake[k].y === j) {
                    spotTaken = true;
                    break;
                }
            }
            if (!spotTaken) {
                spots.push(createVector(i, j));
            }
        }
    }
    // choose random spot
    return random(spots);
}

function isEating() {
    let head = snake[0];
    return head.x === food.x && head.y === food.y;
}