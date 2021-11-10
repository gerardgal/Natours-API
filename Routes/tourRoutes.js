const express = require('express');
const tourController = require('./../Controllers/tourController');
const authController = require('./../Controllers/authController');

const router = express.Router();
//!! It is a convention to call it just router.

// router.param('id', tourController.checkID);

router
	.route('/top-5-cheap')
	.get(tourController.aliasTopTours, tourController.getAllTours);

router
	.route('/tour-stats')
	.get(tourController.getTourStats);

router
	.route('/monthly-plan/:year')
	.get(tourController.getMonthlyPlan);

router
	.route('/')
	.get(authController.protect, tourController.getAllTours)
	.post(tourController.createTour);

router
	.route('/:id')
	.get(tourController.getTour)
	.patch(tourController.updateTour)
	.delete(tourController.deleteTour);

module.exports = router;
