const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
	'articleId':Number,
	'articleAuthor':String,
	'articleTitle':String,
	'articleIntroduce':String,
	'articleContent':String,
	'articleFirstTag':String,
	'articleSecondTag':String,
	'articleCreatedTime':String,
	'like':[],
	'comments':[
		{
			'commentUserName':String,
			'commentContent':String,
			'commentCreatedTime':String,
			'commentChildren':[{
				'commentUserName':String,
				'commentContent':String,
				'commentCreatedTime':String,
			}]
		}
	]
})

module.exports = mongoose.model('article', articleSchema, 'articles');