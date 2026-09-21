@echo off
title Quiz Master Launcher
echo ===================================================
echo           Starting Quiz Master Server
echo ===================================================
echo.
echo Opening http://localhost:8080 in your default browser...
start "" powershell -WindowStyle Hidden -Command "Start-Sleep -Seconds 1.5; Start-Process 'http://localhost:8080'"
echo.
echo Server is running. Keep this window open while using Quiz Master!
echo (Press Ctrl + C to stop the server)
echo.
node server.js
pause
