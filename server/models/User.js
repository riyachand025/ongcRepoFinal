const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

console.log('👤 [USER_MODEL] Initializing SQL User model');

// SQL User Model for Authentication
const SQLUser = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('hr_manager', 'admin', 'viewer'),
    defaultValue: 'hr_manager',
    allowNull: false
  },
  department: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  employeeId: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  passwordResetToken: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  passwordResetExpires: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true, // This tells Sequelize to use snake_case for database columns
  hooks: {
    beforeCreate: async (user) => {
      console.log('🔐 [USER_HOOK] beforeCreate hook triggered');
      console.log('👤 [USER_HOOK] Creating user:', user.email);
      
      if (user.password) {
        console.log('🔐 [USER_HOOK] Hashing password...');
        user.password = await bcrypt.hash(user.password, 10);
        console.log('✅ [USER_HOOK] Password hashed successfully');
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        console.log('🔐 [USER_HOOK] beforeUpdate hook - password changed');
        console.log('🔐 [USER_HOOK] Re-hashing password...');
        user.password = await bcrypt.hash(user.password, 10);
        console.log('✅ [USER_HOOK] Password re-hashed successfully');
      }
    },
    afterCreate: async (user) => {
      console.log('✅ [USER_HOOK] User created successfully:', {
        id: user.id,
        email: user.email,
        role: user.role
      });
    },
    afterUpdate: async (user) => {
      console.log('✅ [USER_HOOK] User updated successfully:', {
        id: user.id,
        email: user.email,
        role: user.role
      });
    }
  }
});

console.log('✅ [USER_MODEL] User model defined');

// Instance method to check password
SQLUser.prototype.comparePassword = async function(candidatePassword) {
  console.log('🔐 [USER_METHOD] comparePassword called');
  console.log('👤 [USER_METHOD] User:', this.email);
  console.log('🔐 [USER_METHOD] Candidate password:', `"${candidatePassword}"`);
  console.log('🔐 [USER_METHOD] Candidate password length:', candidatePassword.length);
  console.log('🔐 [USER_METHOD] Candidate password bytes:', Buffer.from(candidatePassword).toString('hex'));
  console.log('🔐 [USER_METHOD] Stored hash:', this.password);
  console.log('🔐 [USER_METHOD] Stored hash length:', this.password ? this.password.length : 0);
  console.log('🔐 [USER_METHOD] Comparing passwords...');
  
  // Test the hash directly
  const testResult = await bcrypt.compare('password', this.password);
  console.log('🔐 [USER_METHOD] Direct test with "password":', testResult ? 'Match' : 'No match');
  
  const result = await bcrypt.compare(candidatePassword, this.password);
  console.log('🔐 [USER_METHOD] Password comparison result:', result ? 'Match' : 'No match');
  
  return result;
};

// Instance method to get user without password
SQLUser.prototype.toJSON = function() {
  console.log('📤 [USER_METHOD] toJSON called');
  console.log('👤 [USER_METHOD] User:', this.email);
  
  const values = Object.assign({}, this.get());
  delete values.password;
  
  console.log('📤 [USER_METHOD] Returning user data (password excluded)');
  return values;
};

// Static method to find by email
SQLUser.findByEmail = function(email) {
  console.log('🔍 [USER_METHOD] findByEmail called');
  console.log('📧 [USER_METHOD] Searching for email:', email);
  
  return this.findOne({ where: { email: email.toLowerCase() } });
};

// Static method to find by ID
SQLUser.findById = function(id) {
  console.log('🔍 [USER_METHOD] findById called');
  console.log('🆔 [USER_METHOD] Searching for ID:', id);
  
  return this.findByPk(id);
};

console.log('✅ [USER_MODEL] User model methods defined');

module.exports = SQLUser; 