const { body } = require('express-validator');

module.exports = [
  body('username')
    .notEmpty().withMessage('UserName is required')
    .isLength({ min: 3 }).withMessage('UserName must be at least 3 characters')
    .isLength({ max: 50 }).withMessage('UserName must be less than 50 characters'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];
