const express = require('express');
const router = express.Router();
const {getServersBySubscription, createServer, getServer, getAllServers, updateServer, deleteServer } = require('../controllers/serverController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', getServersBySubscription);
router.post('/', createServer);         // Create a new server
router.get('/:serverID', getServer);    // Get a server by ID
router.get('/', getAllServers);         // Get all servers
router.put('/:serverID', updateServer); // Update a server by ID
router.delete('/:serverID', deleteServer); // Delete a server by ID

module.exports = router;
