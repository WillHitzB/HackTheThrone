from fastapi import FastAPI, Depends
from fastapi.responses import PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, questions, users
from app.utils.middleware import LoggingMiddleware
from app.database import engine, Base
from app.api.auth import get_current_user
from app.models import User
import os
import random
import json

# Create database tables if they dont exist
Base.metadata.create_all(bind=engine)
FACTS_FILE = os.path.join(os.path.dirname(__file__), "data", "facts.txt")


app = FastAPI(title="HackBee Backend")

app.include_router(auth.router)
app.include_router(questions.router)
app.include_router(users.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(LoggingMiddleware)

@app.get("/")
async def root():
    return PlainTextResponse(content="Welcome to the HackBee API", status_code=200)

@app.get("/health")
async def health_check():
    return PlainTextResponse(content="healthy", status_code=200)

from app.utils.redis import get_redis

@app.get("/fact")
async def facts(current_user: User = Depends(get_current_user)):
    redis = await get_redis()
    cache_key = "facts_list"
    
    cached_facts = await redis.get(cache_key)
    if cached_facts:
        facts_list = json.loads(cached_facts)
    else:
        with open(FACTS_FILE, "r") as f:
            facts_list = [line.strip() for line in f.readlines()]
        await redis.setex(cache_key, 86400, json.dumps(facts_list)) # Cache for 24 hours
        
    return PlainTextResponse(content=random.choice(facts_list), status_code=200)