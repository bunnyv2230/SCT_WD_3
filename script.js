
const modeSelection = document.getElementById('mode-selection');
const pvpButton = document.getElementById('pvp-button');
const pvcButton = document.getElementById('pvc-button');
const gameContainer = document.getElementById('game-container');
const statusText = document.getElementById('status-text');
const restartButton = document.getElementById('restart-button');
const homeButton = document.getElementById('home-button'); 
const gameCells = document.querySelectorAll('.cell');
const mainTitle = document.getElementById('main-title');


let gameActive = false;
let currentPlayer = 'X';
let gameMode = 'pvp';
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];


function startGame(mode) {
    gameMode = mode;
    gameActive = true;
    currentPlayer = 'X';
    gameState = ["", "", "", "", "", "", "", "", ""];
    
    statusText.innerText = `Player ${currentPlayer}'s turn`;
    gameCells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('x', 'o');
    });

    modeSelection.classList.add('hidden');
    mainTitle.classList.add('hidden');
    gameContainer.classList.remove('hidden');
}

function goHome() {
    gameContainer.classList.add('hidden');
    mainTitle.classList.remove('hidden');
    modeSelection.classList.remove('hidden');
    gameActive = false; 
}



function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

   
    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    
    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();

    
    if (gameMode === 'pvc' && gameActive && currentPlayer === 'O') {
       
        gameActive = false; 
        setTimeout(computerMove, 700); 
    }
}


function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerText = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase()); 
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue; 
        }
        if (a === b && b === c) {
            roundWon = true; 
            break;
        }
    }

    if (roundWon) {
        statusText.innerText = `Player ${currentPlayer} has won!`;
        gameActive = false;
        return;
    }

   
    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusText.innerText = `Game ended in a draw!`;
        gameActive = false;
        return;
    }

    
    handlePlayerChange();
}


function handlePlayerChange() {
    currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
    statusText.innerText = `Player ${currentPlayer}'s turn`;
}


function computerMove() {
   
    let emptyCells = [];
    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === "") {
            emptyCells.push(i);
        }
    }

  
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const cellToPlay = document.querySelector(`.cell[data-index='${randomIndex}']`);

  
    handleCellPlayed(cellToPlay, randomIndex);
    
    
    gameActive = true; 
    

    handleResultValidation();
}


pvpButton.addEventListener('click', () => startGame('pvp'));
pvcButton.addEventListener('click', () => startGame('pvc'));
restartButton.addEventListener('click', () => startGame(gameMode)); 
homeButton.addEventListener('click', goHome); 
gameCells.forEach(cell => cell.addEventListener('click', handleCellClick));
