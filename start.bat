@echo off
title CarePoint Healthcare Platform Launcher
echo ===================================================
echo   Starting CarePoint Healthcare Appointment System
echo ===================================================
echo.

echo [1/3] Starting Backend API Server (Port 5000)...
start "CarePoint Backend API" cmd.exe /k "cd /d C:\PROJECT1\Health Appointment\backend && npm.cmd run dev"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend Web Server (Port 5173)...
start "CarePoint Frontend Web" cmd.exe /k "cd /d C:\PROJECT1\Health Appointment\frontend && npm.cmd run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Opening Browser at http://localhost:5173...
start http://localhost:5173

echo.
echo ===================================================
echo   System is now live!
echo   Frontend: http://localhost:5173
echo   Backend : http://localhost:5000
echo.
echo   Demo Accounts (or use 1-Click buttons on Login):
echo   - Patient: rahul@example.com / patient123
echo   - Doctor : doctor.sarah@carepoint.com / doctor123
echo   - Admin  : admin@carepoint.com / admin123
echo ===================================================
pause
