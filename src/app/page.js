"use client";

import { useState } from 'react';

export default function Home() {
    const [board, setBoard] = useState(Array(9).fill(null)); // Estado del tablero
    const [isPlayerTurn, setIsPlayerTurn] = useState(true); // true = jugador X, false = jugador O
    //const [ranking, setRanking] = useState({ playerWins: 0, aiWins: 0, draws: 0 }); // 'X', 'O' o 'draw'
    const [gameStatus, setGameStatus] = useState('Juego en progreso'); // Estado del juego
const checkWinner = (board) => {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
        [0, 4, 8], [2, 4, 6] // Diagonales
    ];
// Comprueba si hay un ganador
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            console.log('board[a]',board[a]);
            return board[a] ; // Retorna 'X' o 'O'
        }
    }

    if (board.every(cell => cell !== null)) {// Comprueba si hay un empate mediante el tablero lleno
        
        return  'draw' ; // Empate
    }

    return  null ; // No hay ganador

    
};

const handleGameEnd = async (winner) => {
 
 if (winner === 'X') {
    
    setGameStatus('¡Ganaste!');
} else if (winner === 'O') {
    
    setGameStatus('¡La IA ganó!');
} else {
    
    setGameStatus('¡Empate!');
}
}
const handleCellClick = async (index) => {
    if (board[index] || !isPlayerTurn) return;
    const newBoard = [...board];

    newBoard[index] = 'X';
    setBoard(newBoard);

    const winner = checkWinner(newBoard);

    if (winner) {
        handleGameEnd(winner);
        return;
    }

    setIsPlayerTurn(false);

    const response = await fetch('/api/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board: newBoard }),
    });

    const { move } = await response.json();

    if (move !== null) {
        newBoard[move] = 'O';
        setBoard(newBoard);

        const aiWinner = checkWinner(newBoard);

        if (aiWinner) {
            handleGameEnd(aiWinner);
        } else {
            setIsPlayerTurn(true);
        }
          
        }
    }
    
    // Reiniciar el juego
    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsPlayerTurn(true);
        //setWinner(null);
        setGameStatus('Juego en progreso');
    };

    return (
        <div>
            <h1>Tres en Raya</h1>
            <div>{gameStatus}</div>

            {/* Tablero del juego */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: '5px' }}>
                {board.map((cell, index) => (
                    <button
                        key={index}
                        onClick={() => handleCellClick(index)}
                        style={{
                            width: '100px',
                            height: '100px',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            backgroundColor: '#f0f0f0',
                            border: '1px solid #ccc',
                            cursor: 'pointer',
                        }}
                    >
                        {cell}
                    </button>
                ))}
            </div>

            {/* Botón para reiniciar el juego */}
            <button onClick={resetGame} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}>
                Reiniciar Juego
            </button>
        </div>
    );
}