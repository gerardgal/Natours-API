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

exports.getTour = catchAsync(async (req, res) => {
	// Get the data for requested tour (including reviews and guides)
	const tour = await Tour.findOne({ slug: req.params.slug }).populate({
		path: 'reviews',
		fields: 'review rating user'
	});

	// Build template

	// Render template using data from data
	res.status(200).render('tour', {
		title: 'The Forest Hiker Tour',
		tour
	});
});
