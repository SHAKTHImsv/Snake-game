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
};

function resetGame() {
    // Reset game state
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
    
    // Clear the previous interval if it exists
    if (gameInterval) {
        clearInterval(gameInterval);
    }

    // Start the game loop
    gameInterval = setInterval(update, 1000 / 10);
    document.addEventListener("keyup", changeDirection);
}

function update() {
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);
    
    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);
    
    // Check for food collision
    if (snakeX === foodX && snakeY === foodY) {
        snakeBody.push([foodX, foodY]);
        placeFood();
    }

    // Move snake
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;

    // Check for wall collision
    if (snakeX < 0 || snakeY < 0 || snakeX >= board.width || snakeY >= board.height || collision()) {
        alert("Game Over!");
        resetGame(); // Reset the game
        return;
    }

    // Add new head
    snakeBody.unshift([snakeX, snakeY]);

    // Draw the snake body
    context.fillStyle = "lime";
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    // Remove the tail of the snake if not growing
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

    // Prevent food from spawning on the snake
    for (let i = 0; i < snakeBody.length; i++) {
        if (foodX === snakeBody[i][0] && foodY === snakeBody[i][1]) {
            placeFood(); // Recalculate food position
            break;
        }
    }
}

function collision() {
    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
            return true; // Collided with itself
        }
    }
    return false; // No collision
}
