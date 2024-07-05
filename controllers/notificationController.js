const { Notification, NotificationHistory, User } = require('../models');

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll();
    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

const getNotificationById = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching notification' });
  }
};

const createNotification = async (req, res) => {
  const { Title, Banner, Message, TargetAudience } = req.body;
  try {
    const newNotification = await Notification.create({
      Title,
      Banner,
      Message,
      TargetAudience,
    });

    // Create notification history
    const users = await User.findAll(); // Assuming notifications are sent to all users
    const historyEntries = users.map(user => ({
      NotificationID: newNotification.NotificationID,
      UserID: user.UserID,
      SentAt: new Date(),
      Status: 'Sent',
    }));
    await NotificationHistory.bulkCreate(historyEntries);

    res.status(201).json({ message: 'Notification created successfully', notification: newNotification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating notification' });
  }
};

const updateNotification = async (req, res) => {
  const { id } = req.params;
  const { Title, Banner, Message, TargetAudience } = req.body;
  try {
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    await notification.update({
      Title,
      Banner,
      Message,
      TargetAudience,
    });

    // Update notification history
    await NotificationHistory.update(
      { Status: 'Updated', SentAt: new Date() },
      { where: { NotificationID: id } }
    );

    res.status(200).json({ message: 'Notification updated successfully', notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating notification' });
  }
};

const deleteNotification = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    await notification.destroy();

    // Delete notification history
    await NotificationHistory.destroy({ where: { NotificationID: id } });

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting notification' });
  }
};

module.exports = {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
};
