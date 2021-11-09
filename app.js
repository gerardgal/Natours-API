const express = require('express');
const morgan = require('morgan');
const config = require('./config');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./Controllers/errorController');
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');

const app = express(); //Adding methods to app variable.

// 1) Middlewares
console.log(config.ENV);
if(config.ENV === 'development') {
	app.use(morgan('dev'));
}

// This is the middleware. Is in the middle of the req and res.
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

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
