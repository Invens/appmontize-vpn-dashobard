const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, SubscriptionType, GuestUser, AccountDeletionRequest } = require('../models');
const { generateOtp, sendOtpEmail, sendDeletionRequestNotification } = require('../utils/otputils');

// user registration
const register = async (req, res) => {
  try {
    const { Name, Email, Password } = req.body;
    const existingUser = await User.findOne({ where: { Email } });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    const defaultSubscription = await SubscriptionType.findOne({ where: { SubscriptionTypeID: 1 } });

    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    const newUser = await User.create({
      Name,
      Email,
      Password: hashedPassword,
      SubscriptionTypeID: defaultSubscription.SubscriptionTypeID,
      OTP: otp,
      OTPExpiresAt: otpExpiresAt,
    });

    await sendOtpEmail(Email, otp);

    // Generate JWT token
    const token = jwt.sign({ userID: newUser.UserID }, process.env.JWT_SECRET, { expiresIn: '365d' });
    newUser.Token = token;
    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully. Please verify your email.',
      user: newUser,
      token: token, // Include token in the response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { userID, otp } = req.body;
    const user = await User.findOne({ where: { UserID: userID, OTP: otp } });

    if (!user || new Date() > new Date(user.OTPExpiresAt)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.OTP = null;
    user.OTPExpiresAt = null;
    await user.save();

    const token = jwt.sign({ userID: user.UserID }, process.env.JWT_SECRET, { expiresIn: '365d' });

    res.status(200).json({ message: 'OTP verified successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
};




const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await User.findOne({ where: { Email } });

    if (!user || !await bcrypt.compare(Password, user.Password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userID: user.UserID }, process.env.JWT_SECRET, { expiresIn: '365d' });
    user.Token = token;
    await user.save();

    res.status(200).json({ message: 'Login successful', token, userID: user.UserID }); // Include userID in the response
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

    const token = jwt.sign({ userID: newUser.UserID }, process.env.JWT_SECRET, { expiresIn: '365D' });
    newUser.Token = token;
    await newUser.save();

    res.status(201).json({ message: 'Guest user promoted to registered user successfully', token, user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error promoting guest user to registered user' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    const userDetails = await User.findOne({
      where: { UserID: user.UserID },
      attributes: { exclude: ['Password'] },
    });

    if (!userDetails) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(userDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = req.user;
    const { Name, Email, Password } = req.body;

    const hashedPassword = Password ? await bcrypt.hash(Password, 10) : user.Password;

    const updatedUser = await User.update(
      { Name, Email, Password: hashedPassword },
      { where: { UserID: user.UserID } }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: 'Error updating user profile' });
    }

    const updatedUserDetails = await User.findOne({
      where: { UserID: user.UserID },
      attributes: { exclude: ['Password'] },
    });

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUserDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user profile' });
  }
};

const getSubscriptionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const subscription = await SubscriptionType.findOne({
      where: { SubscriptionTypeID: user.SubscriptionTypeID },
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription details not found' });
    }

    res.status(200).json(subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching subscription details' });
  }
};

const upgradeSubscription = async (req, res) => {
  try {
    const user = req.user;
    const { newSubscriptionID } = req.body;

    const newSubscription = await SubscriptionType.findOne({ where: { SubscriptionTypeID: newSubscriptionID } });

    if (!newSubscription) {
      return res.status(400).json({ message: 'Invalid subscription type' });
    }

    await User.update(
      { SubscriptionTypeID: newSubscription.SubscriptionTypeID },
      { where: { UserID: user.UserID } }
    );

    res.status(200).json({ message: 'Subscription upgraded successfully', subscription: newSubscription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error upgrading subscription' });
  }
};

const getUserById = async (req, res) => {
  try {
    const UserID = req.params.id;
    const user = await User.findByPk(UserID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};


const RequestPasswordResetOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { Email: email } });
    if (!user) {
      console.error('User not found:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    user.OTP = otp;
    user.OTPExpiresAt = otpExpiresAt;
    await user.save();

    await sendOtpEmail(email, otp);
    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

// Reset Password using OTP
const ResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ where: { Email: email } });
    if (!user || user.OTP !== otp || new Date() > user.OTPExpiresAt) {
      console.error('Invalid or expired OTP for email:', email);
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.Password = await bcrypt.hash(newPassword, 10);
    user.OTP = null;
    user.OTPExpiresAt = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};


const RequestAccountDeletion = async (req, res) => {
  try {
    const { reason } = req.body;
    const userID = req.user.userID;

    const user = await User.findByPk(userID);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const deletionRequest = await AccountDeletionRequest.create({
      UserID: userID,
      Email: user.Email,
      Reason: reason,
    });

    // Notify admin
    await sendDeletionRequestNotification(deletionRequest);

    res.status(200).json({ message: 'Account deletion request submitted successfully' });
  } catch (error) {
    console.error('Error requesting account deletion:', error);
    res.status(500).json({ message: 'Error requesting account deletion' });
  }
};

module.exports = {
  
  verifyOTP,
  register,
  login,
  logout,
  promoteGuestToRegistered,
  getUserProfile,
  updateUserProfile,
  getSubscriptionDetails,
  upgradeSubscription,
  getUserById,
  getAllUsers,
  RequestPasswordResetOtp,
  ResetPassword,
  RequestAccountDeletion
};
