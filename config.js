require('dotenv').config();

module.exports = {
	ENV: process.env.NODE_ENV,
	PORT: process.env.PORT,
	DATABASE: process.env.DATABASE,
	JWT: process.env.JWT_SECRET,
	JWT_EXPIRE: process.env.JWT_EXPIRES_IN,
};
