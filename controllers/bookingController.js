const stripe = require('stripe')(process.env.STRIPE_KEY);
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const service = require('./handlerService');
const AppError = require('./../utils/appError');
const config = require('./../config');

exports.getCheckoutSession = catchAsync(await (req, res, next) => {
  // Get the Tour ID
  const tour = await Tour.findById(req.params.tourId);

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: ['https://realURL.something/img/someID'], // Edit this @Production
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1
      }
    ]
  });

  // Send it to the client
  res.status(200).json({
    status: 'success',
    session
  });
});
