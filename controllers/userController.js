const User = require('../models/User');

class UserController {
  static async createUser(req, res) {
    try {
      const userData = req.body;
      const { userName, accountNumber, emailAddress, identityNumber } = userData;

      if (Array.isArray(userData)) {
        res.status(400).json({ 
          status: 'error',
          message: 'Input must be a single object, not an array.',
          code: 400
        });
        return;
      }

      const isUserNameRegistered = await User.findByUserName(userName);
      if (isUserNameRegistered) {
        res.status(409).json({
          status: 'error',
          message: 'Username is already registered.',
          code: 409
        });
        return;
      }

      const isAccountNumberRegistered = await User.findByAccountNumber(accountNumber);
      if (isAccountNumberRegistered) {
        res.status(409).json({
          status: 'error',
          message: 'Account number is already registered.',
          code: 409
        });
        return;
      }

      const isEmailAddressRegistered = await User.findByEmailAddress(emailAddress);
      if (isEmailAddressRegistered) {
        res.status(409).json({
          status: 'error',
          message: 'Email address is already registered.',
          code: 409
        });
        return;
      }

      const isIdentityNumberRegistered = await User.findByIdentityNumber(identityNumber);
      if (isIdentityNumberRegistered) {
        res.status(409).json({
          status: 'error',
          message: 'Identity number is already registered.',
          code: 409
        });
        return;
      }
      
      const newUser = new User(userName, accountNumber, emailAddress, identityNumber);
      const createdUser = await User.create(newUser);
      res.status(201).json({
        status: 'success',
        message: 'User created successfully.',
        data: createdUser
      });
    } catch (error) {
      res.status(500).json({ 
        status: 'error',
        message: 'An unexpected error occurred while creating the user. Please try again later.',
        code: 500
      });
    }
  }

  static async getUserByUserName(req, res) {
    try {
      const { userName } = req.params;
      const user = await User.findByUserName(userName);
      if (user) {
        res.status(200).json({
          status: 'success',
          message: 'User data by username fetched successfully.',
          data: user
        });
      } else {
        res.status(404).json({ 
          status: 'error',
          message: 'User not found. The user with the given username does not exist.',
          code: 404
        });
      }
    } catch (error) {
      res.status(500).json({ 
        status: 'error',
        message: 'An unexpected error occurred while fetching the user. Please try again later.',
        code: 500
      });
    }
  }

  static async getUserByAccountNumber(req, res) {
    try {
      const { accountNumber } = req.params;
      const user = await User.findByAccountNumber(accountNumber);
      if (user) {
        res.status(200).json({
          status: 'success',
          message: 'User data by account number fetched successfully.',
          data: user
        });
      } else {
        res.status(404).json({ 
          status: 'error',
          message: 'User not found. The user with the given account number does not exist.',
          code: 404
        });
      }
    } catch (error) {
      res.status(500).json({ 
        status: 'error',
        message: 'An unexpected error occurred while fetching the user. Please try again later.',
        code: 500
      });
    }
  }

  static async getUserByEmailAddress(req, res) {
    try {
      const { emailAddress } = req.params;
      const user = await User.findByEmailAddress(emailAddress);
      if (user) {
        res.status(200).json({
          status: 'success',
          message: 'User data by email address fetched successfully.',
          data: user
        });
      } else {
        res.status(404).json({ 
          status: 'error',
          message: 'User not found. The user with the given email address does not exist.',
          code: 404
        });
      }
    } catch (error) {
      res.status(500).json({ 
        status: 'error',
        message: 'An unexpected error occurred while fetching the user. Please try again later.',
        code: 500
      });
    }
  }

  static async getUserByIdentityNumber(req, res) {
    try {
      const { identityNumber } = req.params;
      const user = await User.findByIdentityNumber(identityNumber);
      if (user) {
        res.status(200).json({
          status: 'success',
          message: 'User data by identity number fetched successfully.',
          data: user
        });
      } else {
        res.status(404).json({ 
          status: 'error',
          message: 'User not found. The user with the given identity number does not exist.',
          code: 404
        });
      }
    } catch (error) {
      res.status(500).json({ 
        status: 'error',
        message: 'An unexpected error occurred while fetching the user. Please try again later.',
        code: 500
      });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const users = await User.getAllUsers();
      res.status(200).json({
        status: 'success',
        message: 'All users data fetched successfully.',
        data: users
      });
    } catch (error) {
      res.status(500).json({ 
        status: 'error',
        message: 'An unexpected error occurred while fetching the user. Please try again later.',
        code: 500
      });
    }
  }

  static async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const updatedData = req.body;
      const isUpdated = await User.update(userId, updatedData);
      if (isUpdated) {
        res.status(200).json({
          status: 'success',
          message: 'User updated successfully.',
          data: updatedData
        });
      } else {
        res.status(404).json({ 
          status: 'error',
          message: 'User not found. The user with the given ID does not exist.',
          code: 404
        });
      }
    } catch (error) {
      res.status(500).json({ 
        status: 'error',
        message: 'An unexpected error occurred while updating the user. Please try again later.',
        code: 500
      });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { userId } = req.params;
      const isDeleted = await User.delete(userId);
      if (isDeleted) {
        res.status(200).json({
          status: 'success',
          message: 'User deleted successfully.'
        });
      } else {
        res.status(404).json({ 
          status: 'error',
          message: 'User not found. The user with the given ID does not exist.',
          code: 404
        });
      }
    } catch (error) {
      res.status(500).json({ 
        status: 'error',
        message: 'An unexpected error occurred while deleting the user. Please try again later.',
        code: 500
      });
    }
  }
}

module.exports = UserController;