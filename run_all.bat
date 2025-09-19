@echo off
echo Starting ecoMarket Application...

echo.
echo Starting Backend (Port 5001)...
start "Backend" cmd /k "cd backend && python app.py"

echo.
echo Starting Assistant Service (Port 5002)...
start "Assistant" cmd /k "cd assistant_service && python app.py"

echo.
echo Starting Frontend (Port 5173)...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo All services are starting...
echo Backend: http://localhost:5001
echo Assistant: http://localhost:5002
echo Frontend: http://localhost:5173
echo.
pause