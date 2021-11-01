const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please tell us your name!']
	},
	email: {
		type: String,
		required: [true, 'An email must be provided'],
		unique: true,
		lowecase: true,
		validate: [validator.isEmail, 'Please provide a valid email']
	},
	photo: String,
	password: {
		type: String,
		required: [true, 'Please provide a password'],
		minlength: 8
	},
	passwordConfirm: {
		type: String,
		required: [true, 'Please confirm your password'],
		validate: {
			// ONLY VALID on save
			validator: function (el) {
				return el === this.password;
			},
			message: 'Incorrect password!'
		}
	}

});

userSchema.pre('save', async function(next) {
	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
