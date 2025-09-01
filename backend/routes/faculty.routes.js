const express = require('express');
const { body, validationResult } = require('express-validator');
const { Faculty, Principal, Department } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all faculty for the principal's college
router.get('/', authenticateToken, async (req, res) => {
  try {
    const principal = await Principal.findByPk(req.user.id);
    if (!principal || !principal.collegeId) {
      return res.status(404).json({ message: 'College not found for this principal' });
    }

    const faculty = await Faculty.findAll({
      where: { collegeId: principal.collegeId },
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'department_code']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(faculty);
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get faculty by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const principal = await Principal.findByPk(req.user.id);
    if (!principal || !principal.collegeId) {
      return res.status(404).json({ message: 'College not found for this principal' });
    }

    const faculty = await Faculty.findOne({
      where: { 
        id: req.params.id,
        collegeId: principal.collegeId 
      },
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'department_code']
        }
      ]
    });

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.json(faculty);
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new faculty
router.post('/', [
  body('employee_id').notEmpty().withMessage('Employee ID is required'),
  body('first_name').notEmpty().withMessage('First name is required'),
  body('last_name').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('department_id').isInt().withMessage('Valid department ID is required'),
  body('designation').notEmpty().withMessage('Designation is required'),
  body('joining_date').isDate().withMessage('Valid joining date is required'),
  body('phone_number').optional().matches(/^[0-9]{10}$/).withMessage('Phone must be 10 digits')
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
      return res.status(404).json({ message: 'College not found for this principal' });
    }

    const {
      employee_id,
      first_name,
      last_name,
      email,
      password,
      department_id,
      designation,
      specializations,
      qualifications,
      phone_number,
      joining_date,
      experience,
      publications,
      achievements,
      current_workload,
      status
    } = req.body;

    // Check if faculty with same employee ID or email already exists
    const existingFaculty = await Faculty.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { employee_id },
          { email }
        ],
        collegeId: principal.collegeId
      }
    });

    if (existingFaculty) {
      return res.status(400).json({ 
        message: 'Faculty with this employee ID or email already exists' 
      });
    }

    // Validate department
    const department = await Department.findOne({
      where: { 
        id: department_id,
        collegeId: principal.collegeId 
      }
    });
    if (!department) {
      return res.status(400).json({ message: 'Invalid department ID' });
    }

    // Create faculty
    const faculty = await Faculty.create({
      employee_id,
      first_name,
      last_name,
      email,
      password,
      department_id,
      designation,
      specializations: specializations || [],
      qualifications: qualifications || [],
      phone_number,
      joining_date,
      experience: experience || [],
      publications: publications || [],
      achievements: achievements || [],
      current_workload: current_workload || 0,
      status: status || 'active',
      collegeId: principal.collegeId
    });

    res.status(201).json({
      message: 'Faculty created successfully',
      faculty
    });
  } catch (error) {
    console.error('Error creating faculty:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update faculty
router.put('/:id', [
  body('employee_id').optional().notEmpty().withMessage('Employee ID cannot be empty'),
  body('first_name').optional().notEmpty().withMessage('First name cannot be empty'),
  body('last_name').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('department_id').optional().isInt().withMessage('Valid department ID is required'),
  body('designation').optional().notEmpty().withMessage('Designation cannot be empty'),
  body('joining_date').optional().isDate().withMessage('Valid joining date is required'),
  body('phone_number').optional().matches(/^[0-9]{10}$/).withMessage('Phone must be 10 digits')
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
      return res.status(404).json({ message: 'College not found for this principal' });
    }

    const faculty = await Faculty.findOne({
      where: { 
        id: req.params.id,
        collegeId: principal.collegeId 
      }
    });

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    const updateData = req.body;

    // Check for duplicate employee ID or email if being updated
    if (updateData.employee_id || updateData.email) {
      const existingFaculty = await Faculty.findOne({
        where: {
          [require('sequelize').Op.or]: [
            { employee_id: updateData.employee_id || faculty.employee_id },
            { email: updateData.email || faculty.email }
          ],
          collegeId: principal.collegeId,
          id: { [require('sequelize').Op.ne]: req.params.id }
        }
      });

      if (existingFaculty) {
        return res.status(400).json({ 
          message: 'Faculty with this employee ID or email already exists' 
        });
      }
    }

    // Validate department if being updated
    if (updateData.department_id) {
      const department = await Department.findOne({
        where: { 
          id: updateData.department_id,
          collegeId: principal.collegeId 
        }
      });
      if (!department) {
        return res.status(400).json({ message: 'Invalid department ID' });
      }
    }

    // Update faculty
    await faculty.update(updateData);

    res.json({
      message: 'Faculty updated successfully',
      faculty
    });
  } catch (error) {
    console.error('Error updating faculty:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete faculty
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const principal = await Principal.findByPk(req.user.id);
    if (!principal || !principal.collegeId) {
      return res.status(404).json({ message: 'College not found for this principal' });
    }

    const faculty = await Faculty.findOne({
      where: { 
        id: req.params.id,
        collegeId: principal.collegeId 
      }
    });

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    await faculty.destroy();

    res.json({ message: 'Faculty deleted successfully' });
  } catch (error) {
    console.error('Error deleting faculty:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get available departments for faculty assignment
router.get('/departments/available', authenticateToken, async (req, res) => {
  try {
    const principal = await Principal.findByPk(req.user.id);
    if (!principal || !principal.collegeId) {
      return res.status(404).json({ message: 'College not found for this principal' });
    }

    const departments = await Department.findAll({
      where: { 
        collegeId: principal.collegeId,
        status: 'active'
      },
      attributes: ['id', 'name', 'department_code'],
      order: [['name', 'ASC']]
    });

    res.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
