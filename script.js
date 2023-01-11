const CANVAS_WIDTH_SIZE = 600;
const CANVAS_HEIGHT_SIZE = 420;
const CELL_SIZE = 20;
const WIDTH = CANVAS_WIDTH_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_HEIGHT_SIZE / CELL_SIZE;

const DIRECTION = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
}

const REDRAW_INTERVAL = 50;
let move_interval;

const AUDIO_EAT = new Audio('assets/sound/eat.mp3');

function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    }
}

function initHeadAndBody() {
    let head = initPosition();
    let body = [{x: head.x, y: head.y}];
    return {
        head: head,
        body: body,
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4);
}

function initSnake() {
    return {
        ...initHeadAndBody(),
        direction: initDirection(),
        score: 0,
    }
}
let snake = initSnake();

let apples = [{
    position: initPosition(),
},
{
    position: initPosition(),
}];

let life = 3;
let potion = {
    position: initPosition(),
};

let level = [
    {
        speed: 120,
    },
    {
        speed: 110,
        wall: [
            {
                start: {
                    x: 5,
                    y: 10,
                },
                end: {
                    x: 25,
                    y: 10,
                }
            }
        ],
    },
    {
        speed: 100,
        wall: [
            {
                start: {
                    x: 5,
                    y: 8,
                },
                end: {
                    x: 25,
                    y: 8,
                }
            },
            {
                start: {
                    x: 5,
                    y: 12,
                },
                end: {
                    x: 25,
                    y: 12,
                }
            }
        ],
    },
    {
        speed: 90,
        wall: [
            {
                start: {
                    x: 0,
                    y: 10,
                },
                end: {
                    x: 30,
                    y: 10,
                }
            },
            {
                start: {
                    x: 15,
                    y: 0,
                },
                end: {
                    x: 15,
                    y: 10,
                }
            }
        ],
    },
    {
        speed: 80,
        wall: [
            {
                start: {
                    x: 0,
                    y: 10,
                },
                end: {
                    x: 30,
                    y: 10,
                }
            },
            {
                start: {
                    x: 15,
                    y: 0,
                },
                end: {
                    x: 15,
                    y: 21,
                }
            }
        ],
    }
];
let current_level = 0;
let next_level = 1;

// function drawCell(ctx, x, y, color) {
//     ctx.fillStyle = color;
//     ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
// }

function drawWall(ctx, wall) {
    for (let i = 0; i < wall.length; i++) {
        let srt = wall[i].start;
        let end = wall[i].end;

        for( let x = srt.x; x <= end.x; x++) {
            for( let y = srt.y; y <= end.y; y++) {
                insertImage(ctx, x, y, "wall");
            }
        }
    }
}

function insertImage(ctx, x, y, name) {
    let image = document.createElement("img");
    image.src = `assets/images/${name}.png`;

    ctx.drawImage(image, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawStatus() {
    let statusCanvas = document.getElementById("statusBoard");
    let ctx = statusCanvas.getContext("2d");

    ctx.clearRect(0, 0, CANVAS_WIDTH_SIZE, CELL_SIZE);

    for (let i = 0; i < life; i++) {
        insertImage(ctx, i, 0, "heart");
    }

    ctx.color = "black";

    // speed
    ctx.font = "16px Quicksand";
    ctx.textAlign = "center";
    ctx.fillText(`Speed: ${level[current_level].speed} ms`, CANVAS_WIDTH_SIZE/2, 16, 140);

    // score
    ctx.font = "20px Quicksand";
    ctx.textAlign = "end";
    ctx.fillText(`Score: ${snake.score}`, CANVAS_WIDTH_SIZE, 15);

    // level
    let levelCanvas = document.getElementById("level");
    let levelCtx = levelCanvas.getContext("2d");

    levelCtx.clearRect(0, 0, 140, 32);

    levelCtx.color = "black";
    levelCtx.font = "bold 20px Quicksand";
    levelCtx.textAlign = "center";
    levelCtx.fillText(`Level ${current_level + 1}`, 70, 24, 140);

}

function getCurrentLevel(ctx, score) {

    if (score > 25) {
        ctx.fillText(`WIN`, 500, 580);
        // return;
    }

    if (score >= 0 && score < 5) {
        current_level = 0;
    } else if (score >= 5 && score < 10) {
        current_level = 1;
    } else if (score >= 10 && score < 15) {
        current_level = 2;
    } else if (score >= 15 && score < 20) {
        current_level = 3;
    } else if (score >= 20 && score < 25) {
        current_level = 4;
    }

    if (current_level == next_level) {
        next_level++;
        let audio = new Audio('assets/sound/level-up.mp3');
        audio.play();
    }

    move_interval = level[current_level].speed;
    ctx.fillText(`Level : ${current_level + 1}`, 500, 580);
    if (current_level > 0) {
        drawWall(ctx, level[current_level].wall);
    }
}

function checkPrime(number) {
    if (number < 2) {
        return false;
    }

    for (let i = 2; i < number; i++) {
        if (number % i == 0) {
            return false;
        }
    }
    return true;
}

function draw() {
    setInterval(function() {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_WIDTH_SIZE, CANVAS_HEIGHT_SIZE);

        insertImage(ctx, snake.head.x, snake.head.y, "snake-head");

        for (let i = 1; i < snake.body.length; i++) {
            insertImage(ctx, snake.body[i].x, snake.body[i].y, "snake-body");
        }

        getCurrentLevel(ctx, snake.score);

        for (let i = 0; i < apples.length; i++) {
            let apple = apples[i];
            insertImage(ctx, apple.position.x, apple.position.y, "apple");
        }

        if (checkPrime(snake.score)) {
            insertImage(ctx, potion.position.x, potion.position.y, "potion");
        }

        drawStatus();

    }, REDRAW_INTERVAL);
}

function teleport(snake) {
    if (snake.head.x < 0) {
        snake.head.x = CANVAS_WIDTH_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.x >= WIDTH) {
        snake.head.x = 0;
    }
    if (snake.head.y < 0) {
        snake.head.y = CANVAS_HEIGHT_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.y >= HEIGHT) {
        snake.head.y = 0;
    }
}

function eat(snake, apples, potion) {
    for (let i = 0; i < apples.length; i++) {
        let apple = apples[i];
        if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
            apple.position = initPosition();
            snake.score++;
            snake.body.push({x: snake.head.x, y: snake.head.y});
            AUDIO_EAT.play();
        }
    }

    if (checkPrime(snake.score)) {
        if (snake.head.x == potion.position.x && snake.head.y == potion.position.y) {
            potion.position = initPosition();
            snake.score++;
            snake.body.push({x: snake.head.x, y: snake.head.y});
            AUDIO_EAT.play();
            life++;
        }
    }
}

