#!/bin/bash

# Bike Rental System Startup Script
echo "🚀 Starting Bike Rental System..."

# Kill any existing processes on ports 5001 and 3001
echo "🔄 Cleaning up existing processes..."
lsof -ti:5001 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Start the server in background
echo "🖥️  Starting server on port 5001..."
cd server
PORT=5001 node App.js > ../server.log 2>&1 &
SERVER_PID=$!
echo "Server started with PID: $SERVER_PID"

# Wait a moment for server to start
sleep 3

# Start the client
echo "🌐 Starting client on port 3001..."
cd ../client
PORT=3001 npm start &
CLIENT_PID=$!
echo "Client started with PID: $CLIENT_PID"

echo "✅ Both applications are starting..."
echo "📊 Server: http://localhost:5001"
echo "🌐 Client: http://localhost:3001"
echo ""
echo "📝 Server logs: tail -f server.log"
echo "🛑 To stop: kill $SERVER_PID $CLIENT_PID"

# Save PIDs for easy cleanup
echo "$SERVER_PID" > server.pid
echo "$CLIENT_PID" > client.pid

echo "🎉 Bike Rental System is ready!"
