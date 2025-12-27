from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import equipment, maintenance, auth, maintenance_team

Base.metadata.create_all(bind=engine)

app = FastAPI(title="GearGuard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(maintenance_team.router)
app.include_router(equipment.router)
app.include_router(maintenance.router)

@app.get("/")
def root():
    return {"status": "GearGuard backend running"}
