const { GuestUser } = require('../models');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const registerGuest = async (req, res) => {
  try {
    const { DeviceID } = req.body;
    
    // Check if the guest user already exists
    let guestUser = await GuestUser.findOne({ where: { DeviceID } });

    if (!guestUser) {
      // If not, create a new guest user
      const username = `Guest_${uuidv4().slice(0, 8)}`;
      const token = jwt.sign({ deviceID: DeviceID }, process.env.JWT_SECRET, { expiresIn: '365d' });

      guestUser = await GuestUser.create({ DeviceID, Username: username, Token: token });
    }

    // Return the token and other necessary information
    res.status(200).json({ 
      message: 'Guest user registered successfully', 
      guestUserID: guestUser.GuestUserID, 
      token: guestUser.Token 
    });
  } catch (error) {
    console.error('Error registering guest user:', error);
    res.status(500).json({ message: 'Error registering guest user' });
  }
};



const getGuestUserDetails = async (req, res) => {
  try {
    const guestUser = req.guestUser;
    res.status(200).json(guestUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching guest user details' });
  }
};

module.exports = { registerGuest, getGuestUserDetails };
