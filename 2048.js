var board;
var score = 0;
var bestscore = 0;
var index = 0;
var rows = 0;
var columns = 0;
var bestScores = [];
var trials = 0;

window.onload = function () {
    GenBoard();
    preloadImages();
}

function restart() {
    setGame(rows, columns);
    score = 0;
    document.getElementById("score").innerText = score;

    closeModal();
    
    trials = 0;
}

function GenBoard() {
    var boardContainer = document.getElementById('board');
        rows = 4;
        columns = 4;
        setGame(rows, columns);
        boardContainer.style.width = "400px";
        boardContainer.style.height = "400px";
}

function toggleGrid() {
    var gridElement = document.getElementById('grid');
    var boardContainer = document.getElementById('board');

    if (gridElement.textContent == "5x5") {
        gridElement.textContent = "4x4";
        rows = 5;
        columns = 5; score = 0;
        document.getElementById("score").innerText = score;

        
        var style = document.createElement('style');
        style.innerHTML = `
        .tile {
            width: 70px !important;
            height: 70px !important;
        }
        .x2, .x4, .x8, .x16, .x32, .x64, .x128, .x256, .x512, .x1024, .x2048, .x4096, .x8192 {
            background-size: 70px !important;
        }
        `;

        document.head.appendChild(style);

        setGame(rows, columns);
    } else {
        gridElement.textContent = "5x5";
        rows = 4;
        columns = 4; score = 0;
        document.getElementById("score").innerText = score;


        var style = document.createElement('style');
        style.innerHTML = `
        .tile {
            width: 90px !important;
            height: 90px !important;
        }        
        .x2, .x4, .x8, .x16, .x32, .x64, .x128, .x256, .x512, .x1024, .x2048, .x4096, .x8192 {
            background-size: 90px !important;
        }
        `;

        document.head.appendChild(style);

        setGame(rows, columns);
        boardContainer.style.width = "400px";
        boardContainer.style.height = "400px";
    }
}

function setGame(rows, columns) {
    var boardContainer = document.getElementById('board');
    boardContainer.innerHTML = "";
    board = Array.from({ length: rows }, () => Array.from({ length: columns }, () => 0));

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    setTwo();
    setTwo();
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.className = "tile";
    if (num > 0) {
        if (num <= 8192) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}


document.addEventListener('keyup', handleKeyPress);
document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchmove', handleTouchMove);
document.addEventListener('touchend', handleTouchEnd);

let touchStartX;
let touchStartY;

function handleKeyPress(e) {
    if (e.code == "ArrowLeft") {
        slideLeft();
        setTwo();
    }
    else if (e.code == "ArrowRight") {
        slideRight();
        setTwo();
    }
    else if (e.code == "ArrowUp") {
        slideUp();
        setTwo();
    }
    else if (e.code == "ArrowDown") {
        slideDown();
        setTwo();
    }
    document.getElementById("score").innerText = score;
    if (checkGameOver()) {
        displayGameOver();
    }
}

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    event.preventDefault();
}

function handleTouchEnd(event) {
    if (!touchStartX || !touchStartY) return;

    let touchEndX = event.changedTouches[0].clientX;
    let touchEndY = event.changedTouches[0].clientY;

    let deltaX = touchEndX - touchStartX;
    let deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            slideRight();
        } else {
            slideLeft();
        }
    } else {
        if (deltaY > 0) {
            slideDown();
        } else {
            slideUp();
        }
    }

    setTwo();
    document.getElementById("score").innerText = score;

    if (checkGameOver()) {
        displayGameOver();
    }

    touchStartX = null;
    touchStartY = null;
}

function findTargetCol(row, col) {
    for (let i = col - 1; i >= 0; i--) {
        if (board[row][i] !== 0) {
            return i + 1;
        }
    }
    return 0;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        let newRow = slide(row);
        board[r] = newRow;
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = newRow[c];
            updateTile(tile, num);
            if (num !== 0) {
                let targetCol = findTargetCol(r, c);
                if (targetCol !== c) {
                    tile.classList.add("slide-left");
                }
            }
        }
    }
}


