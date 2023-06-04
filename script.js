// Vytvoření objektu TicTacToe
let TicTacToe = {};

// Definice třídy Board
TicTacToe.Board = function () {
    // Inicializace herní desky
    this.board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];
    this.currentPlayer = "X"; // Aktuální hráč (X nebo O)
    this.gameOver = false; // Ukončení hry
    this.winningCombination = []; // Vítězná kombinace

    // Metoda pro resetování herní desky
    this.resetBoard = function () {
        this.board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];
        this.currentPlayer = "X";
        this.gameOver = false;
        this.winningCombination = [];
    };

    // Metoda pro kontrolu výhry
    this.checkWin = function () {
        // Kontrola řádků
        for (let i = 0; i < 3; i++) {
            if (
                this.board[i][0] !== "" &&
                this.board[i][0] === this.board[i][1] &&
                this.board[i][0] === this.board[i][2]
            ) {
                this.winningCombination = [[i, 0], [i, 1], [i, 2]];
                return true;
            }
        }

        // Kontrola sloupců
        for (let j = 0; j < 3; j++) {
            if (
                this.board[0][j] !== "" &&
                this.board[0][j] === this.board[1][j] &&
                this.board[0][j] === this.board[2][j]
            ) {
                this.winningCombination = [[0, j], [1, j], [2, j]];
                return true;
            }
        }

        // Kontrola diagonál
        if (
            this.board[0][0] !== "" &&
            this.board[0][0] === this.board[1][1] &&
            this.board[0][0] === this.board[2][2]
        ) {
            this.winningCombination = [[0, 0], [1, 1], [2, 2]];
            return true;
        }

        if (
            this.board[0][2] !== "" &&
            this.board[0][2] === this.board[1][1] &&
            this.board[0][2] === this.board[2][0]
        ) {
            this.winningCombination = [[0, 2], [1, 1], [2, 0]];
            return true;
        }

        return false;
    };

    // Metoda pro kontrolu remízy
    this.checkTie = function () {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] === "") {
                    return false;
                }
            }
        }
        return true;
    };
};

// Definice třídy Player
TicTacToe.Player = function (name) {
    this.name = name;
    this.score = 0;
};

