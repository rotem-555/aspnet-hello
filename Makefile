# E-Commerce Application Docker Commands

.PHONY: help build up down logs clean dev-up dev-down

# Default target
help:
	@echo "Available commands:"
	@echo "  build     - Build all Docker images"
	@echo "  up        - Start all services in production mode"
	@echo "  down      - Stop all services"
	@echo "  logs      - Show logs for all services"
	@echo "  clean     - Remove all containers, networks, and volumes"
	@echo "  dev-up    - Start development services (MySQL only)"
	@echo "  dev-down  - Stop development services"
	@echo "  restart   - Restart all services"
	@echo "  status    - Show status of all services"

# Production commands
build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

restart: down up

logs:
	docker compose logs -f

status:
	docker compose ps

# Development commands
dev-up:
	docker compose -f docker-compose.dev.yml up -d

dev-down:
	docker compose -f docker-compose.dev.yml down

# Cleanup commands
clean:
	docker compose down -v --remove-orphans
	docker compose -f docker-compose.dev.yml down -v --remove-orphans
	docker system prune -f

# Individual service commands
backend-logs:
	docker compose logs -f backend

frontend-logs:
	docker compose logs -f frontend

mysql-logs:
	docker compose logs -f mysql

# Database commands
db-shell:
	docker compose exec mysql mysql -u ecommerce -pecommerce123 ECommerceDB

db-backup:
	docker compose exec mysql mysqldump -u ecommerce -pecommerce123 ECommerceDB > backup_$(shell date +%Y%m%d_%H%M%S).sql

# Health checks
health:
	@echo "Checking service health..."
	@curl -f http://localhost:5000/health && echo "Backend: OK" || echo "Backend: FAIL"
	@curl -f http://localhost:4200/health && echo "Frontend: OK" || echo "Frontend: FAIL"
