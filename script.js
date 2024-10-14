var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;
var snakeX, snakeY;
var velocityX = 0;
var velocityY = 0;

var snakeBody = [];
var foodX;
var foodY;
var gameInterval;

window.onload = function() {
    resetGame();

    // Touch controls for mobile
    let startX, startY;

    document.addEventListener("touchstart", function(event) {
        const touch = event.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
    }, false);

    document.addEventListener("touchend", function(event) {
        const touch = event.changedTouches[0];
        const diffX = touch.clientX - startX;
        const diffY = touch.clientY - startY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) {
                changeDirection({ code: "ArrowRight" });
            } else {
                changeDirection({ code: "ArrowLeft" });
            }
        } else {
            if (diffY > 0) {
                changeDirection({ code: "ArrowDown" });
            } else {
                changeDirection({ code: "ArrowUp" });
            }
        }
    }, false);
};

function resetGame() {
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    placeFood();
    
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d");
    
    if (gameInterval) {
        clearInterval(gameInterval);
    }

    gameInterval = setInterval(update, 1000 / 10);
    document.addEventListener("keyup", changeDirection);
}

function update() {
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);
    
    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);
    
    if (snakeX === foodX && snakeY === foodY) {
        snakeBody.push([foodX, foodY]);
        placeFood();
    }

    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;

    if (snakeX < 0 || snakeY < 0 || snakeX >= board.width || snakeY >= board.height || collision()) {
        alert("Game Over!");
        resetGame();
        return;
    }

    snakeBody.unshift([snakeX, snakeY]);

    context.fillStyle = "lime";
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    if (snakeBody.length > 0) {
        snakeBody.pop();
    }
}

function changeDirection(e) {
    if (e.code === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.code === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.code === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.code === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;

    for (let i = 0; i < snakeBody.length; i++) {
        if (foodX === snakeBody[i][0] && foodY === snakeBody[i][1]) {
            placeFood();
            break;
        }
    }
}

function collision() {
    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
            return true;
        }
    }
    return false;
}
