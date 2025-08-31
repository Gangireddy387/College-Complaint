const express = require('express');
const jwt = require('jsonwebtoken');
const { Principal } = require('../models');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const principal = await Principal.findByPk(decoded.id);
    
    if (!principal) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.principal = principal;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Login route
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find principal by email
    const principal = await Principal.findOne({ where: { email } });
    
    if (!principal) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if principal is active
    if (principal.status !== 'active') {
      return res.status(401).json({ message: 'Account is inactive' });
    }

    // Validate password
    const isValidPassword = await principal.validatePassword(password);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: principal.id, 
        email: principal.email,
        role: 'principal'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return principal data (excluding password) and token
    const principalData = {
      id: principal.id,
      employee_id: principal.employee_id,
      first_name: principal.first_name,
      last_name: principal.last_name,
      email: principal.email,
      phone_number: principal.phone_number,
      joining_date: principal.joining_date,
      status: principal.status,
      createdAt: principal.createdAt,
      updatedAt: principal.updatedAt
    };

    res.json({
      message: 'Login successful',
      principal: principalData,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout route
router.post('/logout', authenticateToken, (req, res) => {
  // In a real application, you might want to blacklist the token
  // For now, we'll just return a success message
  res.json({ message: 'Logout successful' });
});

// Get principal profile
router.get('/profile', authenticateToken, (req, res) => {
  const principal = req.principal;
  
  const principalData = {
    id: principal.id,
    employee_id: principal.employee_id,
    first_name: principal.first_name,
    last_name: principal.last_name,
    email: principal.email,
    phone_number: principal.phone_number,
    joining_date: principal.joining_date,
    status: principal.status,
    createdAt: principal.createdAt,
    updatedAt: principal.updatedAt
  };

  res.json(principalData);
});

// Update principal profile
router.put('/profile', authenticateToken, [
  body('first_name').notEmpty().withMessage('First name is required'),
  body('last_name').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('phone_number').optional().matches(/^[0-9]{10}$/).withMessage('Please enter a valid 10-digit phone number'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const principal = req.principal;
    const { first_name, last_name, email, phone_number } = req.body;

    // Check if email is already taken by another principal
    if (email !== principal.email) {
      const existingPrincipal = await Principal.findOne({ where: { email } });
      if (existingPrincipal) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }

    // Update principal data
    await principal.update({
      first_name,
      last_name,
      email,
      phone_number: phone_number || null
    });

    const updatedPrincipal = {
      id: principal.id,
      employee_id: principal.employee_id,
      first_name: principal.first_name,
      last_name: principal.last_name,
      email: principal.email,
      phone_number: principal.phone_number,
      joining_date: principal.joining_date,
      status: principal.status,
      createdAt: principal.createdAt,
      updatedAt: principal.updatedAt
    };

    res.json({
      message: 'Profile updated successfully',
      principal: updatedPrincipal
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Change password
router.put('/change-password', authenticateToken, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const principal = req.principal;
    const { currentPassword, newPassword } = req.body;

    // Validate current password
    const isValidPassword = await principal.validatePassword(currentPassword);
    
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    principal.password = newPassword;
    await principal.save();

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
