const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

console.log('👤 [MONGO_USER_MODEL] Initializing MongoDB User model');

// MongoDB User Schema for Authentication
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: 'Please enter a valid email'
    }
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['hr_manager', 'admin', 'viewer'],
    default: 'hr_manager',
    required: true
  },
  department: {
    type: String,
    default: 'Human Resources'
  },
  employeeId: {
    type: String,
    unique: true,
    sparse: true // Allows null values while maintaining uniqueness
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpires: {
    type: Date
  }
}, {
  timestamps: true // Automatically creates createdAt and updatedAt fields
});

console.log('✅ [MONGO_USER_MODEL] User schema defined');

// Hash password before saving
userSchema.pre('save', async function(next) {
  console.log('🔐 [MONGO_USER_HOOK] pre-save hook triggered');
  console.log('👤 [MONGO_USER_HOOK] Processing user:', this.email);
  
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    console.log('🔐 [MONGO_USER_HOOK] Password not modified, skipping hash');
    return next();
  }
  
  console.log('🔐 [MONGO_USER_HOOK] Password modified, hashing...');
  this.password = await bcrypt.hash(this.password, 10);
  console.log('✅ [MONGO_USER_HOOK] Password hashed successfully');
  next();
});

// Hash password before updating
userSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  
  if (update && update.password) {
    console.log('🔐 [MONGO_USER_HOOK] pre-update hook - password changed');
    console.log('🔐 [MONGO_USER_HOOK] Re-hashing password...');
    update.password = await bcrypt.hash(update.password, 10);
    console.log('✅ [MONGO_USER_HOOK] Password re-hashed successfully');
  }
  
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  console.log('🔐 [MONGO_USER_METHOD] comparePassword called');
  console.log('👤 [MONGO_USER_METHOD] User:', this.email);
  console.log('🔐 [MONGO_USER_METHOD] Candidate password:', `"${candidatePassword}"`);
  console.log('🔐 [MONGO_USER_METHOD] Candidate password length:', candidatePassword.length);
  console.log('🔐 [MONGO_USER_METHOD] Stored hash:', this.password);
  console.log('🔐 [MONGO_USER_METHOD] Stored hash length:', this.password ? this.password.length : 0);
  console.log('🔐 [MONGO_USER_METHOD] Comparing passwords...');
  
  const result = await bcrypt.compare(candidatePassword, this.password);
  console.log('🔐 [MONGO_USER_METHOD] Password comparison result:', result ? 'Match' : 'No match');
  
  return result;
};

// Instance method to get user without password
userSchema.methods.toJSON = function() {
  console.log('📤 [MONGO_USER_METHOD] toJSON called');
  console.log('👤 [MONGO_USER_METHOD] User:', this.email);
  
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  
  console.log('📤 [MONGO_USER_METHOD] Returning user data (sensitive fields excluded)');
  return userObject;
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  console.log('🔍 [MONGO_USER_METHOD] findByEmail called');
  console.log('📧 [MONGO_USER_METHOD] Searching for email:', email);
  
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find by ID
userSchema.statics.findById = function(id) {
  console.log('🔍 [MONGO_USER_METHOD] findById called');
  console.log('🆔 [MONGO_USER_METHOD] Searching for ID:', id);
  
  return this.findOne({ _id: id });
};

// Create the model
const MongoUser = mongoose.model('User', userSchema);

console.log('✅ [MONGO_USER_MODEL] MongoDB User model created');

module.exports = MongoUser;