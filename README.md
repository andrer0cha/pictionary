# 🎨 Pictionary Game (Single Player)

A modern, web-based Pictionary game where you can draw, guess, and challenge yourself! Play solo, improve your drawing and guessing skills, and track your score locally.

## Features

- 🖌️ Interactive drawing canvas
- 🧩 Random word generator for each round (via backend API)
- 📝 Guess what you just drew
- 🏆 Local score tracking
- ⏰ Configurable round timer with ticking sound
- 🎭 Fun random avatar for your profile
- 📜 Guess history for each round

## Tech Stack

- **Frontend:** React (18+), TypeScript, TailwindCSS, Vite
- **Backend:** FastAPI (0.95+), Python 3.9+, Uvicorn

## Requirements

- **Node.js** (v18 or newer)
- **npm** (comes with Node.js)
- **Python** (3.9 or newer)
- **pip** (comes with Python)

If you do not have these tools, follow the instructions below.

### How to Install Node.js and npm
- Go to [https://nodejs.org/](https://nodejs.org/) and download the LTS version for your OS.
- Install by following the instructions for your platform.
- After installation, check with:
  ```sh
  node -v
  npm -v
  ```

### How to Install Python and pip
- Go to [https://www.python.org/downloads/](https://www.python.org/downloads/) and download Python 3.9 or newer for your OS.
- Install by following the instructions for your platform.
- Make sure to check the box to add Python to your PATH during installation.
- After installation, check with:
  ```sh
  python --version
  pip --version
  ```

## Installation

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd pictionary/
   ```

2. **Set up the backend:**
   ```sh
   cd backend
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   pip install fastapi uvicorn
   cd ..
   ```

3. **Set up the frontend:**
   ```sh
   cd frontend
   npm install
   cd ..
   ```

## Running the Game

1. **Start the backend server:**
   ```sh
   cd backend
   # Activate the virtual environment if not already active
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   The backend will start on http://localhost:8000

2. **Start the frontend app:**
   ```sh
   cd frontend
   npm run dev
   ```
   The frontend will start on http://localhost:5173

3. **Open your browser and go to:**
   [http://localhost:5173](http://localhost:5173)

## Troubleshooting

- If you get `Failed to scan for dependencies from entries: ...` or `Cannot find module` errors when running `npm run dev`, make sure you:
  - Are in the `frontend` directory when running `npm install` and `npm run dev`.
  - Have a valid `package.json` in the `frontend` folder.
  - If problems persist, try deleting `node_modules` and `package-lock.json`, then run `npm install` again:
    ```sh
    rm -rf node_modules package-lock.json
    npm install
    ```
- If you get Python errors, make sure your virtual environment is activated and all dependencies are installed.

## How to Play

- Click "Start Drawing!" in the lobby.
- Draw the word shown on the canvas (fetched from the backend).
- Enter your guess for what you just drew in the input box.
- Earn 10 points for each correct guess!
- View your guess history for the current round.
- Start a new round or return to the lobby at any time.

## Next steps

- Add multiplayer mode so you can play and compete with friends in real time.
- Add more word packs and drawing tools.
- Add sound effects and animations for correct/incorrect guesses.
- Add a leaderboard for high scores.

## Time spent coding

- 52 minutes

## Disclaimer

This project was created with the assistance of AI (Cursor). Some code, documentation, and design decisions were generated or reviewed by AI.

---

Enjoy playing and feel free to contribute or suggest improvements!
