const game = (function () {
    const gameboard = (function () {
        let board = [
            [" ", " ", " "],
            [" ", " ", " "],
            [" ", " ", " "]
        ];

        const getGameboard = () => board.map(row => [...row]);

        const addMovement = (playerSymbol, row, column) => {
            if (row >= 0 && row < 3 && column >= 0 && column < 3 && board[row][column] === " ") {
                board[row][column] = playerSymbol;
                return true;
            }
            return false;
        };

        const resetBoard = () => {
            board = board.map(row => row.map(() => " "));
        };

        const checkAvailability = (row, column) => board[row][column] === " ";

        const checkGameOver = () => {
            for (let i = 0; i < 3; i++) {
                if (board[i][0] !== " " && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                    return board[i][0];
                }
            }
            
            for (let j = 0; j < 3; j++) {
                if (board[0][j] !== " " && board[0][j] === board[1][j] && board[1][j] === board[2][j]) {
                    return board[0][j];
                }
            }
            
            if (board[0][0] !== " " && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
                return board[0][0];
            }
            if (board[0][2] !== " " && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
                return board[0][2];
            }

            if (board.flat().every(cell => cell !== " ")) {
                return "draw";
            }
            return null;
        };

        return { getGameboard, addMovement, resetBoard, checkAvailability, checkGameOver };
    })();

    const players = (function () {
        let playerOne = { name: "Player 1", symbol: "X" };
        let playerTwo = { name: "Player 2", symbol: "O" };
        let currentPlayer = playerOne;
    
        const switchPlayer = () => {
            currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
        };
    
        const resetPlayer = () => {
            currentPlayer = playerOne;
        };
    
        const setPlayerTwoName = (name) => {
            playerTwo.name = name;
        };
    
        const getCurrentPlayer = () => currentPlayer;
    
        const minimax = (board, depth, isMaximizing) => {
            const result = gameboard.checkGameOver();
        
            if (result !== null) {
                if (result === "X") return -10 + depth;
                if (result === "O") return 10 - depth;
                if (result === "draw") return 0;
            }
        
            if (isMaximizing) {
                let bestScore = -Infinity;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (board[i][j] === " ") {
                            board[i][j] = "O";
                            const score = minimax(board, depth + 1, false);
                            board[i][j] = " ";
                            bestScore = Math.max(score, bestScore);
                        }
                    }
                }
                return bestScore;
            } else {
                let bestScore = Infinity;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (board[i][j] === " ") {
                            board[i][j] = "X";
                            const score = minimax(board, depth + 1, true);
                            board[i][j] = " ";
                            bestScore = Math.min(score, bestScore);
                        }
                    }
                }
                return bestScore;
            }
        };
    
        const getBestMove = () => {
            const availableMoves = [];
            const board = gameboard.getGameboard();
        
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] === " ") {
                        availableMoves.push({ row: i, column: j });
                    }
                }
            }
        
            if (availableMoves.length === 9) {
                const randomIndex = Math.floor(Math.random() * availableMoves.length);
                return availableMoves[randomIndex];
            }
        
            let bestScore = -Infinity;
            let bestMove = { row: -1, column: -1 };
        
            for (const move of availableMoves) {
                const { row, column } = move;
                board[row][column] = "O";
                const score = minimax(board, 0, false);
                board[row][column] = " ";
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { row, column };
                }
            }
        
            if (bestMove.row === -1 && bestMove.column === -1) {
                const randomIndex = Math.floor(Math.random() * availableMoves.length);
                return availableMoves[randomIndex];
            }
        
            return bestMove;
        };
    
        return { getCurrentPlayer, switchPlayer, resetPlayer, setPlayerTwoName, getBestMove };
    })();

    return {
        gameboard,
        players
    };
})();