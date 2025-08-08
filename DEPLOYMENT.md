# ONGC Internship ATS - Deployment Guide

This guide covers deploying the ONGC Internship ATS application in production environments.

## Architecture Overview

The application uses a microservices architecture with:

- **Frontend**: React application (Vite)
- **Backend**: Node.js/Express API
- **SQL Database**: MySQL for user authentication
- **NoSQL Database**: MongoDB for applicant data
- **Reverse Proxy**: Nginx with SSL termination
- **Containerization**: Docker & Docker Compose

## Prerequisites

### System Requirements

- **OS**: Linux (Ubuntu 20.04+ recommended)
- **RAM**: Minimum 4GB, 8GB recommended
- **Storage**: 20GB+ available space
- **CPU**: 2+ cores

### Software Requirements

- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **Git**: Latest version

### Installation

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
```

## Quick Deployment

### 1. Clone Repository

```bash
git clone <repository-url>
cd ongcfinal
```

### 2. Configure Environment

```bash
# Copy production environment template
cp server/env.production .env

# Edit environment variables
nano .env
```

**Required Environment Variables:**

```env
# Security
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters
SQL_PASSWORD=your-strong-mysql-password

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Database Configuration
MYSQL_ROOT_PASSWORD=your-mysql-root-password
SQL_DATABASE=ongc_auth_prod
SQL_USER=ongc_user
SQL_PASSWORD=your-strong-password

# Optional: SSL Configuration
SSL_KEY_PATH=/path/to/ssl/private.key
SSL_CERT_PATH=/path/to/ssl/certificate.crt
```

### 3. Deploy Application

```bash
# Make deployment script executable
chmod +x deploy.sh

# Deploy application
./deploy.sh deploy
```

### 4. Verify Deployment

```bash
# Check service status
./deploy.sh status

# View logs
./deploy.sh logs

# Test health endpoint
curl http://localhost:3001/api/health
```

## Manual Deployment

### 1. Database Setup

#### MySQL Setup

```bash
# Create MySQL container
docker run -d \
  --name ongc-mysql \
  --network ongc-network \
  -e MYSQL_ROOT_PASSWORD=your-root-password \
  -e MYSQL_DATABASE=ongc_auth_prod \
  -e MYSQL_USER=ongc_user \
  -e MYSQL_PASSWORD=your-password \
  -v mysql_data:/var/lib/mysql \
  -p 3306:3306 \
  mysql:8.0

# Initialize database
docker exec -i ongc-mysql mysql -u root -p < server/scripts/setup-database.sql
```

#### MongoDB Setup

```bash
# Create MongoDB container
docker run -d \
  --name ongc-mongodb \
  --network ongc-network \
  -e MONGO_INITDB_DATABASE=ongc-internship-prod \
  -v mongodb_data:/data/db \
  -p 27017:27017 \
  mongo:6.0
```

### 2. Backend Deployment

```bash
# Build server image
cd server
docker build -t ongc-server .

# Run server container
docker run -d \
  --name ongc-server \
  --network ongc-network \
  -p 3001:3001 \
  -v server_logs:/app/logs \
  -v server_uploads:/app/uploads \
  --env-file .env \
  ongc-server
```

### 3. Frontend Deployment

```bash
# Build frontend image
cd Frontend
docker build -t ongc-frontend .

# Run frontend container
docker run -d \
  --name ongc-frontend \
  --network ongc-network \
  -p 3000:3000 \
  -e VITE_API_URL=http://localhost:3001 \
  ongc-frontend
```

## SSL/HTTPS Configuration

### 1. Generate SSL Certificate

```bash
# Create SSL directory
mkdir -p ssl

# Generate self-signed certificate (for testing)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/private.key \
  -out ssl/certificate.crt \
  -subj "/C=IN/ST=State/L=City/O=ONGC/CN=your-domain.com"
```

### 2. Update Environment

```env
# Add SSL paths to .env
SSL_KEY_PATH=/path/to/ssl/private.key
SSL_CERT_PATH=/path/to/ssl/certificate.crt
```

### 3. Deploy with SSL

```bash
# Deploy with Nginx reverse proxy
docker-compose up -d nginx
```

## Security Configuration

### 1. Firewall Setup

```bash
# Allow necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3001/tcp  # API (if exposed)

