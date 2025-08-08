#!/bin/bash

echo "🗄️  Setting up MySQL database and user..."
echo "=========================================="

# Load environment variables from .env file
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Loaded configuration from .env file"
else
    echo "❌ .env file not found. Please create it first."
    exit 1
fi

# MySQL configuration from .env file
DB_NAME="${SQL_DATABASE:-ongc_auth}"
DB_USER="${SQL_USER:-ongc_user}"
DB_PASSWORD="${SQL_PASSWORD:-ongc123}"

echo "📝 Using configuration:"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo "   Password: $DB_PASSWORD"

# Function to execute MySQL command with sudo
mysql_exec() {
    sudo mysql -e "$1"
}

# Function to execute MySQL command as user
mysql_user_exec() {
    mysql -u "$DB_USER" -p"$DB_PASSWORD" -e "$1"
}

# Check if MySQL is running
if ! sudo mysql -e "SELECT 1;" > /dev/null 2>&1; then
    echo "❌ MySQL is not running. Please start MySQL first:"
    echo "   sudo systemctl start mysql"
    exit 1
fi

echo "✅ MySQL is running"

# Drop existing user if exists
echo "🗑️  Dropping existing user '$DB_USER' if exists..."
mysql_exec "DROP USER IF EXISTS '$DB_USER'@'localhost';"
if [ $? -eq 0 ]; then
    echo "✅ Existing user dropped"
else
    echo "⚠️  Could not drop existing user (may not exist)"
fi

# Create database
echo "📊 Creating database '$DB_NAME'..."
mysql_exec "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
if [ $? -eq 0 ]; then
    echo "✅ Database '$DB_NAME' created/verified"
else
    echo "❌ Failed to create database"
    exit 1
fi

# Create new user with password from .env
echo "👤 Creating new user '$DB_USER'..."
mysql_exec "CREATE USER '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';"
if [ $? -eq 0 ]; then
    echo "✅ User '$DB_USER' created successfully"
else
    echo "❌ Failed to create user"
    echo "💡 Password may not meet MySQL policy requirements"
    echo "   Try updating SQL_PASSWORD in .env file"
    exit 1
fi

# Grant privileges
echo "🔐 Granting privileges to '$DB_USER' on '$DB_NAME'..."
mysql_exec "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';"
if [ $? -eq 0 ]; then
    echo "✅ Privileges granted"
else
    echo "❌ Failed to grant privileges"
    exit 1
fi

# Flush privileges
echo "🔄 Flushing privileges..."
mysql_exec "FLUSH PRIVILEGES;"
if [ $? -eq 0 ]; then
    echo "✅ Privileges flushed"
else
    echo "❌ Failed to flush privileges"
    exit 1
fi

# Test connection
echo "🧪 Testing database connection..."
if mysql -u "$DB_USER" -p"$DB_PASSWORD" -e "USE $DB_NAME; SELECT 1;" > /dev/null 2>&1; then
    echo "✅ Database connection test successful"
else
    echo "❌ Database connection test failed"
    echo "💡 Check your .env file credentials"
    exit 1
fi

# Setup database schema
echo "📋 Setting up database schema..."
if mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$(dirname "$0")/setup-database.sql"; then
    echo "✅ Database schema setup completed"
else
    echo "❌ Failed to setup database schema"
    exit 1
fi

echo ""
echo "🎉 MySQL setup completed successfully!"
echo "📝 Database: $DB_NAME"
echo "👤 User: $DB_USER"
echo "🔐 Password: $DB_PASSWORD"
echo ""
echo "✅ Server is ready to start with these credentials" 