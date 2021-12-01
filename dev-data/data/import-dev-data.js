const fs = require('fs');
const config = require('./../../config');
const mongoose = require('mongoose');
const Tour = require('./../../models/tourModel');

const DB = config.DATABASE;

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

// READING THE JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
	try {
		await Tour.create(tours);
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
		console.log('Data successfully deleted!');
	} catch(err) {
		console.log(err);
	}
	process.exit();
};

if(process.argv[2] === '--import') {
	importData();
} else if (process.argv[2] === '--delete') {
	deleteData();
}

console.log(process.argv);
