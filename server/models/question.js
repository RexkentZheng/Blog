const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
	'questionId':Number,
	'questionAuthor':String,
	'questionTitle':String,
	'questionContent':String,
	'questionCreatedTime':String,
	'like':[],
	'questionAnswers':[
		{
			'answerAuthor':String,
			'answerContent':String,
			'answerCreatedTime':String,
			'answerChildren':[{
				'commentUserName':String,
				'commentContent':String,
				'commentCreatedTime':String,
			}]
		}
	]
})

module.exports = mongoose.model('question', questionSchema, 'questions');