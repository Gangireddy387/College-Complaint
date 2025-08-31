const express = require('express');
const { body, validationResult } = require('express-validator');
const { College, Principal } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get college profile (for the logged-in principal's college)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const principal = await Principal.findByPk(req.user.id);
    if (!principal) {
      return res.status(404).json({ message: 'Principal not found' });
    }

    if (!principal.collegeId) {
      return res.status(404).json({ message: 'No college associated with this principal' });
    }

    const college = await College.findByPk(principal.collegeId);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    res.json(college);
  } catch (error) {
    console.error('Error fetching college profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new college
router.post('/', [
  body('name').notEmpty().withMessage('College name is required'),
  body('code').notEmpty().withMessage('College code is required'),
  body('type').isIn(['government', 'private', 'autonomous']).withMessage('Invalid college type'),
  body('address').notEmpty().withMessage('Address is required'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Phone must be 10 digits'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('establishment_date').isISO8601().withMessage('Valid establishment date is required')
], authenticateToken, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const {
      name, code, type, address, phone, email, website, 
      establishment_date, facilities, departments, achievements, status
    } = req.body;

    // Check if college with same name or code already exists
    const existingCollege = await College.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { name },
          { code }
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
      name,
      code,
      type,
      address,
      phone,
      email,
      website: website || null,
      establishment_date: new Date(establishment_date),
      facilities: facilities || [],
      departments: departments || [],
      achievements: achievements || [],
      status: status || 'active'
    });

    // Update the principal's collegeId
    if (req.user && req.user.id) {
      await Principal.update(
        { collegeId: college.id },
        { where: { id: req.user.id } }
      );
    }

    res.status(201).json({
      message: 'College created successfully',
      college
    });
  } catch (error) {
    console.error('Error creating college:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update college profile
router.put('/profile', [
  body('name').notEmpty().withMessage('College name is required'),
  body('code').notEmpty().withMessage('College code is required'),
  body('type').isIn(['government', 'private', 'autonomous']).withMessage('Invalid college type'),
  body('address').notEmpty().withMessage('Address is required'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Phone must be 10 digits'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('establishment_date').isISO8601().withMessage('Valid establishment date is required')
], authenticateToken, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const principal = await Principal.findByPk(req.user.id);
    if (!principal || !principal.collegeId) {
      return res.status(404).json({ message: 'No college associated with this principal' });
    }

    const college = await College.findByPk(principal.collegeId);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    const {
      name, code, type, address, phone, email, website, 
      establishment_date, facilities, departments, achievements, status
    } = req.body;

    // Check if college with same name or code already exists (excluding current college)
    const existingCollege = await College.findOne({
      where: {
        id: { [require('sequelize').Op.ne]: college.id },
        [require('sequelize').Op.or]: [
          { name },
          { code }
        ]
      }
    });

    if (existingCollege) {
      return res.status(400).json({ 
        message: 'College with this name or code already exists' 
      });
    }

    // Update college
    await college.update({
      name,
      code,
      type,
      address,
      phone,
      email,
      website: website || null,
      establishment_date: new Date(establishment_date),
      facilities: facilities || [],
      departments: departments || [],
      achievements: achievements || [],
      status: status || 'active'
    });

    res.json({
      message: 'College profile updated successfully',
      college
    });
  } catch (error) {
    console.error('Error updating college profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all colleges (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const colleges = await College.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(colleges);
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get college by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const college = await College.findByPk(req.params.id);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }
    res.json(college);
  } catch (error) {
    console.error('Error fetching college:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
