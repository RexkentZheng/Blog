const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
	'articleId':Number,
	'articleAuthor':String,
	'articleTitle':String,
	'articleContent':String,
	'articleCreatedTime':String,
	'like':[],
	'comments':[
		{
			'commentUserName':String,
			'commentContent':String,
			'commentTime':String
		}
	]
})

module.exports = mongoose.model('article', articleSchema, 'articles');