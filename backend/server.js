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

    // Initialize database and create tables (preserve existing data)
    console.log('Initializing database and syncing tables...');
    
    try {
      // Sync all models without force (preserves existing data)
      await sequelize.sync({ alter: true });
      console.log('Database tables synced successfully');
    } catch (error) {
      console.error('Error syncing tables:', error);
      throw error;
    }

    // Start listening only after database is ready
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
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