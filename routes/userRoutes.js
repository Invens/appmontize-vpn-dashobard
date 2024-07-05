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
const authMiddleware = require('../middleware/authMiddleware');

// User routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout',  logout);
router.post('/promote-guest', promoteGuestToRegistered);
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.get('/:id/subscription-details', getSubscriptionDetails);
router.post('/upgrade-subscription',  upgradeSubscription);
router.get('/:id', getUserById);
router.get('/',  getAllUsers);

module.exports = router;
