const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const userValidation = require('../validations/userValidation');
const router = express.Router();

// User registration route
router.post('/register', userValidation, registerUser);

// User login route
router.post('/login', loginUser);

module.exports = router;
