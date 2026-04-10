const mongoose = require('mongoose');

var mongoURL = "mongodb://localhost:27017/myluxestay";

mongoose.connect(mongoURL);

var connection = mongoose.connection;

connection.on('error', () => {
    console.log('MongoDB connection failed');
});

connection.on('connected', () => {
    console.log('MongoDB connection success');
});

module.exports = mongoose;