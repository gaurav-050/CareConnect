@echo off
title CareConnect - Spring Boot 3 Backend Server
echo ========================================================
echo   CareConnect - Patient Record Management System
echo   Launching Spring Boot 3 REST API Backend...
echo ========================================================
echo.
echo Server Port:       8080
echo Swagger UI:        http://localhost:8080/swagger-ui.html
echo H2 Web Console:    http://localhost:8080/h2-console
echo REST API Base:     http://localhost:8080/api/
echo.

cd /d "%~dp0backend"
call .\mvnw.cmd spring-boot:run
pause
