const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const personalInfoSchema = new Schema({
	'userId':Number,
	'userName':String,
	'userType':Number,
	'userMotto':String,
})

module.exports = mongoose.model('personalInfo', personalInfoSchema, 'personalInfos');