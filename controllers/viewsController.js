const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
	// Get tour data from the collection
	const tours = await Tour.find();

	// Build template

	// Render that template using tour data

	res.status(200).render('overview', {
		title: 'All Tours',
		tours
	});
});

exports.getTour = catchAsync(async (req, res, next) => {
	// Get the data for requested tour (including reviews and guides)
	const tour = await Tour.findOne({ slug: req.params.slug }).populate({
		path: 'reviews',
		fields: 'review rating user'
	});

	// Build template

	// Render template using data from data
	res.status(200).render('tour', {
		title: `${tour.name} Tour`,
		tour
	});
});

exports.getSignUpForm = (req, res) => {
	res.status(200).render('signUp', {
		title: 'Create an account'
	});
};

exports.getLoginForm = (req, res) => {
	res.status(200).render('login', {
		title: 'Log into your account'
	});
};
