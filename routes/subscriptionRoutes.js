const express = require('express');
const router = express.Router();
const {
  getSubscriptionTypes,
  getSubscriptionTypeById,
  createSubscriptionType,
  updateSubscriptionType,
  deleteSubscriptionType,
} = require('../controllers/subscriptionController');

// GET all subscription types
router.get('/', getSubscriptionTypes);

// GET subscription type by ID
router.get('/:id', getSubscriptionTypeById);

// POST create new subscription type
router.post('/', createSubscriptionType);

// PUT update subscription type by ID
router.put('/:id', updateSubscriptionType);

// DELETE subscription type by ID
router.delete('/:id', deleteSubscriptionType);

module.exports = router;