# Enable firewall
sudo ufw enable
```

### 2. Database Security

```sql
-- Create dedicated user for application
CREATE USER 'ongc_user'@'%' IDENTIFIED BY 'strong-password';
GRANT SELECT, INSERT, UPDATE, DELETE ON ongc_auth_prod.* TO 'ongc_user'@'%';
FLUSH PRIVILEGES;
```

### 3. Environment Security

```bash
# Set proper file permissions
chmod 600 .env
chmod 600 ssl/*.key

# Create non-root user for application
sudo useradd -r -s /bin/false ongc
sudo chown -R ongc:ongc /opt/ongc
```

## Monitoring & Logging

### 1. Application Logs

```bash
# View application logs
docker-compose logs -f server

# View specific service logs
docker-compose logs -f mysql
docker-compose logs -f mongodb
```

### 2. System Monitoring

```bash
# Monitor resource usage
docker stats

# Check disk usage
df -h

# Monitor memory usage
free -h
```

### 3. Health Checks

```bash
# API health check
curl http://localhost:3001/api/health

# Database health checks
docker-compose exec mysql mysqladmin ping
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

## Backup & Recovery

### 1. Automated Backup

```bash
# Create backup
./deploy.sh backup

# Schedule daily backups
crontab -e
# Add: 0 2 * * * /path/to/ongcfinal/deploy.sh backup
```

### 2. Manual Backup

```bash
# Backup MySQL
docker-compose exec mysql mysqldump -u root -p --all-databases > backup.sql

# Backup MongoDB
docker-compose exec mongodb mongodump --out /tmp/backup
docker cp ongc-mongodb:/tmp/backup ./mongodb_backup

# Backup uploads
tar -czf uploads_backup.tar.gz uploads/
```

### 3. Recovery

```bash
# Restore from backup
./deploy.sh rollback backup_20231201_143022
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed

```bash
# Check database containers
docker-compose ps

# Check database logs
docker-compose logs mysql
docker-compose logs mongodb

# Test database connectivity
docker-compose exec mysql mysql -u root -p
```

#### 2. Application Won't Start

```bash
# Check application logs
docker-compose logs server

# Check environment variables
docker-compose exec server env | grep -E "(SQL_|MONGODB_|JWT_)"

# Restart services
docker-compose restart
```

#### 3. SSL Certificate Issues

```bash
# Check certificate validity
openssl x509 -in ssl/certificate.crt -text -noout

# Test SSL connection
curl -k https://localhost

# Check Nginx configuration
docker-compose exec nginx nginx -t
```

### Performance Issues

#### 1. High Memory Usage

```bash
# Check memory usage
docker stats

# Optimize Node.js memory
# Add to server Dockerfile:
ENV NODE_OPTIONS="--max-old-space-size=2048"
```

#### 2. Slow Database Queries

```bash
# Enable MySQL slow query log
docker-compose exec mysql mysql -e "SET GLOBAL slow_query_log = 'ON';"

# Check MongoDB performance
docker-compose exec mongodb mongosh --eval "db.stats()"
```

## Production Checklist

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Firewall configured
- [ ] Database backups scheduled
- [ ] Monitoring setup
- [ ] Log rotation configured
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] Health checks implemented
- [ ] Graceful shutdown configured

## Support

For deployment issues:

1. Check application logs: `./deploy.sh logs`
2. Verify environment variables: `docker-compose exec server env`
3. Test database connectivity
4. Check system resources: `docker stats`
5. Review security configuration

## Maintenance

### Regular Maintenance Tasks

1. **Weekly**: Check logs for errors
2. **Monthly**: Update dependencies
3. **Quarterly**: Security audit
4. **Annually**: SSL certificate renewal

### Update Procedure

```bash
# Pull latest changes
git pull origin main

# Rebuild and redeploy
./deploy.sh deploy

# Verify deployment
./deploy.sh status
``` 