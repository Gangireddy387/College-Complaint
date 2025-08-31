const express = require('express');
const jwt = require('jsonwebtoken');
const { Principal } = require('../models');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Registration route
router.post('/register', [
  body('employee_id').notEmpty().withMessage('Employee ID is required'),
  body('first_name').notEmpty().withMessage('First name is required'),
  body('last_name').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone_number').matches(/^[0-9]{10}$/).withMessage('Please enter a valid 10-digit phone number'),
  body('joining_date').notEmpty().withMessage('Joining date is required'),
  body('collegeData').optional().isObject().withMessage('College data must be an object'),
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

    const { 
      employee_id, 
      first_name, 
      last_name, 
      email, 
      password, 
      phone_number, 
      joining_date,
      collegeData
    } = req.body;

    // Check if email already exists
    const existingPrincipal = await Principal.findOne({ where: { email } });
    if (existingPrincipal) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Check if employee ID already exists
    const existingEmployeeId = await Principal.findOne({ where: { employee_id } });
    if (existingEmployeeId) {
      return res.status(400).json({ message: 'Employee ID is already registered' });
    }

    let collegeId = null;

    // Create college if collegeData is provided
    if (collegeData) {
      const { College } = require('../models');
      
      // Check if college with same name or code already exists
      const existingCollege = await College.findOne({
        where: {
          [require('sequelize').Op.or]: [
            { name: collegeData.name },
            { code: collegeData.code }
          ]
        }
      });

      if (existingCollege) {
        return res.status(400).json({ 
          message: 'College with this name or code already exists' 
        });
      }

      // Create college
      const college = await College.create({
        name: collegeData.name,
        code: collegeData.code,
        type: collegeData.type || 'private',
        address: collegeData.address,
        phone: collegeData.phone,
        email: collegeData.email,
        website: collegeData.website || null,
        establishment_date: new Date(collegeData.establishment_date),
        facilities: collegeData.facilities || [],
        departments: collegeData.departments || [],
        achievements: collegeData.achievements || [],
        status: collegeData.status || 'active'
      });

      collegeId = college.id;
    }

    // Create new principal
    const principal = await Principal.create({
      employee_id,
      first_name,
      last_name,
      email,
      password, // Will be hashed by model hook
      phone_number,
      joining_date: new Date(joining_date),
      status: 'active',
      isVerified: false, // New accounts need verification
      collegeId: collegeId
    });

    // Return principal data (excluding password)
    const principalData = {
      id: principal.id,
      employee_id: principal.employee_id,
      first_name: principal.first_name,
      last_name: principal.last_name,
      email: principal.email,
      phone_number: principal.phone_number,
      joining_date: principal.joining_date,
      status: principal.status,
      isVerified: principal.isVerified,
      createdAt: principal.createdAt,
      updatedAt: principal.updatedAt
    };

    res.status(201).json({
      message: 'Registration successful! Your account is pending verification. You will be able to login once verified by administrator.',
      principal: principalData
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

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

    // Check if principal is verified
    if (!principal.isVerified) {
      return res.status(401).json({ message: 'Account is not verified. Please contact administrator for verification.' });
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
      isVerified: principal.isVerified,
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
    isVerified: principal.isVerified,
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
      isVerified: principal.isVerified,
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

// Verify principal (admin route)
router.put('/verify/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const principal = await Principal.findByPk(id);
    if (!principal) {
      return res.status(404).json({ message: 'Principal not found' });
    }

    await principal.update({ isVerified: true });

    res.json({ 
      message: 'Principal verified successfully',
      principal: {
        id: principal.id,
        employee_id: principal.employee_id,
        first_name: principal.first_name,
        last_name: principal.last_name,
        email: principal.email,
        phone_number: principal.phone_number,
        joining_date: principal.joining_date,
        status: principal.status,
        isVerified: principal.isVerified,
        createdAt: principal.createdAt,
        updatedAt: principal.updatedAt
      }
    });

  } catch (error) {
    console.error('Principal verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all principals (admin route)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const principals = await Principal.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json(principals);
  } catch (error) {
    console.error('Get principals error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
