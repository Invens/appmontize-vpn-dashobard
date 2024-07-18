const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

const registerAdmin = async (req, res) => {
  try {
    const { Name, Email, Password } = req.body;
    const existingAdmin = await Admin.findOne({ where: { Email } });

    if (existingAdmin) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    const newAdmin = await Admin.create({
      Name,
      Email,
      Password: hashedPassword,
    });

    const token = jwt.sign({ adminID: newAdmin.AdminID }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'Admin registered successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering admin' });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const admin = await Admin.findOne({ where: { Email } });

    if (!admin || !await bcrypt.compare(Password, admin.Password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ adminID: admin.AdminID }, process.env.JWT_SECRET, { expiresIn: '1000h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

module.exports = { registerAdmin, loginAdmin };
