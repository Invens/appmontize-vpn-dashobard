
//router
const express = require('express');
const router = express.Router();
const {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
} = require('../controllers/notificationController');

// GET all notifications
router.get('/notifications', getNotifications);

// GET notification by ID
router.get('/:id', getNotificationById);

// POST create new notification
router.post('/', createNotification);

// PUT update notification by ID
router.put('/:id', updateNotification);

// DELETE notification by ID
router.delete('/:id', deleteNotification);

module.exports = router;
