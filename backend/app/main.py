from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Monitor API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3002",
        "http://192.168.1.201:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/api/system/overview")
def overview():
    # Mock data for now — real psutil data comes in Phase 3
    return {
        "cpu_percent": 12.4,
        "ram_total_gb": 3.7,
        "ram_used_gb": 2.9,
        "ram_percent": 78.4,
        "disk_total_gb": 198,
        "disk_used_gb": 6.0,
        "disk_percent": 4.0,
        "uptime_seconds": 100800,
    }