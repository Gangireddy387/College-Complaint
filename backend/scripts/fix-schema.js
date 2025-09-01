const { sequelize } = require('../config/database');
const { Faculty, Department } = require('../models');

async function fixSchema() {
  try {
    console.log('Checking database schema...');
    
    // Test the connection
    await sequelize.authenticate();
    console.log('Database connection successful');
    
    // Check if faculties table has the correct columns
    const [results] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'faculties' 
      ORDER BY ordinal_position;
    `);
    
    console.log('Current faculties table columns:');
    results.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type}`);
    });
    
    // Check if the name column exists
    const hasNameColumn = results.some(col => col.column_name === 'name');
    const hasFirstNameColumn = results.some(col => col.column_name === 'first_name');
    const hasLastNameColumn = results.some(col => col.column_name === 'last_name');
    
    if (hasNameColumn && !hasFirstNameColumn) {
      console.log('Found old schema with "name" column. Adding first_name and last_name columns...');
      
      // Add the new columns
      await sequelize.query(`
        ALTER TABLE faculties 
        ADD COLUMN first_name VARCHAR(255),
        ADD COLUMN last_name VARCHAR(255);
      `);
      
      // Copy data from name to first_name (assuming name contains full name)
      await sequelize.query(`
        UPDATE faculties 
        SET first_name = name, last_name = '';
      `);
      
      // Make the new columns NOT NULL
      await sequelize.query(`
        ALTER TABLE faculties 
        ALTER COLUMN first_name SET NOT NULL,
        ALTER COLUMN last_name SET NOT NULL;
      `);
      
      console.log('Schema updated successfully');
    } else if (hasFirstNameColumn && hasLastNameColumn) {
      console.log('Schema is already correct');
    } else {
      console.log('Schema check complete');
    }
    
    // Sync the models to ensure everything is up to date
    console.log('Syncing models...');
    await sequelize.sync({ alter: true });
    console.log('Models synced successfully');
    
  } catch (error) {
    console.error('Error fixing schema:', error);
  } finally {
    await sequelize.close();
  }
}

fixSchema();
