const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

let games = []; // Almacena los resultados de los juegos

// Función para verificar si hay un ganador
const checkWinner = (board) => {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
        [0, 4, 8], [2, 4, 6] // Diagonales
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Retorna 'X' o 'O' dependiendo del ganador
        }
    }

    if (board.every(cell => cell !== null)) {
        return 'draw'; // Empate
    }

    return null; // No hay ganador todavía
};

// Función Minimax
const minimax = (board, depth, isMaximizing) => {
    const winner = checkWinner(board);

    if (winner === 'O') return 10 - depth; // La IA gana
    if (winner === 'X') return depth - 10; // El jugador gana
    if (winner === 'draw') return 0; // Empate

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'O'; // La IA hace un movimiento
                const score = minimax(board, depth + 1, false); // Llamada recursiva que simula el movimiento del jugador en el siguiente nivel del árbol
                board[i] = null; // Deshacer el movimiento para probar con otra casilla
                bestScore = Math.max(score, bestScore); // Obtener el máximo score

            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'X'; // El jugador hace un movimiento
                const score = minimax(board, depth + 1, true);
                board[i] = null; // Deshacer el movimiento
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
};

// Endpoint para obtener la jugada de la IA
app.post('/api/move', (req, res) => {
    const {board, difficulty} =req.body; // Tablero actual
console.log('board',req.body);
    let bestMove = null;

    if (difficulty === 'easy') {
        // Dificultad Fácil: Movimiento aleatorio
        const emptyCells = board
            .map((cell, index) => cell === null ? index : null)
            .filter(index => index !== null);
        bestMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } else if (difficulty === 'medium') {
        // Dificultad Media: Minimax con profundidad limitada y aleatoriedad
        bestMove = getBestMoveMedium(board);
    } else if (difficulty === 'hard') {
        // Dificultad Difícil: Minimax completo
        bestMove = getBestMove(board, 3); // Profundidad máxima
    }
    res.json({ move: bestMove }); // Retorna la jugada de la IA
});

// Función para obtener el mejor movimiento usando Minimax
const getBestMove = (board, depth) => {
    let bestMove = null;
    let bestScore = -Infinity;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
            board[i] = 'O'; // La IA hace un movimiento temporal
            const score = minimax(board, depth, false);
            board[i] = null; // Deshacer el movimiento
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    return bestMove;
};

// Función para obtener el mejor movimiento en el nivel medio
const getBestMoveMedium = (board) => {
    const emptyCells = board
        .map((cell, index) => cell === null ? index : null)
        .filter(index => index !== null);

    // 70% de probabilidad de usar Minimax con profundidad limitada
    if (Math.random() < 0.7) {
        return getBestMove(board, 2); // Profundidad limitada a 2
    } else {
        // 30% de probabilidad de elegir un movimiento aleatorio
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
};

// Endpoint para guardar el resultado de la partida
app.post('/api/save-game', (req, res) => {
    const { result } = req.body;
    games.push(result); // Guardar el resultado en el array
    res.json({ success: true });
});

// Endpoint para obtener el ranking
app.get('/api/ranking', (req, res) => {
    const ranking = {
        playerWins: games.filter(game => game === 'player').length,
        aiWins: games.filter(game => game === 'ai').length,
        draws: games.filter(game => game === 'draw').length,
    };
    res.json(ranking);
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});