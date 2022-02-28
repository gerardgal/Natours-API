require('dotenv').config();

module.exports = {
	ENV: process.env.NODE_ENV,
	PORT: process.env.PORT,
	DATABASE: process.env.DATABASE,
	JWT: process.env.JWT_SECRET,
	JWT_EXPIRE: process.env.JWT_EXPIRES_IN,
	JWT_COOKIE_EXPIRE: process.env.JWT_COOKIE_EXPIRES_IN,
	EMAIL_HOST: process.env.EMAIL_HOST,
	EMAIL_PORT: process.env.EMAIL_PORT,
	EMAIL_USERNAME: process.env.EMAIL_USERNAME,
	EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
	EMAIL_FROM: process.env.EMAIL_FROM,
	SENDGRID_USER: process.env.SENDGRID_USER,
	SENDGRID_PASSWORD: process.env.SENDGRID_PASSWORD,
	STRIPE_SECRET: process.env.STRIPE_WEBHOOK_SECRET
};
