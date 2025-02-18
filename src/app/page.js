"use client";

import { useState, useEffect } from 'react';

export default function Home() {
  const [board, setBoard] = useState(Array(9).fill(null)); // Estado del tablero
  const [isPlayerTurn, setIsPlayerTurn] = useState(true); // true = jugador X, false = jugador O
  const [ranking, setRanking] = useState({ playerWins: 0, aiWins: 0, draws: 0 }); // 'X', 'O' o 'draw'
  const [gameStatus, setGameStatus] = useState('Juego en progreso'); // Estado del juego
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Estado del dropdown
  const [difficulty, setDifficulty] = useState('medium'); // Estado de la dificultad

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
        return board[a]; // Retorna 'X' o 'O'
      }
    }

    if (board.every(cell => cell !== null)) { // Comprueba si hay un empate mediante el tablero lleno
      return 'draw'; // Empate
    }

    return null; // No hay ganador
  };

  const updateRanking = async () => {
    const rankingResponse = await fetch('/api/ranking');
    const rankingData = await rankingResponse.json();
    setRanking(rankingData);
  };

  const handleGameEnd = async (winner) => {
    let result;
    if (winner === 'X') {
      result = 'player';
      setGameStatus('¡Ganaste!');
    } else if (winner === 'O') {
      result = 'ai';
      setGameStatus('¡La IA ganó!');
    } else {
      result = 'draw';
      setGameStatus('¡Empate!');
    }

    await fetch('/api/save-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result }),
    }); // Guardar el resultado de la partida

    // Obtener el ranking actualizado
    await updateRanking();
  };

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
      body: JSON.stringify({ board: newBoard, difficulty }), // enviar la dificultad
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
  };

  // Reiniciar el juego
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameStatus('Juego en progreso');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectDifficulty = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  useEffect(() => {
    updateRanking();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6">
      <h1 className="text-2xl font-bold mt-4">Tres en Raya</h1>
      <h2 className="">{gameStatus}</h2>
      {/*<p>Le toca jugar a {!isPlayerTurn?'O':'X'}</p>*/}

      {/* Tablero del juego */}
      <div className="grid grid-cols-3 gap-1 w-[310px]">
        {board.map((cell, index) => {
          const baseClasses = "w-[100px] h-[100px] border border-black border-r-0 border-b-0";
          const hoverClasses = cell === 'X' ? "bg-orange-300 hover:bg-orange-200 active:bg-orange-400" : "hover:bg-gray-200 active:bg-gray-300";

          return (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              className={`${baseClasses} ${hoverClasses}`}
            >
              {cell}
            </button>
          );
        })}
      </div>

      {/* Botón para reiniciar el juego */}
      <button onClick={resetGame} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300">
        Reiniciar Juego
      </button>

      {/* Dropdown para seleccionar la dificultad */}
      <div className="relative inline-block text-left">
        <button
          type="button"
          onClick={toggleDropdown}
          className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded={isDropdownOpen}
        >
          {!difficulty?'Dificultad':difficulty}
          <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <a href="#" onClick={() => selectDifficulty('easy')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Fácil</a>
              <a href="#" onClick={() => selectDifficulty('medium')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Medio</a>
              <a href="#" onClick={() => selectDifficulty('hard')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Difícil</a>
            </div>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Ranking</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">Jugador</th>
            <th className="py-2 px-4 border-b">Victorias</th>
            <th className="py-2 px-4 border-b">Empates</th>
            <th className="py-2 px-4 border-b">Derrotas</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-gray-100">
            <td className="py-2 px-4 border-b">Jugador</td>
            <td className="py-2 px-4 border-b">{ranking.playerWins}</td>
            <td className="py-2 px-4 border-b">{ranking.draws}</td>
            <td className="py-2 px-4 border-b">{ranking.aiWins}</td>
          </tr>
          <tr className="hover:bg-gray-100">
            <td className="py-2 px-4 border-b">IA</td>
            <td className="py-2 px-4 border-b">{ranking.aiWins}</td>
            <td className="py-2 px-4 border-b">{ranking.draws}</td>
            <td className="py-2 px-4 border-b">{ranking.playerWins}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
