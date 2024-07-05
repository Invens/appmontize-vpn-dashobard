const { Server, User } = require('../models');

const createServer = async (req, res) => {
    try {
        const newServer = await Server.create(req.body);
        res.status(201).json(newServer);
    } catch (error) {
        console.error(error);
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
        console.error(error);
        res.status(500).json({ message: 'Error fetching server' });
    }
};

const getAllServers = async (req, res) => {
    try {
        const servers = await Server.findAll();
        res.status(200).json(servers);
    } catch (error) {
        console.error(error);
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
        console.error(error);
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
        console.error(error);
        res.status(500).json({ message: 'Error deleting server' });
    }
};

module.exports = { createServer, getServer, getAllServers, updateServer, deleteServer };