const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	"userName": String,
	"userPwd": String,
	"userType": Number,
	"userId": Number,
})

module.exports = mongoose.model('user', userSchema, 'users');