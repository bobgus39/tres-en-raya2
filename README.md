# Tres en Raya (Tic-Tac-Toe) Game

This is a simple implementation of the classic Tic-Tac-Toe game, also known as "Tres en Raya." The game features a web-based interface built with React and Tailwind CSS, and a backend server to manage game logic and ranking.

## Features

- Play Tic-Tac-Toe against an AI opponent.
- Selectable difficulty levels: Easy, Medium, Hard.
- Real-time game status updates.
- Ranking system to track wins, draws, and losses.
- Responsive design for various screen sizes.

## Project Structure

- `/tres-en-raya2/backend`: Contains the backend server code.
- `/tres-en-raya2`: Contains the React-based frontend code.
- `start.bat`: Batch script to start both frontend and backend servers on Windows.
- `start.sh`: Shell script to start both frontend and backend servers on Unix-based systems.

## Prerequisites

- Node.js and npm installed on your machine.
- A modern web browser to run the frontend application.

## Setup and Installation for windows

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/bobgus39/tres-en-raya2.git
   cd tres-en-raya2

2. **Deploy frontend**:

   npm install

   npm run dev 
 

3. **deploy backend**:

    cd backend

    npm install

    node server.js 

## Usage

1. Open your web browser and navigate to http://localhost:3000 to access the game interface.
2. Play the game by clicking on the cells in the grid.
3. Select the difficulty level from the dropdown menu.
4. View the ranking table to see your performance against the AI.
5. Click the "Reiniciar Juego" button to restart the game.

## Acknowledgments

- Inspired by the classic game of Tic-Tac-Toe.
- Built using Next.js and Node.js.

