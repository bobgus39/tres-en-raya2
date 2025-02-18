#!/bin/bash

# Start the frontend development server
gnome-terminal -- bash -c "npm run dev; exec bash"

# Start the backend server
gnome-terminal -- bash -c "cd backend && node server.js; exec bash"


