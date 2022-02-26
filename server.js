const mongoose = require('mongoose');
const config = require('./config');

process.on('uncaughtException', err => {
	console.log('UNCAUGHT EXCEPTION! Shutting down...');
	console.log(err.name, err.message);
	process.exit(1);
});

const app = require('./app');
const DB = config.DATABASE;

mongoose.connect(DB)
	.then(() => console.log('DB connection successful!'))
	.catch(err=>console.log('ERROR' + err.stack));

const port = config.PORT || 8000;
const server = app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
	console.log('There was an unhandled rejection. Shutting down...');
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});

process.on('SIGTERM', () => {
	console.log('SIGTERM RECEIVED. Shutting down gracefully');
	server.close(() => {
		console.log('*** Process terminated!');
	});
});
