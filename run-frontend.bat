@echo off
title CareConnect - Patient Record Management System
echo ========================================================
echo   CareConnect - Patient Record Management System
echo   Launching Frontend using built-in Java Web Server...
echo ========================================================
echo.
echo Serving directory: %~dp0frontend
echo Access URL:        http://localhost:3000/
echo.

start http://localhost:3000/
"C:\Program Files\Java\jdk-26\bin\jwebserver.exe" -d "%~dp0frontend" -p 3000
pause
