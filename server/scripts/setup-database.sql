-- ONGC Internship ATS Database Setup
-- ===================================

USE ongc_auth;

-- Drop tables in correct order to handle foreign key constraints
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;

-- Create users table with snake_case column names
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'hr_manager', 'viewer') NOT NULL DEFAULT 'viewer',
    department VARCHAR(255),
    employee_id VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    password_reset_token VARCHAR(255),
    password_reset_expires DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_employee_id ON users(employee_id);

-- Create sessions table
CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default users with bcrypt hashed passwords (password: 'password')
INSERT INTO users (email, password, name, role, department, employee_id, is_active) VALUES
('hr@ongc.co.in', '$2a$10$/ZASoXonEJeSboz4.fnVMed6i2OkM8FlNbzKZ8gyYWJdHXUE0Leb.', 'HR Manager', 'hr_manager', 'Human Resources', 'EMP001', TRUE),
('admin@ongc.co.in', '$2a$10$/ZASoXonEJeSboz4.fnVMed6i2OkM8FlNbzKZ8gyYWJdHXUE0Leb.', 'System Administrator', 'admin', 'IT', 'EMP002', TRUE),
('viewer@ongc.co.in', '$2a$10$/ZASoXonEJeSboz4.fnVMed6i2OkM8FlNbzKZ8gyYWJdHXUE0Leb.', 'Data Viewer', 'viewer', 'Analytics', 'EMP003', TRUE);

-- Show the created tables
SELECT 'Users table created successfully' as status;
SELECT COUNT(*) as user_count FROM users; 