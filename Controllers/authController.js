const { promisify } = require('util');
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


exports.protect = catchAsync( async (req, res, next) => {
	let token;

	// First, Get the token and check if its there/exists
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	}

	if (!token) {
		return next(new AppError('You are not logged ing! Please log in to get access.', 401));
	}

	// Validate the token
	const decoded = await promisify(jwt.verify)(token, config.JWT);

	// Check if the user still exists
	const currentUser = await User.findById(decoded.id);
	if (!currentUser) {
		return next(new AppError('The user belonging to this token does not longer exists.', 401));
	}

	// Check if user changed password after the token was issued
	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(new AppError('User recently changed password! Please log in again.', 401));
	}

	req.user = currentUser;
	next();
});
