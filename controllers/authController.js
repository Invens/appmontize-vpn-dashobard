const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, SubscriptionType } = require('../models');

const register = async (req, res) => {
    try {
      const { Name, Email, Password, SubscriptionTypeID } = req.body;
      
      // Check if SubscriptionTypeID is provided
      if (!SubscriptionTypeID) {
        return res.status(400).json({ message: 'SubscriptionTypeID is required' });
      }
  
      const existingUser = await User.findOne({ where: { Email } });
  
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
  
      const hashedPassword = await bcrypt.hash(Password, 10);
      const subscriptionType = await SubscriptionType.findOne({ where: { SubscriptionTypeID } });
  
      if (!subscriptionType) {
        return res.status(500).json({ message: 'Subscription type not found' });
      }
  
      const newUser = await User.create({
        Name,
        Email,
        Password: hashedPassword,
        SubscriptionTypeID: subscriptionType.SubscriptionTypeID,
      });
  
      const token = jwt.sign({ userID: newUser.UserID }, process.env.JWT_SECRET, { expiresIn: '1h' });
      newUser.Token = token;
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully', token, user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error registering user' });
    }
  };
  
const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await User.findOne({ where: { Email } });

    if (!user || !await bcrypt.compare(Password, user.Password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userID: user.UserID }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.Token = token;
    await user.save();

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

const logout = async (req, res) => {
  try {
    const userID = req.user.userID;
    await User.update({ Token: null }, { where: { UserID: userID } });

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging out' });
  }
};

const promoteGuestToRegistered = async (req, res) => {
  try {
    const { DeviceID, Name, Email, Password } = req.body;

    const guestUser = await GuestUser.findOne({ where: { DeviceID } });
    if (!guestUser) return res.status(404).json({ message: 'Guest user not found' });

    const hashedPassword = await bcrypt.hash(Password, 10);
    const defaultSubscription = await SubscriptionType.findOne({ where: { SubscriptionTypeID: 1 } });

    const newUser = await User.create({
      Name,
      Email,
      Password: hashedPassword,
      SubscriptionTypeID: defaultSubscription.SubscriptionTypeID,
      BandwidthUsed: guestUser.BandwidthUsed,
    });

    await GuestUser.destroy({ where: { DeviceID } });

    const token = jwt.sign({ userID: newUser.UserID }, process.env.JWT_SECRET, { expiresIn: '1h' });
    newUser.Token = token;
    await newUser.save();

    res.status(201).json({ message: 'Guest user promoted to registered user successfully', token, user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error promoting guest user to registered user' });
  }
};

module.exports = { register, login, logout, promoteGuestToRegistered };
