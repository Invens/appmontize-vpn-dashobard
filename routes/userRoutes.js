const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  promoteGuestToRegistered,
  getUserProfile,
  updateUserProfile,
  getSubscriptionDetails,
  upgradeSubscription,
  getUserById,
  getAllUsers
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

// User routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateToken, logout); // Protected route
router.post('/promote-guest', promoteGuestToRegistered);
router.get('/profile', authenticateToken, getUserProfile); // Protected route
router.put('/profile', authenticateToken, updateUserProfile); // Protected route
router.get('/:id/subscription-details', authenticateToken, getSubscriptionDetails); // Protected route
router.post('/upgrade-subscription', authenticateToken, upgradeSubscription); // Protected route
router.get('/:id', authenticateToken, getUserById); // Protected route
router.get('/', authenticateToken, getAllUsers); // Protected route

module.exports = router;
