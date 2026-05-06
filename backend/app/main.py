from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
import app.models

from app.auth import router as auth_router
from app.detection import router as detection_router

app = FastAPI(
    title="WildGuard AI Detection System"
)

# ---------------- CORS ----------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- DATABASE ----------------

Base.metadata.create_all(bind=engine)

# ---------------- ROUTERS ----------------

app.include_router(auth_router, prefix="/auth")
app.include_router(detection_router)

# ---------------- HEALTH CHECK ----------------

@app.get("/")
def health():
    return {"status": "WildGuard Backend Running"}