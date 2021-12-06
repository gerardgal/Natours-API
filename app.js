const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// 1) Global Middlewares

// Security HTTP headers
app.use(helmet());

// Development logging
console.log('Current enviroment:', config.ENV);
if(config.ENV === 'development') {
	app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests from this IP, please try again in an hour.'
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));

// Data sanitization
app.use(mongoSanitize());
app.use(xss());

// Parameter pollution protection
app.use(hpp({
	whitelist: [
		'duration',
		'ratingsQuantity',
		'ratingsAverage',
		'maxGroupSize',
		'difficulty',
		'price']
}));

// Serving static files
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Test middleware
app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

/////////////////// ROUTING ////////////////////

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
