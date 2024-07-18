const jwt = require('jsonwebtoken');
const { User, Admin } = require('../models');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT:', decoded); // Debugging line to check decoded token

    // Check in User model
    let user = await User.findOne({ where: { UserID: decoded.userID, Token: token } });
    if (!user) {
      // If not found in User, check in Admin model
      user = await Admin.findOne({ where: { AdminID: decoded.userID, Token: token } });
      if (!user) {
        return res.status(403).json({ message: 'Access denied. Invalid token.' });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(403).json({ message: 'Invalid token.' });
  }
};

module.exports = { authenticateToken };
