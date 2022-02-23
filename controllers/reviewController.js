const Review = require('./../models/reviewModel');
const service = require('./handlerService');

exports.setTourUserIds = (req, res, next) => {
	if(!req.body.tour) req.body.tour = req.params.tourId;
	if(!req.body.user) req.body.user = req.user.id;
	next();
};

exports.getReview = service.getOne(Review);
exports.getAllReviews = service.getAll(Review);
exports.createReview = service.createOne(Review);
exports.updateReview = service.updateOne(Review);
exports.deleteReview = service.deleteOne(Review);
