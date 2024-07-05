const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { UserID: decoded.userID, Token: token } });

    if (!user) return res.sendStatus(403);

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.sendStatus(403);
  }
};
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
  
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Assuming the token contains `userID`
      next();
    } catch (ex) {
      res.status(400).json({ message: 'Invalid token.' });
    }
  };
module.exports = { authenticateToken, authMiddleware };
