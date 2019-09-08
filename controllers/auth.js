const { validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const encryption = require('../util/encryption');


function validateUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      message: 'Validation failed, entered data is incorrect',
      errors: errors.array()
    });
    return false;
  }

  return true;
}

module.exports = {
  signUp: async (req, res, next) => {
    try {
      if (validateUser(req, res)) {
        const { username, password, firstName, lastName } = req.body;
        const salt = encryption.generateSalt();
        const hashedPassword = encryption.generateHashedPassword(salt, password);
        let roles = ['User']
        let user = await User.create({
          username,
          hashedPassword,
          firstName,
          lastName,
          salt,
          roles
        })
        res.status(201)
          .json({ message: 'User created!', userId: user._id, username: user.username });
      }
    }
    catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error)
    }
  },
  registerMechanic: async (req, res, next) => {
    try {
      if (validateUser(req, res)) {
        const { username, password, firstName, lastName } = req.body;
        const salt = encryption.generateSalt();
        const hashedPassword = encryption.generateHashedPassword(salt, password);
        let roles = ['Mechanic']
        let user = await User.create({
          username,
          hashedPassword,
          firstName,
          lastName,
          salt,
          roles
        })
        res.status(201)
          .json({ message: 'User created!', userId: user._id, username: user.username });
      }
    }
    catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error)
    }
  },
  signIn: async (req, res, next) => {
    try {
      const { username, password } = req.body;

      let user = await User.findOne({ username })
      if (!user) {
        const error = new Error('Username doesnt exist');
        error.statusCode = 401;
        throw error;
      }
      if (!user.authenticate(password)) {
        const error = new Error('Incorrect password');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign({
        username: user.username,
        userId: user._id.toString(),
        roles: user.roles
      }
        , 'somesupersecret'
        , { expiresIn: '1h' });

      res.status(200).json(
        {
          message: 'User successfully logged in!',
          token,
          userId: user._id.toString(),
          username: user.username,
          isa: user.roles.indexOf('Admin') != -1,
          ism: user.roles.indexOf('Mechanic') != -1
        });


    }
    catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
}