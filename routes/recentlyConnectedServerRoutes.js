// routes/recentlyConnectedServerRoutes.js

const express = require('express');
const { addRecentlyConnectedServer, getRecentlyConnectedServers } = require('../controllers/recentlyConnectedServerController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticateToken, addRecentlyConnectedServer);
router.get('/', authenticateToken, getRecentlyConnectedServers);

module.exports = router;
