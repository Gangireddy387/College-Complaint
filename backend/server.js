const app = require('./app');
const { sequelize } = require('./config/database');

// Load models
require('./models');

// Define PORT
const PORT = process.env.PORT || 5000;

// Start server and initialize database
async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Initialize database and create tables
    console.log('Initializing database and creating tables...');
    
    // Create tables in correct order based on dependencies
    const models = require('./models');
    
    try {
      // Drop schema and recreate
      await sequelize.query('DROP SCHEMA IF EXISTS public CASCADE;');
      await sequelize.query('CREATE SCHEMA public;');
      await sequelize.query('GRANT ALL ON SCHEMA public TO public;');
      
      console.log('Creating tables...');
      
      // Create tables in order
      const tableOrder = [
        'Principal',
        'Department',
        'Faculty',
        'Student',
        'ClassRoom',
        'Section',
        'Subject',
        'TimeSlot',
        'Attendance',
        'DisciplinaryComplaint',
        'SectionStudent'
      ];
      
      for (const modelName of tableOrder) {
        console.log(`Creating ${modelName} table...`);
        await models[modelName].sync({ force: true });
      }
      
      // Add any additional constraints
      console.log('Adding constraints...');
      await sequelize.query(`
        ALTER TABLE "departments"
        ADD CONSTRAINT "fk_department_hod"
        FOREIGN KEY ("hod_id")
        REFERENCES "faculties" ("id")
        ON DELETE SET NULL
        ON UPDATE CASCADE;
      `);
      
      console.log('All database tables created successfully');
    } catch (error) {
      console.error('Error creating tables:', error);
      throw error;
    }

    // Start listening only after database is ready
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    
    // Specific error handling
    if (error.name === 'SequelizeConnectionError') {
      console.error('Please check if PostgreSQL is running and the credentials are correct.');
    } else if (error.name === 'SequelizeHostNotFoundError') {
      console.error('Database host not found. Please check your DB_HOST environment variable.');
    } else if (error.name === 'SequelizeConnectionRefusedError') {
      console.error('Connection refused. Please check if PostgreSQL is running on the specified port.');
    }
    
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

startServer();