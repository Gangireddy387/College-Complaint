const jwt = require('jsonwebtoken');
const { Principal } = require('../models');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const principal = await Principal.findByPk(decoded.id);
    
    if (!principal) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded; // Store decoded token info
    req.principal = principal; // Store principal object
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = {
  authenticateToken
};
