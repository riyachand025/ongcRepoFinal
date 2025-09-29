const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const MongoUser = require('../models/MongoUser');

// Generate JWT token
const generateToken = (userId, role) => {
  console.log('🎫 [TOKEN] Generating JWT token');
  console.log('👤 [TOKEN] User ID:', userId);
  console.log('🔑 [TOKEN] User role:', role);
  console.log('🔐 [TOKEN] JWT Secret configured:', process.env.JWT_SECRET ? 'Yes' : 'No');
  
  const token = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
  
  console.log('✅ [TOKEN] Token generated successfully');
  console.log('📏 [TOKEN] Token length:', token.length);
  return token;
};

// Verify JWT token
const verifyToken = (token) => {
  console.log('🔍 [TOKEN] Verifying JWT token');
  console.log('📏 [TOKEN] Token length:', token.length);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('✅ [TOKEN] Token verification successful');
    console.log('👤 [TOKEN] Decoded payload:', { userId: decoded.userId, role: decoded.role });
    return decoded;
  } catch (error) {
    console.log('❌ [TOKEN] Token verification failed:', error.message);
    return null;
  }
};

// In-memory users fallback
const inMemoryUsers = [
  {
    id: 1,
    email: 'hr@ongc.co.in',
    password: '$2b$10$NHhbmFCEsnJutk8NubYA.Or4pM34U1ALpT.u6txSu9gB2hM4LWwCa', // password123
    name: 'HR Manager',
    role: 'hr_manager',
    department: 'Human Resources',
    employeeId: 'HR001',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    comparePassword: async function(candidatePassword) {
      const bcrypt = require('bcryptjs');
      return await bcrypt.compare(candidatePassword, this.password);
    },
    toJSON: function() {
      const values = Object.assign({}, this);
      delete values.password;
      delete values.comparePassword;
      return values;
    }
  },
  {
    id: 2,
    email: 'admin@ongc.co.in',
    password: '$2b$10$2usD6VX2KHtnboRzgx4NzOQrvaz8QTGilN038fkt8pSHxAflpgema', // admin123
    name: 'System Administrator',
    role: 'admin',
    department: 'IT',
    employeeId: 'IT001',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    comparePassword: async function(candidatePassword) {
      const bcrypt = require('bcryptjs');
      return await bcrypt.compare(candidatePassword, this.password);
    },
    toJSON: function() {
      const values = Object.assign({}, this);
      delete values.password;
      delete values.comparePassword;
      return values;
    }
  }
];

// Find user by email (MongoDB)
const findUserByEmail = async (email) => {
  console.log('🔍 [USER] Finding user by email:', email);
  
  try {
    const user = await MongoUser.findByEmail(email);
    console.log('👤 [USER] User found in MongoDB:', user ? 'Yes' : 'No');
    
    if (user) {
      console.log('👤 [USER] User details:', {
        id: user._id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        department: user.department
      });
    }
    
    return user;
  } catch (error) {
    console.error('❌ [USER] Error finding user by email in MongoDB:', error);
    return null;
  }
};

// Find user by ID (MongoDB)
const findUserById = async (id) => {
  console.log('🔍 [USER] Finding user by ID:', id);
  
  try {
    const user = await MongoUser.findById(id);
    console.log('👤 [USER] User found in MongoDB:', user ? 'Yes' : 'No');
    
    if (user) {
      console.log('👤 [USER] User details:', {
        id: user._id,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      });
    }
    
    return user;
  } catch (error) {
    console.error('❌ [USER] Error finding user by ID in MongoDB:', error);
    return null;
  }
};

// Create new user (MongoDB)
const createUser = async (userData) => {
  console.log('👤 [USER] Creating new user');
  console.log('📝 [USER] User data:', {
    email: userData.email,
    name: userData.name,
    role: userData.role,
    department: userData.department,
    employeeId: userData.employeeId
  });
  
  try {
    const user = new MongoUser(userData);
    await user.save();
    console.log('✅ [USER] User created successfully:', {
      id: user._id,
      email: user.email,
      role: user.role
    });
    return user;
  } catch (error) {
    console.error('❌ [USER] Error creating user:', error);
    throw error;
  }
};

// Update user (MongoDB)
const updateUser = async (id, updateData) => {
  console.log('📝 [USER] Updating user ID:', id);
  console.log('📝 [USER] Update data:', updateData);
  
  try {
    const user = await MongoUser.findById(id);
    if (!user) {
      console.log('❌ [USER] User not found for update in MongoDB');
      return null;
    }
    
    console.log('👤 [USER] Current user state:', {
      id: user._id,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    
    const updatedUser = await MongoUser.findByIdAndUpdate(id, updateData, { new: true });
    console.log('✅ [USER] User updated successfully in MongoDB');
    console.log('👤 [USER] Updated user state:', {
      id: updatedUser._id,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive
    });
    
    return updatedUser;
  } catch (error) {
    console.error('❌ [USER] Error updating user in MongoDB:', error);
    throw error;
  }
};

// Initialize default users in MongoDB
const initializeMongoUsers = async () => {
  console.log('👥 [INIT] Initializing MongoDB users');
  
  try {
    const defaultUsers = [
      {
        email: 'hr@ongc.co.in',
        password: 'password123',
        name: 'HR Manager',
        role: 'hr_manager',
        department: 'Human Resources',
        employeeId: 'HR001',
        isActive: true
      },
      {
        email: 'admin@ongc.co.in',
        password: 'admin123',
        name: 'System Administrator',
        role: 'admin',
        department: 'IT',
        employeeId: 'IT001',
        isActive: true
      },
      {
        email: 'viewer@ongc.co.in',
        password: 'viewer123',
        name: 'Data Viewer',
        role: 'viewer',
        department: 'HR',
        employeeId: 'HR002',
        isActive: true
      }
    ];

    console.log('👥 [INIT] Default users to create:', defaultUsers.length);
    
    for (const userData of defaultUsers) {
      console.log('🔍 [INIT] Checking if user exists:', userData.email);
      const existingUser = await findUserByEmail(userData.email);
      
      if (!existingUser) {
        console.log('👤 [INIT] Creating default user:', userData.email);
        await createUser(userData);
        console.log('✅ [INIT] Created default user:', userData.email);
      } else {
        console.log('✅ [INIT] Default user already exists:', userData.email);
      }
    }
    
    console.log('✅ [INIT] MongoDB Users initialization completed');
  } catch (error) {
    console.error('❌ [INIT] Error initializing MongoDB users:', error);
  }
};

module.exports = {
  generateToken,
  verifyToken,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  initializeMongoUsers
};
