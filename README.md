# ONGC Internship Application Tracking System

A complete web application for managing internship applications at ONGC Dehradun.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MySQL (for authentication)
- MongoDB (for applicant data)
- Docker (optional, for containerized deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ongcfinal
   ```

2. **Run the deployment script**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

3. **Configure environment**
   - Edit `server/.env` with your database and email credentials
   - Update CORS origins if needed

4. **Access the application**
   - Frontend: http://localhost:80 (or :5173)
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/api/health

## 📋 Features

### Authentication & User Management
- Role-based access control (HR Manager, Admin, Viewer)
- JWT token authentication
- SQL-based user storage

### Applicant Management
- Excel/CSV file upload and processing
- Applicant data storage in MongoDB
- Search and filter capabilities
- Bulk operations

### Email System
- Automated email notifications
- PDF form generation and attachment
- Bulk email sending
- Email templates

### Dashboard & Analytics
- Real-time applicant statistics
- Approval workflow management
- Shortlisting and approval tracking
- Data export capabilities

## 🔐 Default Users

- **HR Manager**: `hr@ongc.co.in` / `password123`
- **Admin**: `admin@ongc.co.in` / `admin123`
- **Viewer**: `viewer@ongc.co.in` / `viewer123`

## 📁 Project Structure

```
ongcfinal/
├── Frontend/          # React TypeScript frontend
├── server/            # Node.js Express backend
├── deploy.sh          # Deployment script
├── docker-compose.yml # Docker configuration
└── README.md         # This file
```

## 🛠️ Development

### Backend (Node.js/Express)
```bash
cd server
npm install
npm run dev
```

### Frontend (React/TypeScript)
```bash
cd Frontend
npm install
npm run dev
```

## 📧 Email Verification

The system uses real SMTP email sending. To verify emails:

1. Configure SMTP settings in `server/.env`
2. Test via API: `POST /api/send-email`
3. Check server logs for delivery status

## 🔒 Security Features

- Rate limiting on all endpoints
- Helmet security headers
- CORS protection
- Input validation
- File upload restrictions
- JWT token authentication

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify token
- `GET /api/auth/profile` - Get user profile

### Applicants
- `GET /api/applicants` - List applicants
- `POST /api/applicants` - Create applicant
- `PUT /api/applicants/:id` - Update applicant
- `DELETE /api/applicants/:id` - Delete applicant

### Email
- `POST /api/send-email` - Send single email
- `POST /api/send-bulk-email` - Send bulk emails

### File Upload
- `POST /api/upload` - Upload Excel/CSV files

## 🐳 Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📝 Environment Configuration

Copy `server/env.example` to `server/.env` and configure:

```env
# Database
SQL_HOST=localhost
SQL_DATABASE=ongc_auth
SQL_USER=ongc_user
SQL_PASSWORD=your_password

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Security
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173,https://your-domain.com
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Ensure MySQL and MongoDB are running
   - Check database credentials in `.env`

2. **Email Not Sending**
   - Verify SMTP settings in `.env`
   - Check Gmail app password configuration

3. **Frontend Not Loading**
   - Check if backend is running on port 3001
   - Verify CORS settings

4. **File Upload Fails**
   - Check file size (max 10MB)
   - Ensure file is Excel or CSV format

## 📞 Support

For issues or questions:
1. Check the logs in `server/logs/`
2. Verify environment configuration
3. Test individual components

## 📄 License

This project is developed for ONGC Dehradun internal use. 