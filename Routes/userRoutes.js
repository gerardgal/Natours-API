const express = require('express');
const userController = require('./../Controllers/userController.js');
const authController = require('./../Controllers/authController.js');

const router = express.Router();

// This one doesn't follow the REST philosophy but its okay.
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router
	.route('/')
	.get(userController.getAllUsers)
	.post(userController.createUser);

router
	.route('/:id')
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

module.exports = router;
