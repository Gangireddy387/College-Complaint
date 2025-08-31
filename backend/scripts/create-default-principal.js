const { Principal } = require('../models');
const bcrypt = require('bcryptjs');

async function createDefaultPrincipal() {
  try {
    // Check if a principal already exists
    const existingPrincipal = await Principal.findOne();
    
    if (existingPrincipal) {
      console.log('A principal already exists in the database.');
      return;
    }

    // Create default principal
    const defaultPrincipal = await Principal.create({
      employee_id: 'PRIN001',
      first_name: 'John',
      last_name: 'Doe',
      email: 'principal@college.com',
      password: 'principal123', // This will be hashed by the model hook
      phone_number: '1234567890',
      joining_date: new Date(),
      status: 'active'
    });

    console.log('Default principal created successfully:');
    console.log('Email:', defaultPrincipal.email);
    console.log('Password: principal123');
    console.log('Employee ID:', defaultPrincipal.employee_id);
    
  } catch (error) {
    console.error('Error creating default principal:', error);
  }
}

// Run the script
createDefaultPrincipal();
