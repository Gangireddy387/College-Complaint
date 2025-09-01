const express = require('express');
const { body, validationResult } = require('express-validator');
const { Department, Principal, Faculty } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all departments for the principal's college
router.get('/', authenticateToken, async (req, res) => {
  try {
    const principal = await Principal.findByPk(req.user.id);
    if (!principal || !principal.collegeId) {
      return res.status(404).json({ message: 'College not found for this principal' });
    }

    const departments = await Department.findAll({
      where: { collegeId: principal.collegeId },
      include: [
        {
          model: Faculty,
          as: 'headOfDepartment',
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone_number']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get department by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const principal = await Principal.findByPk(req.user.id);
    if (!principal || !principal.collegeId) {
      return res.status(404).json({ message: 'College not found for this principal' });
    }

    const department = await Department.findOne({
      where: { 
        id: req.params.id,
        collegeId: principal.collegeId 
      },
      include: [
        {
          model: Faculty,
          as: 'headOfDepartment',
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone_number']
        }
      ]
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json(department);
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new department
router.post('/', [
  body('department_code').notEmpty().withMessage('Department code is required'),
  body('name').notEmpty().withMessage('Department name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('established_year').isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Valid establishment year is required'),
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
      department_code,
      name,
      description,
      hod_id,
      established_year,
      email,
      phone_number,
      location,
      facilities,
      programs,
      achievements,
      research_areas,
      budget
    } = req.body;

    // Check if department with same code or email already exists
    const existingDepartment = await Department.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { department_code },
          { email }
        ],
        collegeId: principal.collegeId
      }
    });

    if (existingDepartment) {
      return res.status(400).json({ 
        message: 'Department with this code or email already exists' 
      });
    }

    // Validate HOD if provided
    if (hod_id) {
      const hod = await Faculty.findOne({
        where: { 
          id: hod_id,
          collegeId: principal.collegeId 
        }
      });
      if (!hod) {
        return res.status(400).json({ message: 'Invalid HOD ID' });
      }
    }

    // Create department
    const department = await Department.create({
      department_code,
      name,
      description,
      hod_id,
      established_year,
      email,
      phone_number,
      location: location || {},
      facilities: facilities || [],
      programs: programs || [],
      achievements: achievements || [],
      research_areas: research_areas || [],
      budget,
      collegeId: principal.collegeId
    });

    res.status(201).json({
      message: 'Department created successfully',
      department
    });
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update department
router.put('/:id', [
  body('department_code').optional().notEmpty().withMessage('Department code cannot be empty'),
  body('name').optional().notEmpty().withMessage('Department name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('established_year').optional().isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Valid establishment year is required'),
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

    const department = await Department.findOne({
      where: { 
        id: req.params.id,
        collegeId: principal.collegeId 
      }
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const updateData = req.body;

    // Check for duplicate code or email if being updated
    if (updateData.department_code || updateData.email) {
      const existingDepartment = await Department.findOne({
        where: {
          [require('sequelize').Op.or]: [
            { department_code: updateData.department_code || department.department_code },
            { email: updateData.email || department.email }
          ],
          collegeId: principal.collegeId,
          id: { [require('sequelize').Op.ne]: req.params.id }
        }
      });

      if (existingDepartment) {
        return res.status(400).json({ 
          message: 'Department with this code or email already exists' 
        });
      }
    }

    // Validate HOD if being updated
    if (updateData.hod_id) {
      const hod = await Faculty.findOne({
        where: { 
          id: updateData.hod_id,
          collegeId: principal.collegeId 
        }
      });
      if (!hod) {
        return res.status(400).json({ message: 'Invalid HOD ID' });
      }
    }

    // Update department
    await department.update(updateData);

    res.json({
      message: 'Department updated successfully',
      department
    });
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete department
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const principal = await Principal.findByPk(req.user.id);
    if (!principal || !principal.collegeId) {
      return res.status(404).json({ message: 'College not found for this principal' });
    }

    const department = await Department.findOne({
      where: { 
        id: req.params.id,
        collegeId: principal.collegeId 
      }
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    await department.destroy();

    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get available faculty for HOD assignment
router.get('/faculty/available', authenticateToken, async (req, res) => {
  try {
    const principal = await Principal.findByPk(req.user.id);
    if (!principal || !principal.collegeId) {
      return res.status(404).json({ message: 'College not found for this principal' });
    }

    const faculty = await Faculty.findAll({
      where: { 
        collegeId: principal.collegeId,
        status: 'active'
      },
      attributes: ['id', 'first_name', 'last_name', 'email', 'phone_number', 'designation'],
      order: [['first_name', 'ASC']]
    });

    res.json(faculty);
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
