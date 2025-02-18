@echo off
REM Start the backend server
start cmd /k "cd backend && node server.js"

REM Start the frontend development server
cd C:\Users\monic\Downloads\tres_en_raya\tres-en-raya2
start cmd /k "npm run dev"
