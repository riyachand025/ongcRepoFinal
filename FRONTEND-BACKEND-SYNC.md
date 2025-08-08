# Frontend-Backend Sync Guide

## 🔗 **Current Configuration**

### Backend (Port 3001)
- **URL**: `http://localhost:3001`
- **API Base**: `/api`
- **Database**: MySQL (ongc_auth)
- **Authentication**: JWT Tokens

### Frontend (Port 5173)
- **URL**: `http://localhost:5173`
- **Proxy**: `/api` → `http://localhost:3001`
- **Auth Storage**: localStorage

## ✅ **Sync Status**

### 1. **API Configuration** ✅
- Frontend uses `/api` base URL
- Vite proxy forwards to `http://localhost:3001`
- CORS configured for frontend domain

### 2. **Authentication Flow** ✅
- Login: `POST /api/auth/login`
- Token storage: `localStorage['ongc-auth-token']`
- User storage: `localStorage['ongc-auth-user']`
- Token verification: `GET /api/auth/verify`

### 3. **Database Connection** ✅
- MySQL connected and synchronized
- User passwords updated and working
- Schema matches Sequelize model

### 4. **Email System** ✅
- SMTP configured and working
- Test endpoint: `POST /api/test-email`

## 🚀 **Quick Start Commands**

### Start Backend:
```bash
cd server
npm start
```

### Start Frontend:
```bash
cd Frontend
npm run dev
```

### Test Connection:
```bash
cd server
node test-connection.js
```

## 🔐 **Default Users**

| Email | Password | Role |
|-------|----------|------|
| admin@ongc.co.in | password123 | admin |
| hr@ongc.co.in | password123 | hr_manager |
| viewer@ongc.co.in | password123 | viewer |

## 📡 **API Endpoints**

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification
- `GET /api/auth/profile` - User profile
- `POST /api/auth/register` - User registration

### Email
- `POST /api/test-email` - Send test email

### Health
- `GET /api/health` - Server health check

## 🔧 **Troubleshooting**

### If Frontend Can't Connect to Backend:
1. Check if backend is running on port 3001
2. Verify Vite proxy configuration
3. Check browser console for CORS errors
4. Test with curl: `curl http://localhost:3001/api/health`

### If Login Fails:
1. Verify database connection
2. Check password hashes are updated
3. Test with curl: `curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email": "admin@ongc.co.in", "password": "password123"}'`

### If Email Doesn't Work:
1. Check SMTP configuration in .env
2. Test email endpoint directly
3. Verify email credentials

## 📝 **Environment Variables**

### Backend (.env):
```
SQL_DATABASE=ongc_auth
SQL_USER=ongc_user
SQL_PASSWORD=6574839201Ongc@321#
SQL_HOST=localhost
SQL_PORT=3306
JWT_SECRET=your-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Frontend:
- No environment variables needed
- Uses proxy configuration in vite.config.ts

## 🎯 **Next Steps**

1. **Start both servers**
2. **Test login with default users**
3. **Verify email functionality**
4. **Test protected routes**
5. **Deploy to production**

## 📊 **Monitoring**

- Backend logs: Check server console
- Frontend logs: Check browser console
- Database: `mysql -u ongc_user -p6574839201Ongc@321# ongc_auth`
- Network: Browser DevTools Network tab 