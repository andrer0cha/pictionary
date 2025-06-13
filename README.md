# 🎨 Pictionary Game (Single Player)

A modern, web-based Pictionary game for solo play. Draw, guess, and track your score locally.

## Features
- Interactive drawing canvas
- Random word for each round (from backend API)
- Guess what you drew
- Local score tracking
- Configurable round timer
- Fun random avatar
- Guess history per round

## Tech Stack
- **Frontend:** React 18+, TypeScript, TailwindCSS, Vite
- **Backend:** FastAPI, Python 3.9+, Uvicorn

## Requirements
- Node.js v18+
- npm
- Python 3.9+
- pip

---

## Installation

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd pictionary/
   ```

2. **Backend setup:**
   ```sh
   cd backend
   python3 -m venv venv
   # Activate the virtual environment:
   # macOS/Linux:
   source venv/bin/activate
   # Windows:
   venv\Scripts\activate
   pip install --upgrade pip setuptools wheel
   pip install -r requirements.txt
   cd ..
   ```

3. **Frontend setup:**
   ```sh
   cd frontend
   npm install
   cd ..
   ```

4. **Environment Variables:**
   - Copy `.env.example` to `.env` in the backend directory:
     ```sh
     cd backend
     cp .env.example .env
     ```
   - No additional secrets are required for local development

---

## Usage

1. **Start the backend:**
   ```sh
   cd backend
   # Activate the virtual environment if needed
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   The backend runs at http://localhost:8000

2. **Start the frontend:**
   ```sh
   cd frontend
   npm run dev
   ```
   The frontend runs at http://localhost:5173

3. **Open your browser at:**
   [http://localhost:5173](http://localhost:5173)

---

## How to Play
- Click "Start Drawing!"
- Draw the word shown (fetched from backend)
- Enter your guess for what you drew
- Earn 10 points for each correct guess
- View your guess history
- Start a new round or return to the lobby anytime

---

## Project Structure
```
pictionary/
├── backend/
│   ├── venv/               # Python virtual environment (gitignored)
│   ├── .env               # Environment variables (gitignored)
│   ├── .env.example       # Example environment variables
│   ├── requirements.txt   # Python dependencies
│   └── main.py           # FastAPI application
└── frontend/
    ├── node_modules/      # Node.js dependencies (gitignored)
    ├── package.json      # Node.js dependencies and scripts
    └── src/              # React source code
```

---

## Troubleshooting

- **Python 'externally-managed-environment' error (Linux/Python 3.11+):**
  Use:
  ```sh
  pip install --break-system-packages -r requirements.txt
  ```
- **macOS: 'Failed building wheel for pydantic-core':**
  - Install Xcode Command Line Tools:
    ```sh
    xcode-select --install
    ```
  - Then run:
    ```sh
    pip install --upgrade pip setuptools wheel
    pip install -r requirements.txt
    ```
- **npm install errors:**
  - Make sure you are in the `frontend` directory.
  - If needed, delete `node_modules` and `package-lock.json`, then run `npm install` again.

---

## Next steps
- Multiplayer mode
- More word packs and drawing tools
- Sound effects and animations
- Leaderboard

## Time spent coding
- 52 minutes

## Disclaimer
This project was created with the assistance of AI (Cursor).

---

Enjoy playing and feel free to contribute or suggest improvements!
