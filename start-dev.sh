#!/bin/bash

# Development startup script for Bike Rental System
# This script ensures clean startup by killing any existing processes

echo "🚀 Starting Bike Rental System Development Environment"
echo "=================================================="

# Function to kill processes on specific ports
kill_port() {
    local port=$1
    local process_name=$2
    
    echo "🔍 Checking for existing $process_name processes on port $port..."
    
    # Find processes using the port
    local pids=$(lsof -ti :$port 2>/dev/null)
    
    if [ ! -z "$pids" ]; then
        echo "⚠️  Found existing processes on port $port: $pids"
        echo "🔪 Killing existing processes..."
        echo "$pids" | xargs kill -9 2>/dev/null
        sleep 2
        echo "✅ Cleaned up port $port"
    else
        echo "✅ Port $port is clean"
    fi
}

# Clean up existing processes
echo ""
echo "🧹 Cleaning up existing processes..."
kill_port 3000 "React Client (old)"
kill_port 3001 "React Client"
kill_port 5001 "Node.js Server"

echo ""
echo "🔄 Starting services..."

# Start the backend server
echo "🖥️  Starting backend server on port 5001..."
cd server
PORT=5001 node App.js &
SERVER_PID=$!
cd ..

# Wait for server to start
echo "⏳ Waiting for server to initialize..."
sleep 3

# Check if server started successfully
if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Backend server started successfully (PID: $SERVER_PID)"
else
    echo "❌ Failed to start backend server"
    exit 1
fi

# Start the frontend client
echo "🌐 Starting frontend client on port 3001..."
cd client
PORT=3001 npm start &
CLIENT_PID=$!
cd ..

# Wait for client to start
echo "⏳ Waiting for client to initialize..."
sleep 5

# Check if client started successfully
if kill -0 $CLIENT_PID 2>/dev/null; then
    echo "✅ Frontend client started successfully (PID: $CLIENT_PID)"
else
    echo "❌ Failed to start frontend client"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 Development environment started successfully!"
echo "=================================================="
echo "🌐 Frontend: http://localhost:3001"
echo "🖥️  Backend:  http://localhost:5001"
echo "📊 Admin Dashboard: http://localhost:3001/dashboard"
echo "➕ Add Bikes: http://localhost:3001/addbikes"
echo ""
echo "💡 To stop all services, press Ctrl+C or run: ./stop-dev.sh"
echo ""

# Keep script running and handle cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down development environment..."
    kill $CLIENT_PID $SERVER_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Wait for processes
wait
