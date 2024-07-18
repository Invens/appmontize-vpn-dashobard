const express = require('express');
const router = express.Router();
const { getServersBySubscription, createServer, getServer, getAllServers, updateServer, deleteServer } = require('../controllers/serverController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/subscription', authenticateToken, getServersBySubscription);
router.post('/', authenticateToken, createServer);         // Create a new server
router.get('/:serverID', authenticateToken, getServer);    // Get a server by ID
router.get('/', authenticateToken, getAllServers);         // Get all servers
router.put('/:serverID', authenticateToken, updateServer); // Update a server by ID
router.delete('/:serverID', authenticateToken, deleteServer); // Delete a server by ID

module.exports = router;
