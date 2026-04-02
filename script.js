// Game constants
let inputDir = {x:0, y:0};
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
}
else{
hiScore = Number(hiScore);
}

hiScoreBox.innerHTML = "High Score: " + hiScore;

// Main game loop
function main(ctime){
window.requestAnimationFrame(main);

if((ctime - lastPaintTime)/1000 < 1/speed){  
    return;  
}  

lastPaintTime = ctime;  
gameEngine();

}

// Collision detection
function collide(snake){

// snake hit itself  
for(let i=1;i<snake.length;i++){  
    if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){  
        return true;  
    }  
}  

// snake hit wall  
if(snake[0].x >=18 || snake[0].x <=0 || snake[0].y >=18 || snake[0].y <=0){  
    return true;  
}  

return false;

}

function gameEngine(){

// Game Over  
if(collide(snakeArr)){  
    gameOversound.play();  
    inputDir = {x:0,y:0};  
    alert("Game Over");  
    snakeArr = [{x:13,y:15}];  
    score = 0;  
}  


// Eat food  
if(snakeArr[0].x === food.x && snakeArr[0].y === food.y){  

    foodsound.play();  
    score += 1;  

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

    let a = 2;  
    let b = 16;  

    food = {  
        x: Math.round(a + (b-a)*Math.random()),  
        y: Math.round(a + (b-a)*Math.random())  
    }  
}  


// Move snake  
for(let i = snakeArr.length-2; i>=0; i--){  
    snakeArr[i+1] = {...snakeArr[i]};  
}  

snakeArr[0].x += inputDir.x;  
snakeArr[0].y += inputDir.y;  


// Display snake  
playArea.innerHTML = "";  

snakeArr.forEach((e,index)=>{  

    let snakeElement = document.createElement("div");  

    snakeElement.style.gridRowStart = e.y;  
    snakeElement.style.gridColumnStart = e.x;  

    if(index === 0){  
        snakeElement.classList.add("head");  
    }  
    else{  
        snakeElement.classList.add("snake");  
    }  

    playArea.appendChild(snakeElement);  
});  


// Display food  
let foodElement = document.createElement("div");  

foodElement.style.gridRowStart = food.y;  
foodElement.style.gridColumnStart = food.x;  

foodElement.classList.add("food");  

playArea.appendChild(foodElement);

}

// Run game
window.requestAnimationFrame(main);

// Controls
window.addEventListener("keydown", e => {

movesound.play();  

switch(e.key){  

    case "ArrowUp":  
        inputDir.x = 0;  
        inputDir.y = -1;  
        break;  

    case "ArrowDown":  
        inputDir.x = 0;  
        inputDir.y = 1;  
        break;  

    case "ArrowLeft":  
        inputDir.x = -1;  
        inputDir.y = 0;  
        break;  

    case "ArrowRight":  
        inputDir.x = 1;  
        inputDir.y = 0;  
        break;  
}

});
// Touch controls
document.addEventListener("touchstart", function(e){
startX = e.touches[0].clientX;
startY = e.touches[0].clientY;
});

document.addEventListener("touchend", function(e){
let endX = e.changedTouches[0].clientX;
let endY = e.changedTouches[0].clientY;

let diffX = endX - startX;  
let diffY = endY - startY;  

if(Math.abs(diffX) > Math.abs(diffY)){  
    if(diffX > 0 && inputDir.x !== -1){  
        inputDir.x = 1;  
        inputDir.y = 0;  
    } else if(inputDir.x !== 1) {  
        inputDir.x = -1;  
        inputDir.y = 0;  
    }  
} else {  
    if(diffY > 0 && inputDir.y !== -1){  
        inputDir.x = 0;  
        inputDir.y = 1;  
    } else if(inputDir.y !== 1) {  
        inputDir.x = 0;  
        inputDir.y = -1;  
    }  
}

});
// Button Controls (Mobile)
function moveUp(){
if(inputDir.y !== 1){
inputDir.x = 0;
inputDir.y = -1;
}
}

function moveDown(){
if(inputDir.y !== -1){
inputDir.x = 0;
inputDir.y = 1;
}
}

function moveLeft(){
if(inputDir.x !== 1){
inputDir.x = -1;
inputDir.y = 0;
}
}

function moveRight(){
if(inputDir.x !== -1){
inputDir.x = 1;
inputDir.y = 0;
}
}