function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apples, potion);
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apples, potion);
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apples, potion);
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apples, potion);
}

function checkCollision() {
    let isCollide = false;
    
    // cek collision antara snake head dan snake body
    for (let i = 1; i < snake.body.length; i++) {
        if (snake.head.x == snake.body[i].x && snake.head.y == snake.body[i].y) {
            isCollide = true;
        }
    }

    // cek collision antara snake head dan wall
    if (current_level > 0) {
        let wall = level[current_level].wall;
        for (let i = 0; i < wall.length; i++) {
            if (snake.head.x >= wall[i].start.x && snake.head.x <= wall[i].end.x && snake.head.y >= wall[i].start.y && snake.head.y <= wall[i].end.y) {
                console.log(snake.head.x, snake.head.y);
                isCollide = true;
            }
        }
    }

    if (isCollide) {
        life--;
        snake.body.splice(0, snake.body.length);
        snake.body.push({x: snake.head.x, y: snake.head.y});

        let audio_collision = new Audio('assets/sound/collision.mp3');
        audio_collision.play();

        if (life == 0) {
            let audio = new Audio('assets/sound/game-over.mp3');
            audio.play();

            // alert("Game over");
            showGameOverModal();
            // snake = initSnake();
        }
    }
    // return isCollide;
}

function move(snake) {
    switch (snake.direction) {
        case DIRECTION.LEFT:
            moveLeft(snake);
            break;
        case DIRECTION.RIGHT:
            moveRight(snake);
            break;
        case DIRECTION.DOWN:
            moveDown(snake);
            break;
        case DIRECTION.UP:
            moveUp(snake);
            break;
    }
    moveBody(snake);
    checkCollision();
    

    if (life > 0) {
        setTimeout(function() {
            move(snake);
        }, move_interval);
    } else {
        // life = 3;
        // initGame();
    }
}

function moveBody(snake) {
    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();
}

function turn(snake, direction) {
    const oppositeDirections = {
        [DIRECTION.LEFT]: DIRECTION.RIGHT,
        [DIRECTION.RIGHT]: DIRECTION.LEFT,
        [DIRECTION.DOWN]: DIRECTION.UP,
        [DIRECTION.UP]: DIRECTION.DOWN,
    }

    if (direction !== oppositeDirections[snake.direction]) {
        snake.direction = direction;
    }
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        turn(snake, DIRECTION.LEFT);
    } else if (event.key === "ArrowRight") {
        turn(snake, DIRECTION.RIGHT);
    } else if (event.key === "ArrowUp") {
        turn(snake, DIRECTION.UP);
    } else if (event.key === "ArrowDown") {
        turn(snake, DIRECTION.DOWN);
    }

})

function initGame() {
    move(snake);
}

function showGameOverModal() {
    const btnGameOver = document.getElementById("gameOverBtn");
    btnGameOver.click();

    const final_score = document.getElementById("finalScore");
    final_score.innerHTML = snake.score;
    
    const btnTryAgain = document.getElementById("tryAgainBtn");
    btnTryAgain.addEventListener("click", function() {
        snake = initSnake();
        life = 3;
        initGame();
    });
}


initGame();