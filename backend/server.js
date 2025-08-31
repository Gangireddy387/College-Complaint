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

    // Create default principal after tables are created
    try {
      console.log('Creating default principal...');
      const { Principal } = require('./models');
      
      // Check if a principal already exists
      const existingPrincipal = await Principal.findOne();
      
      if (existingPrincipal) {
        console.log('A principal already exists in the database.');
      } else {
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

        console.log('✅ Default principal created successfully:');
        console.log('   Email:', defaultPrincipal.email);
        console.log('   Password: principal123');
        console.log('   Employee ID:', defaultPrincipal.employee_id);
      }
    } catch (error) {
      console.error('Error creating default principal:', error);
      // Don't throw error here, continue with server startup
    }

    // Start listening only after database is ready
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`📧 Default Principal Login: principal@college.com`);
      console.log(`🔑 Default Password: principal123`);
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