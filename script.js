const GameBoard = (function () {
    let gameboard = [0, 0, 0,
        0, 0, 0,
        0, 0, 0]; // Flattened array

    // Shared turn variable
    let turn = true; // true = Player X, false = Player O

    const getGameboard = () => gameboard;

    const alterGameboard = (symbol, index) => {
        if (gameboard[index] === 0) { // Check if the cell is empty
            gameboard[index] = symbol;

            // Check for winner
            if (checkWinner(index, symbol)) {
                displayController.showResult(`${symbol} is the winner!`);
                resetGameboard(); // Reset after a win
            } else if (!gameboard.includes(0)) { // Check for draw
                displayController.showResult("It's a draw!");
                resetGameboard(); // Reset after a draw
            } else {
                // Switch turn
                turn = !turn;
            }
        } else {
            console.log('Cell already occupied!');
        }
    };

    const resetGameboard = () => {
        gameboard = [0, 0, 0,
            0, 0, 0,
            0, 0, 0];
        turn = true; // Reset turn to Player X
        displayController.clearBoard();
    };

    function checkWinner(index, symbol) {
        const winPatterns = [
            [0, 1, 2], // Top row
            [3, 4, 5], // Middle row
            [6, 7, 8], // Bottom row
            [0, 3, 6], // Left column
            [1, 4, 7], // Middle column
            [2, 5, 8], // Right column
            [0, 4, 8], // Top-left to bottom-right diagonal
            [2, 4, 6]  // Top-right to bottom-left diagonal
        ];

        return winPatterns.some(pattern =>
            pattern.every(i => gameboard[i] === symbol)
        );
    }

    const getTurn = () => turn; // Expose current turn

    return { getGameboard, alterGameboard, resetGameboard, getTurn };
})();

const Players = function (symbol) {
    this.symbol = symbol;

    // Alter the shared gameboard instance
    const playTurn = (index) => {
        GameBoard.alterGameboard(symbol, index);
        console.log(GameBoard.getGameboard());
    };

    return { playTurn };
};

const displayController = (function () {
    const boxes = document.querySelectorAll('.boxes');
    const resultEl = document.querySelector('#result'); // Element to display results
    const restartButton = document.querySelector('#restart'); // Restart button

    const player1 = Players('X');
    const player2 = Players('O');

    // Set up event listeners for each box
    boxes.forEach((box, id) => {
        box.addEventListener('click', () => {
            const currentTurn = GameBoard.getTurn();
            if (box.textContent === '') { // Ensure cell is empty before allowing click
                if (currentTurn) {
                    box.textContent = 'X';
                    player1.playTurn(id);
                } else {
                    box.textContent = 'O';
                    player2.playTurn(id);
                }
            }
        });
    });

    // Event listener for restart button
    restartButton.addEventListener('click', () => {
        GameBoard.resetGameboard();
        showResult(""); // Clear result message
    });

    const showResult = (message) => {
        resultEl.textContent = message;
    };

    const clearBoard = () => {
        boxes.forEach(box => box.textContent = '');
    };

    return { showResult, clearBoard };
})();
