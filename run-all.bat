@echo off
title CareConnect - Full-Stack Launcher (Frontend + Backend)
echo ========================================================
echo   CareConnect - Patient Record Management System
echo   Launching Full-Stack Application...
echo ========================================================
echo.
echo [1/2] Starting Spring Boot 3 Backend Server on port 8080...
start "CareConnect Backend" cmd /k "cd /d %~dp0backend && .\mvnw.cmd spring-boot:run"

echo [2/2] Starting Frontend Web Server on port 3000...
start "CareConnect Frontend" cmd /k "cd /d %~dp0frontend && ^"C:\Program Files\Java\jdk-26\bin\jwebserver.exe^" -d . -p 3000"

echo.
echo Waiting 5 seconds for services to initialize...
timeout /t 5 /nobreak >nul

echo Opening browser...
start http://localhost:3000/
start http://localhost:8080/swagger-ui.html

echo.
echo All services launched!
echo - Frontend UI:        http://localhost:3000/
echo - Backend Swagger UI:  http://localhost:8080/swagger-ui.html
echo - H2 Console:         http://localhost:8080/h2-console
echo.
pause
