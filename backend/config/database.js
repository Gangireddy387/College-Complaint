const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'college_complaint',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'root',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false,
      useUTC: false
    },
    timezone: '+05:30', // IST timezone
    define: {
      underscored: true, // Use snake_case for column names
      freezeTableName: false, // Pluralize table names
      timestamps: true, // Add createdAt and updatedAt
      paranoid: true, // Soft deletes (adds deletedAt)
      charset: 'utf8',
      collate: 'utf8_general_ci'
    },
    retry: {
      match: [
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/
      ],
      max: 3
    }
  }
);

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Initialize database if in development mode
    if (process.env.NODE_ENV === 'development') {
      const initializeDatabase = require('./init-db');
      await initializeDatabase();
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    
    // Specific error handling
    if (error.name === 'SequelizeConnectionError') {
      console.error('Please check if PostgreSQL is running and the credentials are correct.');
    } else if (error.name === 'SequelizeHostNotFoundError') {
      console.error('Database host not found. Please check your DB_HOST environment variable.');
    } else if (error.name === 'SequelizeConnectionRefusedError') {
      console.error('Connection refused. Please check if PostgreSQL is running on the specified port.');
    }
    
    throw error;
  }
}

// Export both sequelize instance and connection test
module.exports = {
  sequelize,
  testConnection
};