// Objekt Game pro řízení hry
TicTacToe.Game = {
    muteButton: null, // Tlačítko pro ztlumení/zapnutí hudby
    backgroundMusic: null, // Audio element
    canvas: null, // Plátno pro vykreslování herní desky
    ctx: null, // Kontext plátna
    board: null, // Instance herní desky
    players: [], // Hráči
    cellSize: 100, // Velikost políčka na herní desce

    // Inicializace hry
    init: function () {
        this.canvas = document.getElementById("game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.board = new TicTacToe.Board();
        this.players = [
            new TicTacToe.Player("X"),
            new TicTacToe.Player("O")
        ];

        // Načtení skóre z local storage
        this.loadScoreFromLocalStorage();

        // Vykreslení herní desky
        this.drawBoard();

        // Přidání event listenerů
        this.canvas.addEventListener("click", this.handleCanvasClick.bind(this));
        this.canvas.addEventListener("mousemove", this.handleCellHover.bind(this));
        this.canvas.addEventListener("mouseleave", this.handleCellLeave.bind(this));
        document.getElementById("reset-board-button").addEventListener("click", this.resetBoard.bind(this));
        document.getElementById("reset-score-button").addEventListener("click", this.resetScore.bind(this));

        // Načtení a nastavení hudby
        this.backgroundMusic = document.getElementById("background-music");
        let muteButton = document.getElementById("mute-button");
        muteButton.addEventListener("click", this.toggleMusic.bind(this));
        this.checkMusicState();

        // Uložení stavu hudby před odchodem ze stránky
        window.addEventListener("beforeunload", this.saveMusicState.bind(this));
        // Kontrola stavu hudby po načtení stránky
        window.addEventListener("load", this.checkMusicState.bind(this));
    },

    // Kontrola stavu hudby
    checkMusicState: function () {
        let isMuted = localStorage.getItem("tic-tac-toe-music-muted") === "true";
        this.setMusicMuted(isMuted);
        if (!isMuted) {
            this.backgroundMusic.play();
        }
    },

    // Uložení stavu hudby
    saveMusicState: function () {
        localStorage.setItem("tic-tac-toe-music-muted", this.backgroundMusic.muted.toString());
    },

    // Nastavení stavu hudby
    setMusicMuted: function (isMuted) {
        this.backgroundMusic.muted = isMuted;

        if (isMuted) {
            document.getElementById("mute-button").innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            document.getElementById("mute-button").innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    },

    // Přepnutí stavu hudby
    toggleMusic: function () {
        let isMuted = !this.backgroundMusic.muted;
        this.setMusicMuted(isMuted);
    },

    // Vykreslení herní desky
    drawBoard: function () {
        let ctx = this.ctx;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                let x = col * this.cellSize + this.cellSize / 2;
                let y = row * this.cellSize + this.cellSize / 2;
                let cellValue = this.board.board[row][col];

                ctx.beginPath();
                ctx.rect(col * this.cellSize, row * this.cellSize, this.cellSize, this.cellSize);
                ctx.strokeStyle = "#ccc";
                ctx.stroke();

                if (this.board.winningCombination.length > 0 &&
                    this.board.winningCombination.some(function (cell) {
                        return cell[0] === row && cell[1] === col;
                    })) {
                    ctx.fillStyle = "grey";
                    ctx.fillRect(col * this.cellSize, row * this.cellSize, this.cellSize, this.cellSize);
                }

                ctx.font = "bold 48px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                if (cellValue === "X") {
                    ctx.fillStyle = "#1bff00"; // Zelená pro X
                } else if (cellValue === "O") {
                    ctx.fillStyle = "#ff0000"; // Červená pro O
                } else {
                    ctx.fillStyle = "#c9c0c0";
                }
                ctx.fillText(cellValue, x, y);
            }
        }
    },

    // Handler pro interakci herního políčka
    handleCellHover: function (event) {
        let rect = this.canvas.getBoundingClientRect();
        let mouseX = event.clientX - rect.left;
        let mouseY = event.clientY - rect.top;
        let hoveredRow = Math.floor(mouseY / this.cellSize);
        let hoveredCol = Math.floor(mouseX / this.cellSize);

        if (!this.board.gameOver && this.board.board[hoveredRow][hoveredCol] === "") {
            this.canvas.style.cursor = "pointer";
        } else {
            this.canvas.style.cursor = "default";
        }

        if (!this.board.gameOver && this.board.board[hoveredRow][hoveredCol] === "") {
            this.drawBoard();
            this.drawHoveredCell(hoveredRow, hoveredCol);
        }
    },

    // Handler pro ukončení interakce herního políčka
    handleCellLeave: function () {
        this.canvas.style.cursor = "default";
        this.drawBoard();
    },

    // Vykreslení nápovědy na políčku při interakci myší
    drawHoveredCell: function (row, col) {
        let ctx = this.ctx;
        let x = col * this.cellSize + this.cellSize / 2;
        let y = row * this.cellSize + this.cellSize / 2;
        let cellValue = this.board.currentPlayer;

        ctx.fillStyle = "rgba(0, 0, 0, 0)";
        ctx.fillRect(col * this.cellSize, row * this.cellSize, this.cellSize, this.cellSize);

        ctx.font = "bold 48px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#c9c0c0";
        ctx.fillText(cellValue, x, y);
    },

    // Handler pro kliknutí na herní desku
    handleCanvasClick: function (event) {
        let rect = this.canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        let col = Math.floor(x / this.cellSize);
        let row = Math.floor(y / this.cellSize);

        if (this.board.board[row][col] === "" && !this.board.gameOver) {
            this.board.board[row][col] = this.board.currentPlayer;
            this.drawBoard();

            if (this.board.checkWin()) {
                this.showWinMessage();
                this.updateScore();
                this.board.gameOver = true;
            } else if (this.board.checkTie()) {
                this.showTieMessage();
                this.board.gameOver = true;
            } else {
                this.board.currentPlayer = this.board.currentPlayer === "X" ? "O" : "X";
            }
        }
    },

    // Zobrazení vítězné zprávy
    showWinMessage: function () {
        let message = document.createElement("p");
        message.textContent = "Player " + this.board.currentPlayer + " wins!";
        message.classList.add("win-message");
        if (this.board.currentPlayer === "X") {
            message.style.color = "#1bff00"; // Zelená pro X
        } else if (this.board.currentPlayer === "O") {
            message.style.color = "#ff0000"; // Červená pro O
        }
        document.getElementById("game-page").appendChild(message);
    },

    // Zobrazení zprávy o remíze
    showTieMessage: function () {
        let message = document.createElement("p");
        message.textContent = "It's a tie!";
        message.classList.add("tie-message");
        message.style.color = "#fd6464";
        document.getElementById("game-page").appendChild(message);
    },

    // Aktualizace skóre
    updateScore: function () {
        let currentPlayer = this.board.currentPlayer;
        let currentPlayerIndex = currentPlayer === "X" ? 0 : 1;

        this.players[currentPlayerIndex].score++;
        document.getElementById("player-" + currentPlayer.toLowerCase() + "-score").textContent =
            "Score Player " + currentPlayer + ": " + this.players[currentPlayerIndex].score;

        this.saveScoreToLocalStorage();
    },

    // Resetování herní desky
    resetBoard: function () {
        this.board.resetBoard();
        this.drawBoard();
        this.clearMessages();
    },

    // Resetování skóre
    resetScore: function () {
        this.players.forEach(function (player) {
            player.score = 0;
        });
        this.updateScoreDisplay();
        this.clearLocalStorage();
    },

    // Aktualizace skóre
    updateScoreDisplay: function () {
        this.players.forEach(function (player) {
            let scoreElement = document.getElementById("player-" + player.name.toLowerCase() + "-score");
            scoreElement.textContent = "Score Player " + player.name + ": " + player.score;
            if (player.name === "X") {
                scoreElement.style.color = "#1bff00"; // Zelená pro X
            } else if (player.name === "O") {
                scoreElement.style.color = "#ff0000"; // Červená pro O
            }
        });
    },

    // Uložení skóre do local storage
    saveScoreToLocalStorage: function () {
        let scores = {};

        this.players.forEach(function (player) {
            scores[player.name] = player.score;
        });

        localStorage.setItem("tic-tac-toe-scores", JSON.stringify(scores));
    },

    // Načtení skóre z local storage
    loadScoreFromLocalStorage: function () {
        let scores = JSON.parse(localStorage.getItem("tic-tac-toe-scores"));

        if (scores) {
            this.players.forEach(function (player) {
                if (scores[player.name]) {
                    player.score = scores[player.name];
                }
            });
        }

        this.updateScoreDisplay();
    },

    // Smazání local storage
    clearLocalStorage: function () {
        localStorage.removeItem("tic-tac-toe-scores");
        this.updateScoreDisplay();
    },

    // Smazání zpráv
    clearMessages: function () {
        let messages = document.getElementsByClassName("win-message");
        while (messages[0]) {
            messages[0].parentNode.removeChild(messages[0]);
        }

        let tieMessage = document.getElementsByClassName("tie-message");
        if (tieMessage[0]) {
            tieMessage[0].parentNode.removeChild(tieMessage[0]);
        }
    },
};

// Inicializace hry po načtení DOM
document.addEventListener("DOMContentLoaded", function () {
    let startButton = document.querySelector(".button");
    let landingPage = document.querySelector(".landing-page");
    let gamePage = document.querySelector("#game-page");

    startButton.addEventListener("click", function () {
        landingPage.style.display = "none";
        gamePage.style.display = "block";
        TicTacToe.Game.init();
        TicTacToe.Game.checkMusicState();
    });

});
