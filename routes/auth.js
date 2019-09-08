const router = require('express').Router();
const { body } = require('express-validator/check');
const authController = require('../controllers/auth');
const User = require('../models/User');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

router.post('/signup',
  [
    body('username')
      .withMessage('Please enter a valid username.')
      .custom((value, { req }) => {
        return User.findOne({ username: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('Username address already exists!');
          }
        })
      }),
    body('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Please enter a valid password.'),
    body('firstName')
      .trim()
      .isLength({ min: 4 })
      .withMessage('First Name must be at least 4 characters long.'),
    body('lastName')
      .trim()
      .isLength({ min: 4 })
      .withMessage('Last Name must be at least 4 characters long.'),
  ]
  , authController.signUp);
router.post('/register',
  [
    body('username')
      .withMessage('Please enter a valid username.')
      .custom((value, { req }) => {
        return User.findOne({ username: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('Username address already exists!');
          }
        })
      }),
    body('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Please enter a valid password.'),
    body('firstName')
      .trim()
      .isLength({ min: 4 })
      .withMessage('First Name must be at least 4 characters long.'),
    body('lastName')
      .trim()
      .isLength({ min: 4 })
      .withMessage('Last Name must be at least 4 characters long.'),
  ]
  ,isAuth,isAdmin, authController.registerMechanic);
router.post('/signin', authController.signIn);


module.exports = router;
