const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.js');

const {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  updatePassword
} = require('../controllers/userController');

// Public Routes — anyone can access
router.post('/register', registerUser);
router.post('/login', loginUser);

//  Private Routes — require auth token 
router.get('/me', authMiddleware, getCurrentUser);
router.put('/profile', authMiddleware, updateProfile);  
router.put('/password', authMiddleware, updatePassword); 

module.exports = router;

