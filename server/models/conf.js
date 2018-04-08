const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const confSchema = new Schema({
	'articleTag':[
		{
			'tagName':String,
			'tagChild':[]
		}
	]
})

module.exports = mongoose.model('conf', confSchema, 'conf');