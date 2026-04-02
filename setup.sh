#!/bin/bash
# Install dependencies and start the chatbot widget development server

echo "🚀 Nobroker Chatbot Widget Setup"
echo "================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Start development server
echo ""
echo "🌐 Starting development server..."
echo "📱 Open http://localhost:3000 in your browser"
echo ""

npm start
