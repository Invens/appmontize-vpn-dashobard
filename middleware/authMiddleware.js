const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { UserID: decoded.userID, Token: token } });

    if (!user) {
      return res.status(403).json({ message: 'Access denied. Invalid token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: 'Invalid token.' });
  }
};

module.exports = { authenticateToken };
