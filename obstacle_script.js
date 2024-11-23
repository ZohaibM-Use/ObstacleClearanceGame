"use strict";

const dino = document.getElementById('dino');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScore = document.getElementById('finalScore');
const stageDisplay = document.getElementById('stage');

let dinoBottom = 0;
let isJumping = false;
let obstacles = [];
let score = 0;
let gameInterval;
let scoreInterval;
let currentSpeed = 5;
let stage = 1;

function jump() {
    if (isJumping) return;
    isJumping = true;
    let jumpInterval = setInterval(() => {
        if (dinoBottom >= 130) {
            clearInterval(jumpInterval);
            let fallInterval = setInterval(() => {
                if (dinoBottom <= 0) {
                    clearInterval(fallInterval);
                    isJumping = false;
                }
                dinoBottom -= 5;
                dino.style.bottom = dinoBottom + 'px';
            }, 20);
        }
        dinoBottom += 7;
        dino.style.bottom = dinoBottom + 'px';
    }, 20);
}

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    const height = Math.random() * 80 + 20;
    obstacle.style.height = `${height}px`;
    obstacle.style.left = '800px';
    gameContainer.appendChild(obstacle);

    let obstacleLeft = 800;
    let obstacleInterval = setInterval(() => {
        if (obstacleLeft <= -20) {
            clearInterval(obstacleInterval);
            obstacle.remove();
            obstacles = obstacles.filter((o) => o !== obstacle);
        }
        if (obstacleLeft > 50 && obstacleLeft < 100 && dinoBottom < height) {
            clearInterval(gameInterval);
            clearInterval(scoreInterval);
            obstacles.forEach((o) => clearInterval(o.dataset.interval));
            endGame();
        }
        obstacleLeft -= currentSpeed;
        obstacle.style.left = obstacleLeft + 'px';
    }, 10);

    obstacle.dataset.interval = obstacleInterval;
    obstacles.push(obstacle);
}

function clearObstacles() {
    obstacles.forEach((obstacle) => {
        clearInterval(obstacle.dataset.interval);
        obstacle.remove();
    });
    obstacles = [];
}

function updateSpeed() {
    let speedChanged = false;
    if (score >= 6000 && currentSpeed !== 10) {
        currentSpeed = 10;
        speedChanged = true;
    } else if (score >= 3000 && score < 6000 && currentSpeed !== 7) {
        currentSpeed = 7;
        speedChanged = true;
    } else if (score < 3000 && currentSpeed !== 5) {
        currentSpeed = 5;
        speedChanged = true;
    }
    if (speedChanged) {
        clearObstacles();
        stage++;
        stageDisplay.textContent = `Stage: ${stage}`;
    }
}

function startGame() {
    score = 0;
    currentSpeed = 5;
    stage = 1;
    stageDisplay.textContent = `Stage: ${stage}`;
    scoreDisplay.textContent = `Score: ${score}`;
    gameOverScreen.style.display = 'none';
    obstacles = [];

    scoreInterval = setInterval(() => {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        updateSpeed();
    }, 1);

    gameInterval = setInterval(() => {
        createObstacle();
    }, 1500);
}

function endGame() {
    finalScore.textContent = `Score: ${score}`;
    gameOverScreen.style.display = 'flex';
    clearInterval(gameInterval);
    clearInterval(scoreInterval);
}

function restartGame() {
    clearObstacles();
    dinoBottom = 0;
    dino.style.bottom = `${dinoBottom}px`;
    startGame();
}

startGame();
