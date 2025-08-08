# ONGC Internship Application System - Server

A unified backend server for the ONGC Internship Application Tracking System.

## Features

- **Authentication**: SQL-based user management with JWT tokens
- **Applicant Management**: MongoDB-based applicant data storage
- **Email Notifications**: SMTP email sending with PDF attachments
- **File Upload**: Excel/CSV file processing
- **Security**: Rate limiting, CORS, Helmet security headers
- **Logging**: Comprehensive request and error logging

## Quick Start

### 1. Environment Setup

Copy the example environment file and configure it:

```bash
cp env.example .env
```

Edit `.env` with your configuration:
- Database credentials
- Email SMTP settings
- JWT secret
- CORS origins

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

#### SQL Database (Authentication)
```bash
# Create database and tables
npm run setup-db
```

#### MongoDB (Applicant Data)
```bash
# MongoDB should be running on localhost:27017
# Database: ongc-internship
```

### 4. Start Server

```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify token
- `GET /api/auth/profile` - Get user profile

### Applicants
- `POST /api/applicants` - Create applicant
- `GET /api/applicants` - List applicants
- `PUT /api/applicants/:id` - Update applicant
- `DELETE /api/applicants/:id` - Delete applicant

### Email
- `POST /api/send-email` - Send single email
- `POST /api/send-bulk-email` - Send bulk emails

### File Upload
- `POST /api/upload` - Upload Excel/CSV files

### Health Check
- `GET /api/health` - Server health status

## Default Users

- **HR Manager**: `hr@ongc.co.in` / `password123`
- **Admin**: `admin@ongc.co.in` / `admin123`
- **Viewer**: `viewer@ongc.co.in` / `viewer123`

## Email Verification

The system uses real SMTP email sending (no mock mode). To verify emails:

1. Configure SMTP settings in `.env`
2. Test email sending via API endpoints
3. Check server logs for email delivery status

## Security Features

- Rate limiting on all endpoints
- Stricter rate limiting on auth endpoints
- Helmet security headers
- CORS protection
- Input validation and sanitization
- File upload restrictions

## Logging

- Request logs: `./logs/app.log`
- Error logs: `./logs/error.log`
- Console output for development

## Docker Support

```bash
# Build image
docker build -t ongc-server .

# Run container
docker run -p 3001:3001 --env-file .env ongc-server
``` 