# Docker Deployment Guide

This guide explains how to run the E-Commerce application using Docker containers.

## 🐳 Docker Architecture

The application consists of the following services:

- **Frontend**: Angular 10 app served by Nginx
- **Backend**: .NET 5 Web API
- **Database**: MySQL 8.0
- **Cache**: Redis 6 (optional)

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
./docker-setup.sh
```

### Option 2: Manual Setup

```bash
# Build all images
docker-compose build

# Start all services
docker-compose up -d

# Check service status
docker-compose ps
```

## 📋 Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:4200 | Angular application |
| Backend API | http://localhost:5000 | .NET Web API |
| API Documentation | http://localhost:5000/swagger | Swagger UI |
| MySQL | localhost:3306 | Database server |
| Redis | localhost:6379 | Cache server |

## 🔧 Available Commands

### Using Makefile (Recommended)

```bash
# Show all available commands
make help

# Build all images
make build

# Start all services
make up

# Stop all services
make down

# View logs
make logs

# Check service health
make health

# Clean up everything
make clean
```

### Using Docker Compose Directly

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Scale services
docker-compose up -d --scale backend=2
```

## 🗄️ Database Management

### Access MySQL Database

```bash
# Connect to MySQL shell
make db-shell

# Or using docker-compose
docker-compose exec mysql mysql -u ecommerce -pecommerce123 ECommerceDB
```

### Database Backup

```bash
# Create backup
make db-backup

# Manual backup
docker-compose exec mysql mysqldump -u ecommerce -pecommerce123 ECommerceDB > backup.sql
```

### Database Restore

```bash
# Restore from backup
docker-compose exec -T mysql mysql -u ecommerce -pecommerce123 ECommerceDB < backup.sql
```

## 🔍 Monitoring and Debugging

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Health Checks

```bash
# Check all services
make health

# Manual health checks
curl http://localhost:5000/health  # Backend
curl http://localhost:4200/health  # Frontend
```

### Service Status

```bash
# Show running containers
docker-compose ps

# Show resource usage
docker stats
```

## 🛠️ Development Mode

For development, you can run only the database services and run the applications locally:

```bash
# Start only MySQL and Redis
make dev-up

# Stop development services
make dev-down
```

Then run the applications locally:
```bash
# Backend
cd HelloWeb
dotnet run

# Frontend
cd ecommerce-frontend
npm start
```

## 🔧 Configuration

### Environment Variables

The application uses the following environment variables:

#### Backend (.NET)
- `ASPNETCORE_ENVIRONMENT`: Set to `Production` in Docker
- `ConnectionStrings__DefaultConnection`: MySQL connection string
- `Jwt__Key`: JWT signing key
- `Jwt__Issuer`: JWT issuer
- `Jwt__Audience`: JWT audience

#### Database (MySQL)
- `MYSQL_ROOT_PASSWORD`: Root password
- `MYSQL_DATABASE`: Database name
- `MYSQL_USER`: Application user
- `MYSQL_PASSWORD`: Application password

### Custom Configuration

To modify configuration:

1. **Backend**: Edit `HelloWeb/appsettings.Production.json`
2. **Frontend**: Edit `ecommerce-frontend/src/environments/environment.prod.ts`
3. **Database**: Edit `mysql-init/01-init.sql`

## 📁 Volume Mounts

The following volumes are created:

- `mysql_data`: MySQL data persistence
- `redis_data`: Redis data persistence

## 🌐 Network Configuration

All services run on the `ecommerce-network` bridge network, allowing them to communicate using service names:

- Backend connects to MySQL using hostname `mysql`
- Frontend connects to Backend using hostname `backend`

## 🔒 Security Considerations

### Production Deployment

For production deployment, consider:

1. **Change default passwords** in `docker-compose.yml`
2. **Use secrets management** for sensitive data
3. **Enable HTTPS** with proper certificates
4. **Configure firewall** rules
5. **Use environment-specific** configuration files

### Example Production Overrides

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  mysql:
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - /secure/mysql-data:/var/lib/mysql

  backend:
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=${DB_CONNECTION_STRING}
      - Jwt__Key=${JWT_SECRET_KEY}
```

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in `docker-compose.yml`
2. **Permission issues**: Ensure Docker has proper permissions
3. **Database connection**: Wait for MySQL to fully initialize
4. **Memory issues**: Increase Docker memory limits

### Debug Commands

```bash
# Check container logs
docker-compose logs [service-name]

# Execute commands in container
docker-compose exec [service-name] [command]

# Inspect container
docker inspect [container-name]

# Check network connectivity
docker-compose exec backend ping mysql
```

### Reset Everything

```bash
# Stop and remove everything
make clean

# Rebuild and start
make build
make up
```

## 📊 Performance Optimization

### Resource Limits

Add resource limits to `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

### Scaling

```bash
# Scale backend service
docker-compose up -d --scale backend=3

# Scale with load balancer (requires additional configuration)
```

## 🔄 Updates and Maintenance

### Updating Images

```bash
# Pull latest images
docker-compose pull

# Rebuild with latest changes
docker-compose build --no-cache

# Restart services
docker-compose up -d
```

### Backup Strategy

1. **Database**: Regular automated backups
2. **Application Data**: Volume snapshots
3. **Configuration**: Version control

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [.NET Docker Images](https://hub.docker.com/_/microsoft-dotnet)
- [Angular Docker Guide](https://angular.io/guide/deployment#docker)
- [MySQL Docker Image](https://hub.docker.com/_/mysql)

