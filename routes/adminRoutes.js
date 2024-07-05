const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/adminController');

// POST create new admin
router.post('/register', registerAdmin);

// POST login admin
router.post('/login', loginAdmin);

module.exports = router;
