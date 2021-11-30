const crypto = require('crypto');
const { promisify } = require('util');
const config = require('./../config');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const sendEmail = require('./../utils/email');

const signToken = id => {
	return jwt.sign({ id }, config.JWT, {
		expiresIn: config.JWT_EXPIRE
	});
};

const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);

	const cookieOptions = {
		expires: new Date(Date.now() + config.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
		httpOnly: true
	};

	if(config.ENV === 'production') cookieOptions.secure = true;

	res.cookie('jwt', token, cookieOptions);
	user.password = undefined;

	res.status(statusCode).json({
		status: 'success',
		token,
		data: {
			user
		}
	});
};

exports.signup = catchAsync (async (req, res, next) => {
	const newUser = await User.create(req.body);
	createSendToken(newUser, 201, res);
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
	createSendToken(user, 200, res);
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

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		// Roles is an array accessible to this function
		if(!roles.includes(req.user.role)) {
			return next(new AppError('You do not have permission to perform this action', 403));
		}
		next();
	};
};

exports.forgotPassword = catchAsync (async (req, res, next) => {
	// 1) Get user based on POSTed email
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(new AppError('There is no user with that email address', 404));
	}

	// 2) Generate the random token
	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false });

	// 3) Send it back to the user via email
	const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

	const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

	try {
		await sendEmail({
			email: user.email,
			subject: 'Your password reset token (valid for 10 min)',
			message
		});

		res.status(200).json({
			status: 'success',
			message: 'Token sent to email!'
		});
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		return next(new AppError('There was an error sending the email. Try again later!', 500));
	}
});

exports.resetPassword = catchAsync (async (req, res, next) => {
	// 1) Get user based on Token
	const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

	const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

	// 2) Set the new password if token has not expired and there is an user
	if (!user) {
		return next(new AppError('Token is invalid or has expired', 400));
	}

	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();

	// 3) Update changedPasswordAt property for the user


	// 4) Log the user in, send JWT
	createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync (async (req, res, next) => {
	// 1) Get the user from the collection
	const user = await User.findById(req.user.id).select('+password');

	// 2) Check if the posted password is correct
	if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
		return next(new AppError('Your current password is wrong.', 401));
	}

	// 3) If the password is correct, update the password
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	await user.save();

	// 4) Log user in. Send JWT.
	createSendToken(user, 200, res);
});
