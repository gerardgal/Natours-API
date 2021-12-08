const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const service = require('./handlerService');

const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach(el => {
		if(allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};

exports.getMe = (req, res, next) => {
	req.params.id = req.user.id;
	next();
};

exports.updateMe = catchAsync (async (req, res, next) => {
	// 1) Create an error if user tries to update password
	if (req.body.password || req.body.passwordConfirm) {
		return next(new AppError('This route is not for password updates. Please use /updateMyPassword', 400));
	}

	// Filtered unwanted field names that are not allowed to be updated
	const filteredBody = filterObj(req.body, 'name', 'email');

	// 2) Update the user document
	const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });

	res.status(200).json({
		status: 'success',
		data: {
			user: updatedUser
		}
	});
});

exports.deleteMe = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, { active: false });

	res.status(204).json({
		status: 'success',
		data: null
	});
});

exports.getUser = service.getOne(User);
exports.getAllUsers = service.getAll(User);

exports.createUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not defined! Please use /signup'
	});
};

exports.updateUser = service.updateOne(User);
exports.deleteUser = service.deleteOne(User);
