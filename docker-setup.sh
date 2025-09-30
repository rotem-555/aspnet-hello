#!/bin/bash

# E-Commerce Application Docker Setup Script

set -e

echo "🚀 Setting up E-Commerce Application with Docker..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is available (as plugin)
if ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not available. Please ensure Docker Desktop is installed or install Docker Compose."
    exit 1
fi

print_status "Docker and Docker Compose are available ✓"

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p mysql-init
mkdir -p logs

# Set proper permissions
chmod +x docker-setup.sh

print_status "Building Docker images..."
docker compose build

print_status "Starting services..."
docker compose up -d

print_status "Waiting for services to be ready..."
sleep 30

# Health check
print_status "Performing health checks..."

# Check MySQL
if docker compose exec mysql mysqladmin ping -h localhost --silent; then
    print_success "MySQL is ready ✓"
else
    print_warning "MySQL is not ready yet, please wait..."
fi

# Check Backend
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    print_success "Backend API is ready ✓"
else
    print_warning "Backend API is not ready yet, please wait..."
fi

# Check Frontend
if curl -f http://localhost:4200/health > /dev/null 2>&1; then
    print_success "Frontend is ready ✓"
else
    print_warning "Frontend is not ready yet, please wait..."
fi

echo ""
print_success "🎉 E-Commerce Application is now running!"
echo ""
echo "📋 Service URLs:"
echo "  • Frontend:    http://localhost:4200"
echo "  • Backend API: http://localhost:5000"
echo "  • API Docs:    http://localhost:5000/swagger"
echo "  • MySQL:       localhost:3306"
echo ""
echo "🔑 Default Credentials:"
echo "  • Admin: username=admin, password=admin123"
echo ""
echo "📝 Useful Commands:"
echo "  • View logs:    docker compose logs -f"
echo "  • Stop services: docker compose down"
echo "  • Restart:      docker compose restart"
echo "  • Health check: make health"
echo ""
print_status "Setup complete! 🚀"
