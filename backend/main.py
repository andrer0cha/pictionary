from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import random
import os
from dotenv import load_dotenv
from pydantic import BaseModel

# Load environment variables
load_dotenv()

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample word list (you can expand this or load from a file)
WORDS = [
    "cat", "dog", "house", "tree", "sun", "moon", "star",
    "book", "chair", "table", "phone", "computer", "car",
    "bike", "flower", "bird", "fish", "apple", "banana"
]

class GameSettings(BaseModel):
    round_time: int = 60  # Default time in seconds

@app.get("/")
async def read_root():
    return {"message": "Pictionary Game API"}

@app.post("/word")
async def get_word(settings: GameSettings):
    # Get word length constraints from environment variables
    min_length = int(os.getenv("MIN_WORD_LENGTH", 3))
    max_length = int(os.getenv("MAX_WORD_LENGTH", 10))
    
    # Filter words by length
    valid_words = [word for word in WORDS if min_length <= len(word) <= max_length]
    
    if not valid_words:
        return {"word": random.choice(WORDS)}
    
    return {
        "word": random.choice(valid_words),
        "round_time": settings.round_time
    }

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    reload = os.getenv("RELOAD", "True").lower() == "true"
    
    uvicorn.run("main:app", host=host, port=port, reload=reload, debug=debug) 
