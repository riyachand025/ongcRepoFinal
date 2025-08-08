#!/bin/bash

echo "🚀 ONGC Internship ATS - Deployment Script"
echo "=========================================="

# Check if .env file exists
if [ ! -f "server/.env" ]; then
    echo "📝 Creating .env file from template..."
    cp server/env.example server/.env
    echo "✅ .env file created. Please update it with your configuration."
    echo "⚠️  IMPORTANT: Update server/.env with your database and email credentials before continuing."
    read -p "Press Enter after updating .env file..."
fi

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install

# Setup database
echo "🗄️  Setting up database..."
npm run setup-db

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../Frontend
npm install

# Build frontend
echo "🔨 Building frontend..."
npm run build

# Start services
echo "🚀 Starting services..."
cd ..

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "🐳 Using Docker Compose for deployment..."
    docker-compose up -d
    echo "✅ Services started with Docker Compose"
    echo "🌐 Frontend: http://localhost:80"
    echo "🔧 Backend: http://localhost:3001"
else
    echo "📝 Docker not found. Starting services manually..."
    echo "🚀 Starting backend server..."
    cd server
    npm start &
    BACKEND_PID=$!
    
    echo "🚀 Starting frontend server..."
    cd ../Frontend
    npm run dev &
    FRONTEND_PID=$!
    
    echo "✅ Services started manually"
    echo "🌐 Frontend: http://localhost:5173"
    echo "🔧 Backend: http://localhost:3001"
    echo "📝 To stop services: kill $BACKEND_PID $FRONTEND_PID"
fi

echo ""
echo "🎉 Deployment complete!"
echo "📊 Health check: http://localhost:3001/api/health"
echo "🔐 Login: http://localhost:80 (or :5173 if running manually)" 