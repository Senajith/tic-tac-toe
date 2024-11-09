const socket = io('https://tic-tac-toe-oxso.onrender.com');

const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText")
const restartBtn = document.querySelector("#restartBtn");

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let blinkInterval;

initializeGame();

function initializeGame(){
    cells.forEach(cell => cell.addEventListener("click",cellClicked));
    restartBtn.addEventListener("click",restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function cellClicked(){
    const cellIndex = this.getAttribute("cellIndex");
    this.style.backgroundColor = "#adb5bd";

    if(options[cellIndex] != "" || !running){
        return;
    }

    updateCell(this, cellIndex);
    socket.emit('makeMove', { cellIndex, currentPlayer });
    checkWinner();

}

socket.on('moveMade', (data) => {
    const cell = document.querySelector(`[cellIndex='${data.cellIndex}']`);
    if (options[data.cellIndex] === "") {
        updateCell(cell, data.cellIndex, data.currentPlayer);
        checkWinner();
    }
});

function updateCell(cell,index){
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function changePlayer(){
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner(){
    let roundWon = false;

    for(let i=0; i<winConditions.length; i++){
        const conditions = winConditions[i];

        const cellA = options[conditions[0]];
        const cellB = options[conditions[1]];
        const cellC = options[conditions[2]];

        if(cellA == "" || cellB == "" || cellC == ""){
            continue;
        }

        if(cellA == cellB && cellB == cellC){
            roundWon = true;
            break;
        }

    }

    if(roundWon){
        statusText.textContent = `${currentPlayer} wins! 🥇`;
        statusText.style.color = "blue";
        statusText.style.fontSize = "4rem";
        running = false;

        blinkInterval = setInterval(() => {
            statusText.style.visibility = statusText.style.visibility === "hidden" ? "visible" : "hidden";
        }, 500);

    } else if (!options.includes("")) {  
        statusText.textContent = `It's a draw!`;
        running = false;
    } else {
        changePlayer();
    }

}

function restartGame(){
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer}'s turn`;
    statusText.style.color = "";
    statusText.style.fontSize = "";
    statusText.style.visibility = "visible";
    this.style.backgroundColor = "";
    cells.forEach(cell => {
        cell.textContent = "";
        cell.style.backgroundColor = "";
    });

    clearInterval(blinkInterval);
    running = true;

    socket.emit('restartGame');

}

socket.on('gameRestarted', () => {
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    running = true;
});