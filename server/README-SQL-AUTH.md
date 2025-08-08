# SQL Authentication Setup for ONGC Internship ATS

This document explains how to set up SQL database authentication for the ONGC Internship ATS while keeping MongoDB for applicant data.

## Architecture Overview

- **SQL Database (MySQL)**: Handles user authentication and authorization
- **MongoDB**: Handles applicant data and file processing
- **Frontend**: React application with authentication context

## Prerequisites

1. **MySQL Server** (version 5.7 or higher)
2. **Node.js** (version 14 or higher)
3. **npm** or **yarn**

## Installation Steps

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Set Up MySQL Database

#### Option A: Using the setup script
```bash
# Create database
mysql -u root -p
CREATE DATABASE ongc_auth_db;
EXIT;

# Run setup script
mysql -u root -p ongc_auth_db < scripts/setup-database.sql
```

#### Option B: Manual setup
```sql
-- Connect to MySQL and run:
CREATE DATABASE ongc_auth_db;
USE ongc_auth_db;

-- The table will be created automatically by Sequelize
```

### 3. Configure Environment Variables

Copy the example environment file:
```bash
cp env.example .env
```

Edit `.env` with your database credentials:
```env
# SQL Database Configuration
SQL_HOST=localhost
SQL_PORT=3306
SQL_DATABASE=ongc_auth_db
SQL_USER=root
SQL_PASSWORD=your_mysql_password

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# MongoDB (for applicant data)
MONGODB_URI=mongodb://localhost:27017/ongc-internship
```

### 4. Start the Server

```bash
npm run dev
```

## Default Users

The system creates these default users automatically:

| Email | Password | Role | Department |
|-------|----------|------|------------|
| hr@ongc.co.in | password123 | HR Manager | Human Resources |
| admin@ongc.co.in | admin123 | Admin | IT |
| viewer@ongc.co.in | viewer123 | Viewer | HR |

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/register` - Register new user (admin only)
- `GET /api/auth/users` - Get all users (admin only)
- `PUT /api/auth/users/:id/toggle-status` - Toggle user status (admin only)

### Health Check

- `GET /api/health` - Server health status

## Database Schema

### Users Table (SQL)

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('hr_manager', 'admin', 'viewer') DEFAULT 'hr_manager',
  department VARCHAR(255),
  employee_id VARCHAR(50) UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login DATETIME,
  password_reset_token VARCHAR(255),
  password_reset_expires DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Security Features

1. **Password Hashing**: Uses bcrypt with salt rounds of 10
2. **JWT Authentication**: Secure token-based authentication
3. **Role-based Access Control**: Different permissions for different roles
4. **Account Status**: Users can be activated/deactivated
5. **Password Reset**: Token-based password reset functionality

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL service is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **Authentication Errors**
   - Verify JWT_SECRET is set
   - Check user exists in database
   - Ensure user is active

3. **Permission Denied**
   - Check user role has required permissions
   - Verify JWT token is valid

### Logs

The server provides detailed logging:
- SQL connection status
- Authentication attempts
- Database operations
- Error details

## Development

### Adding New Users

```javascript
const { createUser } = require('./utils/authHelpers');

await createUser({
  email: 'newuser@ongc.co.in',
  password: 'password123',
  name: 'New User',
  role: 'hr_manager',
  department: 'HR',
  employeeId: 'HR003'
});
```

### Testing Authentication

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hr@ongc.co.in","password":"password123"}'

# Verify token
curl -X GET http://localhost:3001/api/auth/verify \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Production Deployment

1. **Environment Variables**: Set all required environment variables
2. **Database Security**: Use strong passwords and restrict database access
3. **JWT Secret**: Use a strong, unique JWT secret
4. **HTTPS**: Enable HTTPS in production
5. **Rate Limiting**: Implement rate limiting for authentication endpoints
6. **Logging**: Set up proper logging and monitoring

## Support

For issues related to SQL authentication, check:
1. Database connection logs
2. Authentication endpoint responses
3. JWT token validity
4. User account status 