const express = require('express');
const router = express.Router();
// Import the controller functions from the sibling directory
const userController = require('../controllers/userControllers');

// @route   POST api/users/signup
// @desc    Register a new user (Rider or Driver)
// @access  Public
// This route uses the signupUser function from the controller
router.post('/signup', userController.signupUser);

// @route   POST api/users/login
// @desc    Authenticate user & get token (login)
// @access  Public
// This route uses the loginUser function from the controller
router.post('/login', userController.loginUser); 

module.exports = router;