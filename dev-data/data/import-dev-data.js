const fs = require('fs');
const config = require('./../../config');
const mongoose = require('mongoose');
const Tour = require('./../../models/tourModel');
const Review = require('./../../models/reviewModel');
const User = require('./../../models/userModel');

const DB = config.DATABASE;

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

// READING THE JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
	try {
		await Tour.create(tours);
		await User.create(users, { validateBeforeSave: false });
		await Review.create(reviews);
		console.log('Data successfully loaded!');
	} catch(err) {
		console.log(err);
	}
	process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
	try {
		await Tour.deleteMany();
		await User.deleteMany();
		await Review.deleteMany();
		console.log('Data successfully deleted!');
	} catch(err) {
		console.log(err);
	}
	process.exit();
};

if(process.argv[2] === '-i') {
	importData();
} else if (process.argv[2] === '-d') {
	deleteData();
}
