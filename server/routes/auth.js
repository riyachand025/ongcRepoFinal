const express = require('express');
const router = express.Router();
const { 
  generateToken, 
  verifyToken, 
  findUserByEmail, 
  findUserById, 
  createUser, 
  updateUser,
  isSQLConnected 
} = require('../utils/authHelpers');

// Middleware for authentication
const authenticateToken = async (req, res, next) => {
  console.log('🔐 [AUTH] authenticateToken middleware called');
  console.log('📝 [AUTH] Request URL:', req.url);
  console.log('📝 [AUTH] Request method:', req.method);
  
  const authHeader = req.headers['authorization'];
  console.log('🔑 [AUTH] Authorization header:', authHeader ? 'Present' : 'Missing');
  
  const token = authHeader && authHeader.split(' ')[1];
  console.log('🎫 [AUTH] Token extracted:', token ? 'Yes' : 'No');

  if (!token) {
    console.log('❌ [AUTH] No token provided');
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    console.log('🔍 [AUTH] Verifying token...');
    const decoded = verifyToken(token);
    console.log('✅ [AUTH] Token verification result:', decoded ? 'Valid' : 'Invalid');
    
    if (!decoded) {
      console.log('❌ [AUTH] Invalid token');
      return res.status(403).json({ error: 'Invalid token' });
    }

    console.log('👤 [AUTH] Token payload:', { userId: decoded.userId, role: decoded.role });
    console.log('🔍 [AUTH] Finding user by ID:', decoded.userId);
    
    const user = await findUserById(decoded.userId);
    console.log('👤 [AUTH] User found:', user ? 'Yes' : 'No');
    
    if (!user || !user.isActive) {
      console.log('❌ [AUTH] User not found or inactive');
      return res.status(401).json({ error: 'Invalid or inactive user' });
    }

    console.log('✅ [AUTH] User authenticated successfully:', {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    
    req.user = user.toJSON();
    console.log('📤 [AUTH] User data attached to request');
    next();
  } catch (error) {
    console.error('❌ [AUTH] Token verification error:', error.message);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Middleware for role-based access
const requireRole = (roles) => {
  return (req, res, next) => {
    console.log('🔒 [ROLE] requireRole middleware called');
    console.log('👤 [ROLE] User role:', req.user?.role);
    console.log('🔑 [ROLE] Required roles:', roles);
    
    if (!req.user || !roles.includes(req.user.role)) {
      console.log('❌ [ROLE] Insufficient permissions');
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    console.log('✅ [ROLE] Role check passed');
    next();
  };
};

// Test endpoint to debug request processing
router.post('/test-request', (req, res) => {
  console.log('🧪 [TEST] Test request received');
  console.log('🧪 [TEST] Headers:', req.headers);
  console.log('🧪 [TEST] Body:', req.body);
  console.log('🧪 [TEST] Content-Type:', req.get('Content-Type'));
  console.log('🧪 [TEST] User-Agent:', req.get('User-Agent'));
  
  res.json({
    success: true,
    message: 'Test request processed',
    receivedBody: req.body,
    headers: {
      'content-type': req.get('Content-Type'),
      'user-agent': req.get('User-Agent'),
      'origin': req.get('Origin')
    }
  });
});

// Login route
router.post('/login', async (req, res) => {
  console.log('🚀 [LOGIN] Login request received');
  console.log('📝 [LOGIN] Request body:', { 
    email: req.body.email, 
    password: req.body.password ? `"${req.body.password}"` : 'missing',
    passwordLength: req.body.password ? req.body.password.length : 0,
    passwordBytes: req.body.password ? Buffer.from(req.body.password).toString('hex') : 'none'
  });
  
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('❌ [LOGIN] Missing email or password');
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }
    
    console.log('🔍 [LOGIN] Looking for user with email:', email);
    const user = await findUserByEmail(email);
    console.log('👤 [LOGIN] User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('❌ [LOGIN] User not found');
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    console.log('👤 [LOGIN] User details:', {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    
    if (!user.isActive) {
      console.log('❌ [LOGIN] User account is deactivated');
      return res.status(401).json({ 
        success: false, 
        message: 'Account is deactivated' 
      });
    }
    
    console.log('🔐 [LOGIN] Checking password...');
    console.log('🔐 [LOGIN] Received password:', `"${password}"`);
    console.log('🔐 [LOGIN] Password length:', password.length);
    console.log('🔐 [LOGIN] Password bytes:', Buffer.from(password).toString('hex'));
    console.log('🔐 [LOGIN] Stored hash:', user.password);
    
    const isValidPassword = await user.comparePassword(password);
    console.log('🔐 [LOGIN] Password validation result:', isValidPassword ? 'Valid' : 'Invalid');
    
    if (!isValidPassword) {
      console.log('❌ [LOGIN] Invalid password');
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    console.log('✅ [LOGIN] Password validated successfully');
    console.log('📅 [LOGIN] Updating last login timestamp...');
    await updateUser(user.id, { lastLogin: new Date() });
    console.log('📅 [LOGIN] Last login updated');
    
    console.log('🎫 [LOGIN] Generating JWT token...');
    const token = generateToken(user.id, user.role);
    console.log('🎫 [LOGIN] Token generated successfully');
    
    const userData = user.toJSON();
    console.log('📤 [LOGIN] Preparing response with user data (password excluded)');
    
    console.log('✅ [LOGIN] Login successful for user:', {
      id: userData.id,
      email: userData.email,
      role: userData.role,
      tokenLength: token.length
    });
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userData
    });
    
  } catch (error) {
    console.error('❌ [LOGIN] Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Verify token route
router.get('/verify', authenticateToken, (req, res) => {
  console.log('✅ [VERIFY] Token verification successful');
  console.log('👤 [VERIFY] User verified:', {
    id: req.user.id,
    email: req.user.email,
    role: req.user.role
  });
  
  res.json({
    success: true,
    message: 'Token is valid',
    user: req.user
  });
});

// Get current user profile
router.get('/profile', authenticateToken, (req, res) => {
  console.log('👤 [PROFILE] Profile request for user:', {
    id: req.user.id,
    email: req.user.email,
    role: req.user.role
  });
  
  res.json({
    success: true,
    user: req.user
  });
});

// Register new user (admin only)
router.post('/register', authenticateToken, requireRole(['admin']), async (req, res) => {
  console.log('📝 [REGISTER] User registration request');
  console.log('👤 [REGISTER] Request by admin:', req.user.email);
  console.log('📝 [REGISTER] New user data:', {
    email: req.body.email,
    name: req.body.name,
    role: req.body.role,
    department: req.body.department
  });
  
  try {
    const { email, password, name, role, department, employeeId } = req.body;
    
    if (!email || !password || !name || !role) {
      console.log('❌ [REGISTER] Missing required fields');
      return res.status(400).json({ 
        success: false, 
        message: 'Email, password, name, and role are required' 
      });
    }
    
    console.log('🔍 [REGISTER] Checking if user already exists...');
    const existingUser = await findUserByEmail(email);
    console.log('👤 [REGISTER] Existing user check:', existingUser ? 'Found' : 'Not found');
    
    if (existingUser) {
      console.log('❌ [REGISTER] User with this email already exists');
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }
    
    console.log('👤 [REGISTER] Creating new user...');
    const newUser = await createUser({
      email,
      password,
      name,
      role,
      department,
      employeeId,
      isActive: true
    });
    
    console.log('✅ [REGISTER] User created successfully:', {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    });
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: newUser.toJSON()
    });
    
  } catch (error) {
    console.error('❌ [REGISTER] Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  console.log('📝 [PROFILE_UPDATE] Profile update request');
  console.log('👤 [PROFILE_UPDATE] User:', req.user.email);
  console.log('📝 [PROFILE_UPDATE] Update data:', req.body);
  
  try {
    const { name, department, employeeId } = req.body;
    const userId = req.user.id;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (department) updateData.department = department;
    if (employeeId) updateData.employeeId = employeeId;
    
    console.log('📝 [PROFILE_UPDATE] Fields to update:', Object.keys(updateData));
    
    const updatedUser = await updateUser(userId, updateData);
    console.log('✅ [PROFILE_UPDATE] Profile updated successfully');
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser.toJSON()
    });
    
  } catch (error) {
    console.error('❌ [PROFILE_UPDATE] Profile update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  console.log('🔐 [PASSWORD] Password change request');
  console.log('👤 [PASSWORD] User:', req.user.email);
  
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    
    if (!currentPassword || !newPassword) {
      console.log('❌ [PASSWORD] Missing password fields');
      return res.status(400).json({ 
        success: false, 
        message: 'Current password and new password are required' 
      });
    }
    
    console.log('🔍 [PASSWORD] Verifying current password...');
    const user = await findUserById(userId);
    const isValidPassword = await user.comparePassword(currentPassword);
    console.log('🔐 [PASSWORD] Current password validation:', isValidPassword ? 'Valid' : 'Invalid');
    
    if (!isValidPassword) {
      console.log('❌ [PASSWORD] Current password is incorrect');
      return res.status(400).json({ 
        success: false, 
        message: 'Current password is incorrect' 
      });
    }
    
    console.log('📝 [PASSWORD] Updating password...');
    await updateUser(userId, { password: newPassword });
    console.log('✅ [PASSWORD] Password changed successfully');
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
    
  } catch (error) {
    console.error('❌ [PASSWORD] Password change error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get all users (admin only)
router.get('/users', authenticateToken, requireRole(['admin']), async (req, res) => {
  console.log('👥 [USERS] Get all users request');
  console.log('👤 [USERS] Request by admin:', req.user.email);
  
  try {
    const SQLUser = require('../models/User');
    console.log('🔍 [USERS] Fetching all users from database...');
    const users = await SQLUser.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    
    console.log('✅ [USERS] Found', users.length, 'users');
    
    res.json({
      success: true,
      users: users.map(user => user.toJSON())
    });
    
  } catch (error) {
    console.error('❌ [USERS] Get users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Toggle user active status (admin only)
router.put('/users/:id/toggle-status', authenticateToken, requireRole(['admin']), async (req, res) => {
  console.log('🔄 [TOGGLE] Toggle user status request');
  console.log('👤 [TOGGLE] Request by admin:', req.user.email);
  console.log('👤 [TOGGLE] Target user ID:', req.params.id);
  
  try {
    const userId = req.params.id;
    console.log('🔍 [TOGGLE] Finding target user...');
    const user = await findUserById(userId);
    console.log('👤 [TOGGLE] Target user found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('❌ [TOGGLE] User not found');
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    console.log('👤 [TOGGLE] Current user status:', user.isActive ? 'Active' : 'Inactive');
    const updatedUser = await updateUser(userId, { isActive: !user.isActive });
    console.log('✅ [TOGGLE] User status updated to:', updatedUser.isActive ? 'Active' : 'Inactive');
    
    res.json({
      success: true,
      message: `User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`,
      user: updatedUser.toJSON()
    });
    
  } catch (error) {
    console.error('❌ [TOGGLE] Toggle user status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

module.exports = {
  router,
  authenticateToken,
  requireRole
}; 