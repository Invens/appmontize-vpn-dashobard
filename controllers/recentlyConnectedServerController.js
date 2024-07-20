// controllers/recentlyConnectedServerController.js

const RecentlyConnectedServer = require('../models/recentlyConnectedServer');

const addRecentlyConnectedServer = async (req, res) => {
  try {
    const { serverName, connectionTime, dataUsed } = req.body;
    const userId = req.user.userID;

    const newServer = await RecentlyConnectedServer.create({
      userId,
      serverName,
      connectionTime,
      dataUsed,
    });

    res.status(201).json(newServer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding recently connected server' });
  }
};

const getRecentlyConnectedServers = async (req, res) => {
  try {
    const userId = req.user.userID;
    const servers = await RecentlyConnectedServer.findAll({ where: { userId } });

    res.status(200).json(servers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching recently connected servers' });
  }
};

module.exports = {
  addRecentlyConnectedServer,
  getRecentlyConnectedServers,
};
