"use client";

import { useState } from 'react';

export default function Home() {
    const [board, setBoard] = useState(Array(9).fill(null)); // Estado del tablero
    const [isPlayerX, setIsPlayerX] = useState(true); // true = jugador X, false = jugador O
    const [winner, setWinner] = useState(null); // 'X', 'O' o 'draw'
    const [gameStatus, setGameStatus] = useState('Juego en progreso'); // Estado del juego

    // Manejar el clic en una celda
    const handleCellClick = async (index) => {
        if (board[index] || winner) return; // No hacer nada si la celda ya está ocupada o hay un ganador

        const newBoard = [...board];
        newBoard[index] = isPlayerX ? 'X' : 'O'; // Colocar 'X' o 'O' según el turno
        setBoard(newBoard);

        // Verificar si hay un ganador
        const response = await fetch('/api/check-winner', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ board: newBoard }),
        });
        const data = await response.json();
console.log(data);
        if (data.winner) {
            setWinner(data.winner);
            setGameStatus(data.winner === 'X' ? '¡Ganaste!' : data.winner === 'O'? '¡La IA ganó!': data.winner === 'draw'?'¡Empate!':'error');
        } else {
            setIsPlayerX(!isPlayerX); // Cambiar el turno
        }
    };

    // Reiniciar el juego
    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsPlayerX(true);
        setWinner(null);
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