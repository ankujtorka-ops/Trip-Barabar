@echo off
title Trip Barabar Server
echo ========================================================
echo   Trip Barabar - Hisaab Barabar Server Launcher
echo ========================================================
echo Starting local web server on port 8090...
start http://localhost:8090
node "%~dp0server.js"
pause
