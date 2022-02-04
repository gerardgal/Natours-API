const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const config = require('./../config');

module.exports = class Email {
	constructor(user, url) {
		this.to = user.email;
		this.firstName = user.name.split(' ')[0];
		this.url = url;
		this.from = `Gerardo Galicia <${config.EMAIL_FROM}>`;
	}

	newTransport() {
		if(config.ENV === 'production') {
			// Sendgrid
		}

		return nodemailer.createTransport({
			host: config.EMAIL_HOST,
			port: config.EMAIL_PORT,
			auth: {
				user: config.EMAIL_USERNAME,
				pass: config.EMAIL_PASSWORD
			}
		});
	};

	async send(template, subject) {
		// Sending the email
		const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
			firstName: this.firstName,
			url: this.url,
			subject
		});

		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text: htmlToText.fromString(html)
		};

		await this.newTransport().sendMail(mailOptions);
	};

	async sendWelcome() {
		await this.send('welcome', 'Welcome to Natours!');
	};

	async sendPasswordReset() {
		await this.send('passwordReset', 'Your password reset token');
	};
};
