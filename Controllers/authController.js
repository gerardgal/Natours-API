const config = require('./../config');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const signToken = id => {
	return jwt.sign({ id }, config.JWT, {
		expiresIn: config.JWT_EXPIRE
	});
};

exports.signup = catchAsync (async (req, res, next) => {
	const { name, email, password, passwordConfirm } = req.body;

	const newUser = await User.create({
		name,
		email,
		password,
		passwordConfirm
	});

	const token = signToken(newUser._id);

	res.status(201).json({
		status: 'success',
		token,
		data: {
			user: newUser
		}
	});
});

exports.login = catchAsync( async (req, res, next) => {
	const { email, password } = req.body;

	// Check if email/password exists
	if(!email || !password) {
		return next(new AppError('Please provide your email and password!', 400));
	}

	// Check if the user exists && password is correct
	const user = await User.findOne({ email }).select('+password');

	if(!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError('Incorrect email or password', 401));
	}

	// If everything is okay, send token to client
	const token = signToken(user._id);

	res.status(200).json({
		status: 'success',
		token,
	});
});
