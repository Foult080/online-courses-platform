require('dotenv').config();
const mongoose = require('mongoose');

// get url for connection
const db = process.env.DB_HOST;

/**
 * Connect to db function
 */
const ConnectDB = async () => {
	try {
		mongoose.connect(db, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('MongoDB connected');
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
};

module.exports = ConnectDB;