function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r].slice().reverse();
        let newRow = slide(row).reverse();
        board[r] = newRow;
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = newRow[c];
            updateTile(tile, num);
            
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let col = [];
        for (let r = 0; r < rows; r++) {
            col.push(board[r][c]);
        }
        let newCol = slide(col);
        for (let r = 0; r < rows; r++) {
            board[r][c] = newCol[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = newCol[r];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let col = [];
        for (let r = 0; r < rows; r++) {
            col.push(board[r][c]);
        }
        let newCol = slide(col.reverse()).reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = newCol[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = newCol[r];
            updateTile(tile, num);
        }
    }
}

function slide(row) {
    row = row.filter(num => num !== 0);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    row = row.filter(num => num !== 0);
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.classList.add("x2");
            tile.classList.add("pop");
            found = true;
            var audio = new Audio('update.wav');
            audio.volume = 0.1;
            audio.play();        
        }
    }
    if (checkWin()) {
        displayWin();
    }
}

function checkWin() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 2048) {
                displayModal("win"); return true;
            }
        }
    }
    return false;
}

function displayModal(type) {
    const modal = document.getElementById("modal");
    const modalContent = modal.querySelector(".modal-content");
    const backdrop = modal.querySelector(".modal-backdrop");

    if (type === "win") {
        modalContent.innerHTML = `
            <h2>Congratulations!</h2>
            <p>You've won the game!</p>
            <div class="modal-buttons">
                <button onclick="restart()">Restart</button>
                <button onclick="continueGame()">Continue</button>
            </div>
        `;
    } else if (type === "over") {
        modalContent.innerHTML = `
            <h2>Game Over!</h2>
            <p>Your score: ${score}</p>
            <div class="modal-buttons">
                <button onclick="restart()">Restart</button>
                <button onclick="viewBoard()">View Board</button>
            </div>
        `;
    }

    modal.style.display = "flex";
    backdrop.style.filter = "blur(5px)";
}

function enableUserInteraction() {
    document.addEventListener('keyup', handleKeyPress);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    restart();
}

function viewBoard() {
    closeModal();
}

function disableUserInteraction() {
    document.removeEventListener('keyup', handleKeyPress);
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
}

function closeModal() {
    const modal = document.getElementById("modal");
    const backdrop = modal.querySelector(".modal-backdrop");
    modal.style.display = "none";
    backdrop.style.filter = "none";
}

function continueGame() {
    closeModal();
}


function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                return true;
            }
        }
    }
    return false;
}
function checkGameOver() {
    if (hasEmptyTile()) {
        return false;
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (c < columns - 1 && board[r][c] === board[r][c + 1]) {
                return false;
            }
            if (r < rows - 1 && board[r][c] === board[r + 1][c]) {
                return false;
            }
        }
    }
    return true;
}

function displayGameOver() {
    if (checkGameOver()) {
        displayModal("over");

        if (score > bestscore) {
            bestscore = score;
            document.getElementById("bestscore").innerText = bestscore;
        }

        const existingTrialIndex = bestScores.findIndex(entry => entry.trial === trials);
        if (existingTrialIndex !== -1) {
            if (score > bestScores[existingTrialIndex].score) {
                bestScores[existingTrialIndex].score = score;
            }
        } else {
            bestScores.push({ score: score, trial: trials });
        }

        displayLeaderboard();
    }
}

function showLeaderboard() {
    var leaderboardPopup = document.getElementById("leaderboardPopup");
    leaderboardPopup.style.display = "block";
    displayLeaderboard();
}

function closeLeaderboardPopup() {
    var leaderboardPopup = document.getElementById("leaderboardPopup");
    leaderboardPopup.style.display = "none";
    enableUserInteraction();
}


function displayLeaderboard() {
    var leaderboardContainer = document.getElementById("leaderboard");
    
    
    bestScores.sort((a, b) => b.score - a.score);
    
    
    leaderboardContainer.innerHTML = "";

    bestScores.forEach((entry, index) => {
        var playerEntry = document.createElement("div");
        playerEntry.textContent = `Player ${index + 1}: ${entry.score}`;
        leaderboardContainer.appendChild(playerEntry);
    });

    document.removeEventListener('keyup', handleKeyPress);
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
}

function preloadImages() {
    const imageUrls = [
        'x2.jpg', 'x4.jpg', 'x8.jpg', 'x16.jpg', 'x32.jpg', 'x64.jpg',
        'x128.jpg', 'x256.jpg', 'x512.jpg', 'x1024.jpg', 'x2048.jpg',
        'x4096.jpg', 'x8192.jpg'
    ];

    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}



                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       