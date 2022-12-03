const app = require('./app');
const mongoose = require('mongoose');
const config = require('./config');

process.on('uncaughtException', err => {
	console.log('UNCAUGHT EXCEPTION! Shutting down...');
	console.log(err.name, err.message);
	process.exit(1);
});

const port = config.PORT || 8000;
const DB = config.DATABASE;

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(DB);
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
}

connectDB()
	.then(() => {
    	app.listen(port, () => {
        	console.log(`App running on port ${port}...`);
    	});
	})
	.catch(error => console.log('ERROR' + err.stack));

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
