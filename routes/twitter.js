const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated');

const authController = require('../controllers/twitter');

//PUT auth/signup
router.put('/signup', authController.signUp);
router.get('/getUsers', isAuthenticated, authController.getUsers);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPasword);

module.exports = router;