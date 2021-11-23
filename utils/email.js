const nodemailer = require('nodemailer');
const config = require('./../config');

const sendEmail = async options => {
	// 1) Create a transporter
	const transporter = nodemailer.createTransport({
		host: config.EMAIL_HOST,
		port: config.EMAIL_PORT,
		auth: {
			user: config.EMAIL_USERNAME,
			pass: config.EMAIL_PASSWORD
		}
	});

	// 2) Define the email options
	const mailOptions = {
		from: 'Gerardo Galicia <test@gmail.com>',
		to: options.email,
		subject: options.subject,
		text: options.message,
		// html:
	};

	// 3) Send the email
	await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
