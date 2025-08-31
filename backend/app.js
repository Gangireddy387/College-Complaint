const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to College Complaint Management System API' });
});

// Test route for forgot password
app.get('/api/principal/test', (req, res) => {
  res.json({ message: 'Forgot password API is working!' });
});

// Import routes
const principalRoutes = require('./routes/principal.routes');
const principalForgotPasswordRoutes = require('./routes/principalForgotPassword');
const collegeRoutes = require('./routes/college.routes');

// Use routes
app.use('/api/principal', principalRoutes);
app.use('/api/principal', principalForgotPasswordRoutes);
app.use('/api/college', collegeRoutes);



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
