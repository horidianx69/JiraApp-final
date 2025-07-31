const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token missing"
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false, 
        message: 'User not found'
      });
    }

    req.user = user; 
    next(); 
  } catch (err) {
    console.log('JWT verification failed', err.message);
    return res.status(401).json({
      success: false, 
      message: 'Token invalid or expired'
    });
  }
};

module.exports = authMiddleware;
