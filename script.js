// Game constants
let inputDir = {x:0, y:0};
let gameStarted = false;
let startX = 0, startY = 0;

const movesound = new Audio("move.mp3");
const foodsound = new Audio("food.mp3");
const gameOversound = new Audio("finish.mp3");

let speed = 5;
let lastPaintTime = 0;
let snakeArr = [{x:13, y:15}];
let food = {x:6, y:7};
let score = 0;

let playArea = document.getElementById("playArea");
let scoreBox = document.getElementById("scorebox");
let hiScoreBox = document.getElementById("hiscorebox");

// High Score
let hiScore = localStorage.getItem("hiscore");

if(hiScore === null){
    hiScore = 0;
    localStorage.setItem("hiscore", hiScore);
}else{
    hiScore = Number(hiScore);
}

hiScoreBox.innerHTML = "High Score: " + hiScore;


// Main loop
function main(ctime){
    window.requestAnimationFrame(main);

    if((ctime - lastPaintTime)/1000 < 1/speed){
        return;
    }

    lastPaintTime = ctime;
    gameEngine();
}


// Collision
function collide(snake){
    for(let i=1;i<snake.length;i++){
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }

    if(snake[0].x >=18 || snake[0].x <=0 || snake[0].y >=18 || snake[0].y <=0){
        return true;
    }

    return false;
}


// Game logic
function gameEngine(){

    // Game Over
    if(gameStarted && collide(snakeArr)){
        gameOversound.play();
        alert("Game Over");

        inputDir = {x:0,y:0};
        gameStarted = false;
        snakeArr = [{x:13,y:15}];
        score = 0;
        scoreBox.innerHTML = "Score: 0";
    }

    // Eat food
    if(gameStarted && snakeArr[0].x === food.x && snakeArr[0].y === food.y){

        foodsound.play();
        score++;

        scoreBox.innerHTML = "Score: " + score;

        if(score > hiScore){
            hiScore = score;
            localStorage.setItem("hiscore", hiScore);
            hiScoreBox.innerHTML = "High Score: " + hiScore;
        }

        snakeArr.unshift({
            x: snakeArr[0].x + inputDir.x,
            y: snakeArr[0].y + inputDir.y
        });

        food = {
            x: Math.floor(Math.random()*16)+1,
            y: Math.floor(Math.random()*16)+1
        };
    }

    // Move snake
    if(gameStarted){
        for(let i=snakeArr.length-2;i>=0;i--){
            snakeArr[i+1] = {...snakeArr[i]};
        }

        snakeArr[0].x += inputDir.x;
        snakeArr[0].y += inputDir.y;
    }

    // Display
    playArea.innerHTML = "";

    snakeArr.forEach((e,index)=>{
        let el = document.createElement("div");

        el.style.gridRowStart = e.y;
        el.style.gridColumnStart = e.x;

        el.classList.add(index===0 ? "head" : "snake");

        playArea.appendChild(el);
    });

    let foodEl = document.createElement("div");
    foodEl.style.gridRowStart = food.y;
    foodEl.style.gridColumnStart = food.x;
    foodEl.classList.add("food");
    playArea.appendChild(foodEl);
}


// Run
window.requestAnimationFrame(main);


// Keyboard controls
window.addEventListener("keydown", e => {

    if(!gameStarted){
        gameStarted = true;
        movesound.play();
    }

    if(e.key === "ArrowUp"){
        if(inputDir.y !== 1){
            inputDir = {x:0, y:-1};
        }
    }

    if(e.key === "ArrowDown"){
        if(inputDir.y !== -1){
            inputDir = {x:0, y:1};
        }
    }

    if(e.key === "ArrowLeft"){
        if(inputDir.x !== 1){
            inputDir = {x:-1, y:0};
        }
    }

    if(e.key === "ArrowRight"){
        if(inputDir.x !== -1){
            inputDir = {x:1, y:0};
        }
    }
});


// Touch controls
document.addEventListener("touchstart", function(e){
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener("touchend", function(e){

    if(!gameStarted){
        gameStarted = true;
        movesound.play();
    }

    let dx = e.changedTouches[0].clientX - startX;
    let dy = e.changedTouches[0].clientY - startY;

    if(Math.abs(dx) > Math.abs(dy)){
        if(dx > 0 && inputDir.x !== -1){
            inputDir = {x:1,y:0};
        } else if(inputDir.x !== 1){
            inputDir = {x:-1,y:0};
        }
    } else {
        if(dy > 0 && inputDir.y !== -1){
            inputDir = {x:0,y:1};
        } else if(inputDir.y !== 1){
            inputDir = {x:0,y:-1};
        }
    }
});


// Button controls
function moveUp(){
    if(!gameStarted){ gameStarted=true; movesound.play(); }
    if(inputDir.y !== 1){
        inputDir = {x:0,y:-1};
    }
}

function moveDown(){
    if(!gameStarted){ gameStarted=true; movesound.play(); }
    if(inputDir.y !== -1){
        inputDir = {x:0,y:1};
    }
}

function moveLeft(){
    if(!gameStarted){ gameStarted=true; movesound.play(); }
    if(inputDir.x !== 1){
        inputDir = {x:-1,y:0};
    }
}

function moveRight(){
    if(!gameStarted){ gameStarted=true; movesound.play(); }
    if(inputDir.x !== -1){
        inputDir = {x:1,y:0};
    }
}
