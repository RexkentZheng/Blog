const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const messageBoardSchema = new Schema({
	'messageBoardId':Number,
	'messageBoardUserName':String,
	'messageBoardContent':String,
	'messageBoardCreatedTime':String,
	'messageBoardChildren':[{
		'messageBoardUserName':String,
		'messageBoardContent':String,
		'messageBoardCreatedTime':String,
	}]
})

module.exports = mongoose.model('messageBoard', messageBoardSchema, 'messageBoards');