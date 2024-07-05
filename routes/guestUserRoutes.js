const express = require('express');
const { registerGuest, getGuestUserDetails } = require('../controllers/guestUserController');
const { authenticateGuestToken } = require('../middleware/guestAuthMiddleware');

const router = express.Router();

router.post('/register', registerGuest);
router.get('/me', authenticateGuestToken, getGuestUserDetails);

module.exports = router;
