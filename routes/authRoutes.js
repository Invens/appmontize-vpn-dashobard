const express = require('express');
const { register, login, logout, promoteGuestToRegistered } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateToken, logout);
router.post('/promote', promoteGuestToRegistered);

module.exports = router;
