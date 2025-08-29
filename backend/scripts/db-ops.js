const { sequelize } = require('../config/database');
const initializeDatabase = require('../config/init-db');

const args = process.argv.slice(2);
const operation = args[0];

async function resetDatabase() {
  try {
    console.log('Dropping all tables...');
    await sequelize.drop();
    console.log('All tables dropped successfully');

    console.log('Reinitializing database...');
    await initializeDatabase();
    console.log('Database reinitialized successfully');
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

async function syncDatabase() {
  try {
    console.log('Synchronizing database...');
    await initializeDatabase();
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
    process.exit(1);
  }
}

async function checkConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection is OK');
    process.exit(0);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

// Execute the requested operation
switch (operation) {
  case 'reset':
    resetDatabase();
    break;
  case 'sync':
    syncDatabase();
    break;
  case 'check':
    checkConnection();
    break;
  default:
    console.log('Available commands:');
    console.log('- node db-ops.js reset  : Reset the entire database');
    console.log('- node db-ops.js sync   : Synchronize database schema');
    console.log('- node db-ops.js check  : Check database connection');
    process.exit(0);
}
