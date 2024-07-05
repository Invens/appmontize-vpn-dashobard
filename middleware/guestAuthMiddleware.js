const jwt = require('jsonwebtoken');
const { GuestUser } = require('../models');

const authenticateGuestToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const guestUser = await GuestUser.findOne({ where: { DeviceID: decoded.deviceID, Token: token } });

    if (!guestUser) return res.sendStatus(403);

    req.guestUser = guestUser;
    next();
  } catch (error) {
    console.error(error);
    res.sendStatus(403);
  }
};

module.exports = { authenticateGuestToken };
