const CELL_SIZE = 20;
const CANVAS_SIZE = 600;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
}

// const MOVE_INTERVAL = 120;
let move_interval;

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

function initSnake(color) {
    return {
        color: color,
        ...initHeadAndBody(),
        direction: initDirection(),
        score: 0,
    }
}
let snake = initSnake("green");

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
    },
    {
        speed: 100,
    },
    {
        speed: 90,
    },
    {
        speed: 80,
    }
];
let current_level = 1;

function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function insertImage(ctx, x, y, name) {
    let image = document.createElement("img");
    image.src = `assets/${name}.png`;

    ctx.drawImage(image, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function getCurrentLevel(ctx, score) {

    if (score > 25) {
        ctx.fillText(`WIN`, 500, 580);
        return;
    }

    if (score >= 0 && score < 5) {
        current_level = 1;
    } else if (score >= 5 && score < 10) {
        current_level = 2;
    } else if (score >= 10 && score < 15) {
        current_level = 3;
    } else if (score >= 15 && score < 20) {
        current_level = 4;
    } else if (score >= 20 && score < 25) {
        current_level = 5;
    }

    move_interval = level[current_level - 1].speed;
    ctx.fillText(`Level : ${current_level}`, 500, 580);
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

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        
        // drawCell(ctx, snake.head.x, snake.head.y, snake.color);
        insertImage(ctx, snake.head.x, snake.head.y, "snake-head");

        for (let i = 1; i < snake.body.length; i++) {
            // drawCell(ctx, snake.body[i].x, snake.body[i].y, snake.color);
            insertImage(ctx, snake.body[i].x, snake.body[i].y, "snake-body");
        }

        for (let i = 0; i < apples.length; i++) {
            let apple = apples[i];
            insertImage(ctx, apple.position.x, apple.position.y, "apple");
        }

        for (let i = 0; i < life; i++) {
            insertImage(ctx, i, 0, "heart");
        }

        if (checkPrime(snake.score)) {
            insertImage(ctx, potion.position.x, potion.position.y, "potion");
        }

        // drawScore(snake);
        
        ctx.color = snake.color;
        ctx.font = "20px Arial";

        getCurrentLevel(ctx, snake.score);
        ctx.fillText("Score : "+ snake.score, 485, 30);
        ctx.fillText("Speed : "+ level[current_level-1].speed, 485, 50);
        // if (snake.score >=0 && snake.score < 5) {
        //     move_interval = level[0].speed;
        //     ctx.fillText("Level : 1", 500, 580);
        // } else if (snake.score >=5 && snake.score < 10) {
        //     move_interval = level[1].speed;
        //     ctx.fillText("Level : 2", 500, 580);
        // } else if (snake.score >= 10 && snake.score < 15){
        //     move_interval = level[2].speed;
        //     ctx.fillText("Level : 3", 500, 580);
        // } else if (snake.score >= 15 && snake.score < 20){
        //     move_interval = level[3].speed;
        //     ctx.fillText("Level : 4", 500, 580);
        // } else if (snake.score >= 20 && snake.score < 25){
        //     move_interval = level[4].speed;
        //     ctx.fillText("Level : 5", 500, 580);
        // } else {
        //     ctx.fillText("WIN", 500, 580);
        // }

    }, REDRAW_INTERVAL);
}

function teleport(snake) {
    if (snake.head.x < 0) {
        snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.x >= WIDTH) {
        snake.head.x = 0;
    }
    if (snake.head.y < 0) {
        snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
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
        }
    }

    if (snake.head.x == potion.position.x && snake.head.y == potion.position.y) {
        potion.position = initPosition();
        snake.score++;
        snake.body.push({x: snake.head.x, y: snake.head.y});
        life++;
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

function checkCollision(snakes) {
    let isCollide = false;
    //this
    for (let i = 0; i < snakes.length; i++) {
        for (let j = 0; j < snakes.length; j++) {
            for (let k = 1; k < snakes[j].body.length; k++) {
                if (snakes[i].head.x == snakes[j].body[k].x && snakes[i].head.y == snakes[j].body[k].y) {
                    isCollide = true;
                }
            }
        }
    }
    if (isCollide) {
        alert("Game over");
        snake = initSnake("purple");
        life = 3;
    }
    return isCollide;
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
    
    if (!checkCollision([snake])) {
        setTimeout(function() {
            move(snake);
        }, move_interval);
    } else {
        initGame();
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

initGame();