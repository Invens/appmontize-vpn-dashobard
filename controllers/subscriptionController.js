const { SubscriptionType } = require('../models');

const getSubscriptionTypes = async (req, res) => {
  try {
    const subscriptionTypes = await SubscriptionType.findAll();
    res.status(200).json(subscriptionTypes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching subscription types' });
  }
};

const getSubscriptionTypeById = async (req, res) => {
  const { id } = req.params;
  try {
    const subscriptionType = await SubscriptionType.findByPk(id);
    if (!subscriptionType) {
      return res.status(404).json({ message: 'Subscription type not found' });
    }
    res.status(200).json(subscriptionType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching subscription type' });
  }
};

const createSubscriptionType = async (req, res) => {
  const { Name, Description, Price, Duration } = req.body;
  try {
    const newSubscriptionType = await SubscriptionType.create({
      Name,
      Description,
      Price,
      Duration,
    });
    res.status(201).json({ message: 'Subscription type created successfully', subscriptionType: newSubscriptionType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating subscription type' });
  }
};

const updateSubscriptionType = async (req, res) => {
  const { id } = req.params;
  const { Name, Description, Price, Duration } = req.body;
  try {
    const subscriptionType = await SubscriptionType.findByPk(id);
    if (!subscriptionType) {
      return res.status(404).json({ message: 'Subscription type not found' });
    }
    await subscriptionType.update({
      Name,
      Description,
      Price,
      Duration,
    });
    res.status(200).json({ message: 'Subscription type updated successfully', subscriptionType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating subscription type' });
  }
};

const deleteSubscriptionType = async (req, res) => {
  const { id } = req.params;
  try {
    const subscriptionType = await SubscriptionType.findByPk(id);
    if (!subscriptionType) {
      return res.status(404).json({ message: 'Subscription type not found' });
    }
    await subscriptionType.destroy();
    res.status(200).json({ message: 'Subscription type deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting subscription type' });
  }
};

module.exports = {
  getSubscriptionTypes,
  getSubscriptionTypeById,
  createSubscriptionType,
  updateSubscriptionType,
  deleteSubscriptionType,
};
