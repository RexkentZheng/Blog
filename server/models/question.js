const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
	'questionId':Number,
	'questionAuthor':String,
	'questionTitle':String,
	'questionContent':String,
	'questionCreatorName':String,
	'questionCreatedTime':String,
	'like':[],
	'questionAnswers':[
		{
			'answerCreatorName':String,
			'answerContent':String,
			'answerCreatedTime':String,
		}
	]
})

module.exports = mongoose.model('question', questionSchema, 'questions');