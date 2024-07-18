const jwt = require('jsonwebtoken');
const { Server, User } = require('../models');

const getServersBySubscription = async (req, res) => {
  try {
    const userToken = req.headers.authorization.split(' ')[1];
    console.log('User Token:', userToken); // Debugging
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Debugging

    const user = await User.findOne({ where: { UserID: decoded.userID } });
    console.log('User Found:', user); // Debugging

    let servers;
    if (user) {
      if (user.SubscriptionTypeID === 1) {
        servers = await Server.findAll({ where: { ServerType: 'Free' } });
      } else {
        servers = await Server.findAll();
      }
    } else {
      servers = await Server.findAll({ where: { ServerType: 'Free' } });
    }

    res.status(200).json(servers);
  } catch (error) {
    console.error('Error fetching servers by subscription:', error);
    res.status(500).json({ message: 'Error fetching servers' });
  }
};

const createServer = async (req, res) => {
  try {
    const newServer = await Server.create(req.body);
    res.status(201).json(newServer);
  } catch (error) {
    console.error('Error creating server:', error);
    res.status(500).json({ message: 'Error creating server' });
  }
};

const getServer = async (req, res) => {
  try {
    const serverID = req.params.serverID;
    const server = await Server.findByPk(serverID);
    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }
    res.status(200).json(server);
  } catch (error) {
    console.error('Error fetching server:', error);
    res.status(500).json({ message: 'Error fetching server' });
  }
};

const getAllServers = async (req, res) => {
  try {
    const servers = await Server.findAll();
    res.status(200).json(servers);
  } catch (error) {
    console.error('Error fetching servers:', error);
    res.status(500).json({ message: 'Error fetching servers' });
  }
};

const updateServer = async (req, res) => {
  try {
    const serverID = req.params.serverID;
    const [updated] = await Server.update(req.body, {
      where: { ServerID: serverID }
    });
    if (!updated) {
      return res.status(404).json({ message: 'Server not found' });
    }
    const updatedServer = await Server.findByPk(serverID);
    res.status(200).json(updatedServer);
  } catch (error) {
    console.error('Error updating server:', error);
    res.status(500).json({ message: 'Error updating server' });
  }
};

const deleteServer = async (req, res) => {
  try {
    const serverID = req.params.serverID;
    const deleted = await Server.destroy({
      where: { ServerID: serverID }
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Server not found' });
    }
    res.status(204).json({ message: 'Server deleted' });
  } catch (error) {
    console.error('Error deleting server:', error);
    res.status(500).json({ message: 'Error deleting server' });
  }
};

module.exports = {
  getServersBySubscription,
  createServer,
  getServer,
  getAllServers,
  updateServer,
  deleteServer
};
