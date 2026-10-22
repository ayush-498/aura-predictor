@echo off
setlocal enabledelayedexpansion
title AURA Predictor - Enterprise ML Launcher
cd /d "%~dp0"

echo ========================================================
echo   AURA Predictor -- Enterprise HR Salary Decision Engine
echo ========================================================
echo.

:: 1. Detect Python Runtime
set "PYTHON_EXE="
if exist ".venv\Scripts\python.exe" (
    set "PYTHON_EXE=.venv\Scripts\python.exe"
) else (
    where python >nul 2>nul
    if !errorlevel! equ 0 (
        set "PYTHON_EXE=python"
    )
)

if "%PYTHON_EXE%"=="" (
    echo [ERROR] Python not found!
    echo Please create a virtual environment (.venv) or install Python 3.10+.
    pause
    exit /b 1
)

:: 2. Ensure Frontend Dependencies
if not exist "frontend\node_modules" (
    echo [*] Frontend dependencies missing. Running npm install...
    cd frontend && call npm.cmd install && cd ..
)

:: 3. Start Backend Microservice on Port 5050
echo [1/2] Starting Production ML Backend on http://localhost:5050...
start "AURA Predictor - ML Backend (Port 5050)" cmd /k "title ML Backend (:5050) && "%PYTHON_EXE%" -u backend\app.py"

:: Allow backend 2 seconds to bind port
timeout /t 2 /nobreak > nul

:: 4. Start Vite Frontend on Port 3000
echo [2/2] Starting Modern Enterprise Frontend on http://localhost:3000...
start "AURA Predictor - Vite Frontend (Port 3000)" cmd /k "title Vite Frontend (:3000) && cd /d "%~dp0frontend" && npm.cmd run dev"

:: Allow Vite 3 seconds to spin up, then open browser
timeout /t 3 /nobreak > nul
start http://localhost:3000

echo.
echo ========================================================
echo   Active Localhost Endpoints:
echo    - Frontend UI / Landing : http://localhost:3000
echo    - Direct Predictor App  : http://localhost:3000?view=app
echo    - Backend Health Probe  : http://localhost:5050/api/health
echo    - Model Metrics (R2)    : http://localhost:5050/api/metrics
echo    - Inference Endpoint    : http://localhost:5050/api/predict
echo ========================================================
echo.
echo Both servers are running in separate terminal windows.
echo Press any key to exit this launcher (services keep running).
pause > nul
