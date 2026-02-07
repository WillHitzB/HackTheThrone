from fastapi import FastAPI
from fastapi.responses import PlainTextResponse
from app.api import auth, questions
from app.database import engine, Base
import os
import random

# Create database tables if they dont exist
Base.metadata.create_all(bind=engine)
FACTS_FILE = os.path.join(os.path.dirname(__file__), "data", "facts.txt")


app = FastAPI(title="HackBee Backend")

app.include_router(auth.router)
app.include_router(questions.router)

@app.get("/")
async def root():
    return PlainTextResponse(content="Welcome to the HackBee API", status_code=200)

@app.get("/health")
async def health_check():
    return PlainTextResponse(content="healthy", status_code=200)

@app.get("/fact")
async def facts():
    with open(FACTS_FILE, "r") as f:
        return PlainTextResponse(content=random.choice(f.readlines()).strip(), status_code=200)