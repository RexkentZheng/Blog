const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const personalInfoSchema = new Schema({
	'userId':Number,
	'userName':String,
	'userType':Number,
	'userTel':Number,
	'userBirthday':Date,
	'userEmail':String,
	'userHP':String,
	'userMotto':String,
	'userIntroduce':String,
})

module.exports = mongoose.model('personalInfo', personalInfoSchema, 'personalInfos');