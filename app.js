const express = require('express');
const morgan = require('morgan');
const config = require('./config');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) Middlewares
console.log(config.ENV);
if(config.ENV === 'development') {
	app.use(morgan('dev'));
}

// This is the middleware. Is in the middle of the req and res.
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

//Useful method when testing middleware.
app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

/////////////////// ROUTING ////////////////////

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
