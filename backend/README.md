# HiredMind Backend

AI Powered Hiring Application Backend API built with FastAPI and PostgreSQL.

## Features

-   **Company Registration & Authentication**: Secure company registration and login with JWT tokens
-   **User Management**: User registration and authentication within companies
-   **Database Integration**: PostgreSQL with SQLAlchemy ORM
-   **API Documentation**: Automatic OpenAPI/Swagger documentation
-   **Security**: Password hashing with bcrypt, JWT token authentication

## Prerequisites

-   Python 3.12+
-   PostgreSQL database
-   uv package manager

## Setup

1. **Install dependencies**:

    ```bash
    uv sync
    ```

2. **Environment Configuration**:
   Create a `.env` file in the backend directory:

    ```env
    DATABASE_URL=postgresql://username:password@localhost:5432/hiredmind_db
    SECRET_KEY=your-secret-key-here-make-it-long-and-secure
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    DEBUG=True
    ```

3. **Database Setup**:

    - Create a PostgreSQL database named `hiredmind_db`
    - Update the `DATABASE_URL` in your `.env` file with your database credentials

4. **Run the application**:

    ```bash
    python main.py
    ```

    Or using uvicorn directly:

    ```bash
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ```

## API Endpoints

### Authentication

#### Company Endpoints

-   `POST /auth/company/register` - Register a new company
-   `POST /auth/company/login` - Company login
-   `GET /auth/company/me` - Get current company info (requires authentication)

#### User Endpoints

-   `POST /auth/user/register` - Register a new user
-   `POST /auth/user/login` - User login
-   `GET /auth/user/me` - Get current user info (requires authentication)

#### OAuth2 Compatible

-   `POST /auth/token` - Get access token (OAuth2 compatible)

### General Endpoints

-   `GET /` - API root
-   `GET /health` - Health check
-   `GET /docs` - Interactive API documentation (Swagger UI)

## Database Models

### Company

-   `id`: Primary key
-   `name`: Company name (unique)
-   `email`: Company email (unique)
-   `password_hash`: Hashed password
-   `description`: Company description
-   `industry`: Industry type
-   `size`: Company size
-   `website`: Company website
-   `is_active`: Active status
-   `created_at`: Creation timestamp
-   `updated_at`: Last update timestamp

### User

-   `id`: Primary key
-   `company_id`: Foreign key to Company
-   `email`: User email (unique)
-   `password_hash`: Hashed password
-   `first_name`: First name
-   `last_name`: Last name
-   `role`: User role (admin, user, etc.)
-   `is_active`: Active status
-   `created_at`: Creation timestamp
-   `updated_at`: Last update timestamp

## Security

-   Passwords are hashed using bcrypt
-   JWT tokens for authentication
-   CORS middleware configured
-   Input validation with Pydantic schemas

## Development

### Database Migrations

To set up Alembic for database migrations:

```bash
# Initialize Alembic
alembic init alembic

# Create a migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### Testing

The API includes comprehensive error handling and validation. Test the endpoints using the interactive documentation at `http://localhost:8000/docs`.

## Project Structure

```
backend/
├── api/
│   └── auth.py          # Authentication endpoints
├── alembic/             # Database migrations
├── models.py            # SQLAlchemy models
├── schemas.py           # Pydantic schemas
├── auth.py              # Authentication utilities
├── database.py          # Database configuration
├── config.py            # Application settings
├── main.py              # FastAPI application
├── pyproject.toml       # Dependencies
└── README.md           # This file
```
