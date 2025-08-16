#!/bin/bash

# Stop development environment script for Bike Rental System

echo "🛑 Stopping Bike Rental System Development Environment"
echo "====================================================="

# Function to kill processes on specific ports
kill_port() {
    local port=$1
    local process_name=$2
    
    echo "🔍 Stopping $process_name on port $port..."
    
    # Find processes using the port
    local pids=$(lsof -ti :$port 2>/dev/null)
    
    if [ ! -z "$pids" ]; then
        echo "🔪 Killing processes: $pids"
        echo "$pids" | xargs kill -9 2>/dev/null
        sleep 1
        echo "✅ Stopped $process_name"
    else
        echo "ℹ️  No $process_name processes found on port $port"
    fi
}

# Stop all services
kill_port 3000 "React Client (old)"
kill_port 3001 "React Client"
kill_port 5001 "Node.js Server"

echo ""
echo "✅ All development services stopped successfully!"
echo "💡 To start again, run: ./start-dev.sh"
