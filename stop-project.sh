#!/bin/bash

# Bike Rental System Stop Script
echo "🛑 Stopping Bike Rental System..."

# Kill processes by PID if files exist
if [ -f server.pid ]; then
    SERVER_PID=$(cat server.pid)
    kill $SERVER_PID 2>/dev/null || true
    rm server.pid
    echo "🖥️  Server stopped (PID: $SERVER_PID)"
fi

if [ -f client.pid ]; then
    CLIENT_PID=$(cat client.pid)
    kill $CLIENT_PID 2>/dev/null || true
    rm client.pid
    echo "🌐 Client stopped (PID: $CLIENT_PID)"
fi

# Kill any remaining processes on the ports
lsof -ti:5001 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

echo "✅ All processes stopped!"
