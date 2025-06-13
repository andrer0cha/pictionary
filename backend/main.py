from fastapi import FastAPI
import random
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Pictionary Single Player API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

WORDS = [
    "house", "car", "cat", "dog", "tree", "flower", "sun", "moon", "star", "fish",
    "bird", "book", "phone", "computer", "chair", "table", "window", "door", "key", "clock",
    "bicycle", "airplane", "boat", "train", "bus", "road", "bridge", "mountain", "river", "ocean",
    "pizza", "burger", "cake", "apple", "banana", "guitar", "piano", "camera", "ball", "game"
]

@app.get("/")
def health():
    return {"status": "ok"}

@app.get("/random-word")
def get_random_word():
    word = random.choice(WORDS)
    return {"word": word} 
