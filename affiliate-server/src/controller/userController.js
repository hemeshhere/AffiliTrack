const bcrypt = require('bcryptjs');
const { USER_ROLES } = require('../constants/userConstants');
const Users = require('../model/Users');
const send = require('../service/emailService');

const generateTemporaryPassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';

  for (let i = 0; i < 6; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
};

const userController = {
  // CREATE USER
  create: async (req, res) => {
    try {
      const { name, email, role } = req.body;

      if (!USER_ROLES.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }

      const temporaryPassword = generateTemporaryPassword();
      const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

      const user = await Users.create({
        name,
        email,
        password: hashedPassword,
        role,
        adminId: req.user.id,
      });

      try {
        await send(
          email,
          'Affiliate++ Temporary Password',
          `Your temporary password is ${temporaryPassword}`
        );
      } catch (emailError) {
        console.error('Email error:', emailError);
      }

      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // GET ALL USERS
  getAll: async (req, res) => {
    try {
      const users = await Users.find({ adminId: req.user.id });
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // UPDATE USER
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, role } = req.body;

      if (role && !USER_ROLES.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }

      const user = await Users.findOne({
        _id: id,
        adminId: req.user.id,
      });

      if (!user) {
        return res.status(404).json({ message: 'User does not exist' });
      }

      if (name) user.name = name;
      if (role) user.role = role;

      await user.save();
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // DELETE USER
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await Users.findOneAndDelete({
        _id: id,
        adminId: req.user.id,
      });

      if (!user) {
        return res.status(404).json({ message: 'User does not exist' });
      }

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = userController;
