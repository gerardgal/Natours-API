const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
	review: {
		type: String,
		required: [true, 'Please tell us your review']
	},
	rating: {
		type: Number,
		required: [true, 'A review must have a rating!'],
		min: 1,
		max: 5
	},
	createdAt: {
		type: Date,
		default: Date.now(),
		select: false
	},
	tour:
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Tour',
			required: [true, 'Review must belong to a tour']
		},
	user:
		{
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'Review must belong to a user']
		}
},
{
	toJSON: { virtuals: true },
	toObject: { virtuals: true }
});

reviewSchema.pre(/^find/, function(next) {
	this.populate({
		path: 'user',
		select: 'name photo'
	});

	next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;