const dom = (function () {
    let boardElement;
    let gameResultElement;
    let resultMessageElement;
    let restartButtonElement;
    let changeModeButtonElement;
    let playerTurnElements;
    let playerScoreElements;
    let menuElement;
    let dinamicContainerElement;

    let gameMode = null;

    const renderBoard = (board) => {
    if (!boardElement) {
        console.error("Board not defined.");
        return;
    }

    boardElement.innerHTML = "";

    board.forEach((row, rowIndex) => {
        row.forEach((cell, columnIndex) => {
            const cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            cellElement.dataset.row = rowIndex;
            cellElement.dataset.column = columnIndex;
            cellElement.textContent = cell === " " ? "" : cell;

            // Evento para mouse (click)
            cellElement.addEventListener("click", () => handleCellClick(rowIndex, columnIndex));

            // Eventos para touch
            cellElement.addEventListener("touchstart", (e) => {
                e.preventDefault(); // Evitar comportamientos por defecto (como el zoom)
                handleCellClick(rowIndex, columnIndex);
            });

            boardElement.appendChild(cellElement);
        });
    });

    console.log("Board render correctly:", board);
};

    const showResultMessage = (message) => {
        resultMessageElement.textContent = message;
        gameResultElement.classList.remove("hidden");
    };

    const resetGame = () => {
        game.gameboard.resetBoard();
        game.players.resetPlayer();
        renderBoard(game.gameboard.getGameboard());
        gameResultElement.classList.add("hidden");
        updatePlayerTurn();
    };

    const updatePlayerTurn = () => {
        const currentPlayer = game.players.getCurrentPlayer();
        playerTurnElements.forEach((element, index) => {
            if (index === (currentPlayer.symbol === "X" ? 0 : 1)) {
                element.classList.add("active");
            } else {
                element.classList.remove("active");
            }
        });
    };

    const updateScores = (winner) => {
        if (winner === "X") {
            playerScoreElements[0].textContent = String(parseInt(playerScoreElements[0].textContent) + 1).padStart(2, "0");
        } else if (winner === "O") {
            playerScoreElements[1].textContent = String(parseInt(playerScoreElements[1].textContent) + 1).padStart(2, "0");
        }
    };

    const resetScores = () => {
        playerScoreElements.forEach(scoreElement => {
            scoreElement.textContent = "00";
        });
    };

    const disableBoard = () => {
        boardElement.classList.add("disabled");
    };

    const enableBoard = () => {
        boardElement.classList.remove("disabled");
    };

    const handleCellClick = async (row, column) => {
        const currentPlayer = game.players.getCurrentPlayer();
        const movementValid = game.gameboard.addMovement(currentPlayer.symbol, row, column);

        if (movementValid) {
            renderBoard(game.gameboard.getGameboard());

            const result = game.gameboard.checkGameOver();
            if (result) {
                showResultMessage(result === "draw" ? "Draw!" : `¡${currentPlayer.name} Wins!`);
                updateScores(result);
            } else {
                game.players.switchPlayer();
                updatePlayerTurn();

                // Solo en modo 1 vs Bot, la IA juega después del jugador
                if (gameMode === "1vsBot" && game.players.getCurrentPlayer().name === "Bot") {
                    disableBoard();
                    await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay de 2 segundos
                    const { row: cpuRow, column: cpuColumn } = game.players.getBestMove();
                    game.gameboard.addMovement("O", cpuRow, cpuColumn);
                    renderBoard(game.gameboard.getGameboard());

                    const cpuResult = game.gameboard.checkGameOver();
                    if (cpuResult) {
                        showResultMessage(cpuResult === "draw" ? "¡Draw!" : `¡BOT Wins!`);
                        updateScores(cpuResult);
                    } else {
                        game.players.switchPlayer();
                        updatePlayerTurn();
                    }
                    enableBoard();
                }
            }
        } else {
            alert("Invalid move. Try again.");
        }
    };

    const initGame = (mode) => {
        gameMode = mode;
        menuElement.classList.add("hidden");
        dinamicContainerElement.classList.remove("hidden");

        // Cambiar el nombre del segundo jugador según el modo
        if (mode === "1vsBot") {
            game.players.setPlayerTwoName("Bot");
            playerTurnElements[1].querySelector("h2").textContent = "BOT"; // Actualizar el nombre en el DOM
        } else {
            game.players.setPlayerTwoName("Player 2");
            playerTurnElements[1].querySelector("h2").textContent = "PLAYER TWO"; // Actualizar el nombre en el DOM
        }

        resetGame();
    };

    const changeMode = () => {
        dinamicContainerElement.classList.add("hidden");
        gameResultElement.classList.add("hidden");
        menuElement.classList.remove("hidden");
        gameMode = null;
        resetScores(); // Resetear los puntajes
    };

    const init = () => {
        boardElement = document.querySelector(".board");
        gameResultElement = document.querySelector(".game-result");
        resultMessageElement = document.querySelector(".result-message");
        restartButtonElement = document.querySelector(".restart-button");
        changeModeButtonElement = document.querySelector(".change-mode-button");
        playerTurnElements = document.querySelectorAll(".player-container");
        playerScoreElements = document.querySelectorAll(".score");
        menuElement = document.querySelector(".menu");
        dinamicContainerElement = document.querySelector(".dinamic-container");

        if (!boardElement || !gameResultElement || !resultMessageElement || !restartButtonElement || !changeModeButtonElement) {
            console.error("Some elements not found.");
            return;
        }

        document.querySelectorAll(".menu-button").forEach(button => {
            button.addEventListener("click", () => initGame(button.dataset.mode));
        });

        restartButtonElement.addEventListener("click", resetGame);

        changeModeButtonElement.addEventListener("click", changeMode);
    };

    return {
        init
    };
})();

document.addEventListener("DOMContentLoaded", dom.init);