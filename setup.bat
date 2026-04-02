@echo off
REM Install dependencies and start the chatbot widget development server

echo.
echo 🚀 Nobroker Chatbot Widget Setup
echo ==================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

echo ✅ npm version: 
npm --version

echo.
echo 📦 Installing dependencies...
echo.

call npm install

if errorlevel 1 (
    echo.
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed successfully
echo.
echo 🌐 Starting development server...
echo 📱 Open http://localhost:3000 in your browser
echo.

call npm start

pause
