const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/check-winner', (req, res) => {
    const board = req.body.board;

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
        [0, 4, 8], [2, 4, 6] // Diagonales
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return res.json({ winner: board[a] }); // Retorna 'X' o 'O'
        }
    }

    if (board.every(cell => cell !== null)) {
        return res.json({ winner: 'draw' }); // Empate
    }

    return res.json({ winner: null }); // No hay ganador
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});