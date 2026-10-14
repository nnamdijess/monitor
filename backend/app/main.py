from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psutil, time

app = FastAPI(title="Monitor API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3002",
        "http://192.168.1.201:3002",
        "http://100.127.64.26:3002"],
        
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


boot_time = psutil.boot_time()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/api/system/overview")
def overview():
    ram = psutil.virtual_memory()
    disk = psutil.disk_usage("/")
    uptime = int(time.time() - boot_time)
    return {
        "cpu_percent": psutil.cpu_percent(interval=0.5),
        "ram_total_gb": round(ram.total / 1e9, 1),
        "ram_used_gb": round(ram.used / 1e9, 1),
        "ram_percent": ram.percent,
        "disk_total_gb": round(disk.total / 1e9, 1),
        "disk_used_gb": round(disk.used / 1e9, 1),
        "disk_percent": disk.percent,
        "uptime_seconds": uptime,
    }