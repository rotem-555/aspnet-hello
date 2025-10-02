# E-Commerce Application

A full-stack e-commerce application built with .NET 5 Web API backend and Angular 10 frontend.

## Architecture Overview

### Backend (.NET 5 Web API)
- **Layered Architecture**: Models, Data Access (EF Core), Services, Controllers
- **Database**: MySQL with Entity Framework Core
- **Authentication**: JWT Bearer tokens with role-based authorization
- **API Documentation**: Swagger/OpenAPI

### Frontend (Angular 10)
- **Modular Structure**: Auth, Customer, Admin modules
- **JWT Storage**: localStorage with HTTP interceptors
- **Routing**: Protected routes with guards
- **UI Framework**: Bootstrap 5

## Features

### Authentication & Authorization
- User registration and login
- JWT token-based authentication
- Role-based access control (Admin/Customer)
- Protected routes and API endpoints

### Product Management
- View products (all users)
- Filter products by category
- Admin: Create, update, delete products
- Product details with images

### User Management
- Customer registration
- Admin user management (placeholder)

## Database Schema

### Users Table
- id (Primary Key)
- username (Unique)
- password_hash
- role (Admin/Customer)
- email, first_name, last_name
- created_at, updated_at

### Products Table
- id (Primary Key)
- name, description
- price, stock
- category, image_url
- is_active
- created_at, updated_at


## Setup Instructions

### 🐳 Docker Setup (Recommended)

The easiest way to run the application is using Docker:

```bash
# Quick start with automated setup
./docker-setup.sh

# Or manually
docker compose build
docker compose up -d
```

**Service URLs:**
- Frontend: http://localhost:4200
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/swagger
- MySQL: localhost:3306

For detailed Docker instructions, see [DOCKER.md](DOCKER.md).

### 🛠️ Manual Setup

#### Backend Setup

1. **Install Dependencies**
   ```bash
   cd HelloWeb
   dotnet restore
   ```

2. **Database Setup**
   - Install MySQL server
   - Update connection string in `appsettings.json`
   - Run migrations:
   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

3. **Run the API**
   ```bash
   dotnet run
   ```
   - API will be available at `https://localhost:5001`
   - Swagger documentation at `https://localhost:5001/swagger`

#### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd ecommerce-frontend
   npm install
   ```

2. **Run the Application**
   ```bash
   npm start
   ```
   - Frontend will be available at `http://localhost:4200`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/validate` - Validate JWT token

### Products
- `GET /api/products` - Get all products (with optional category filter)
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/categories` - Get all categories
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/{id}` - Update product (Admin only)
- `DELETE /api/products/{id}` - Delete product (Admin only)

## Default Credentials

- **Admin**: username: `admin`, password: `admin123`
- **Customer**: Register a new account

## Technologies Used

### Backend
- .NET 5
- Entity Framework Core
- MySQL (Pomelo provider)
- JWT Bearer Authentication
- Swagger/OpenAPI
- BCrypt for password hashing

### Frontend
- Angular 10
- TypeScript
- Bootstrap 5
- RxJS
- Angular Router
- Angular Forms (Reactive)

## Project Structure

```
aspnet-hello/
├── HelloWeb/                 # Backend API
│   ├── Controllers/          # API Controllers
│   ├── Data/                # DbContext and migrations
│   ├── DTOs/                # Data Transfer Objects
│   ├── Models/              # Entity models
│   ├── Services/            # Business logic services
│   └── Program.cs, Startup.cs
├── ecommerce-frontend/       # Frontend Angular app
│   ├── src/app/
│   │   ├── admin/           # Admin module
│   │   ├── auth/            # Authentication module
│   │   ├── core/            # Core services and guards
│   │   ├── customer/        # Customer module
│   │   └── shared/          # Shared components
│   └── package.json
└── README.md
```

## Development Notes

- The application uses HTTPS for the API and HTTP for the frontend in development
- CORS is configured to allow the Angular app to communicate with the API
- JWT tokens expire after 24 hours
- Password hashing uses BCrypt with automatic salt generation
- The database is seeded with sample data including an admin user and products
