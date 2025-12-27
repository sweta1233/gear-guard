from fastapi import FastAPI

app = FastAPI(title="GearGuard API")

@app.get("/")
def root():
    return {"status": "GearGuard backend running"}
