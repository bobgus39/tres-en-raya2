const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/move', (req, res) => {
    const {board} =req.body; // Tablero actual
console.log('board',req.body);
    let bestMove = null;

    const emptyCells = board
        .map((cell, index) => cell === null ? index : null)
        .filter(cell => cell !== null);
    bestMove = emptyCells[Math.floor(Math.random()*emptyCells.length)];

    res.json({ move: bestMove }); // Retorna la jugada de la IA
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});