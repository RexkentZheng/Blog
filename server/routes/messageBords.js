const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const hello = require('./../utils/userIdCreator.js');
const MessageBords = require('../models/messageBoard');

require('./../utils/dateFormater');

function getWrong(res, err) {
  return res.json({
    status: 1,
    msg: err.message,
    result: '',
  });
}

function getRight(res, doc) {
  return res.json({
    status: 0,
    msg: '',
    result: doc,
  });
}

//新建留言
router.post('/create',(req,res,next)=>{
  let { messageBoardUserName, messageBoardContent } = req.body;
  MessageBords.findOne({}).sort({
    questionId: -1,
  }).limit(1).exec((err, doc) => {
    if (doc !== null) {
      const maxDate = parseFloat(doc.userId);
      const messageId = hello.createUserId(maxDate, 5);
      MessageBords.create({
        'messageBoardId':messageId,
        'messageBoardUserName':messageBoardUserName,
        'messageBoardContent':messageBoardContent,
        'messageBoardCreatedTime': new Date().Format('yyyy-MM-dd hh:mm'),
        'messageBoardChildren':[]
      },(err,doc)=>{
        if (err) {
          getWrong(res,err);
        } else {
          getRight(res,doc);
        }
      })
    }else{
      const messageId = hello.createUserId(00000000000000, 5);
      MessageBords.create({
        'messageBoardId':messageId,
        'messageBoardUserName':messageBoardUserName,
        'messageBoardContent':messageBoardContent,
        'messageBoardCreatedTime': new Date().Format('yyyy-MM-dd hh:mm'),
        'messageBoardChildren':[]
      },(err,doc)=>{
        if (err) {
          getWrong(res,err);
        } else {
          getRight(res,doc);
        }
      })
    }
  })
})

//获取全部留言
router.post('/list',(req,res,next)=>{
  MessageBords.find({},(err,doc)=>{
    if (err) {
      getWrong(res,err);
    } else {
      getRight(res,doc);
    }
  })
})

//回复留言
router.post('/reply',(req,res,next)=>{
  let {messageBoardUserName, messageBoardContent, _id} = req.body;
  MessageBords.update({
    _id
  },{
    $addToSet:{
      'messageBoardChildren':{
        'messageBoardUserName':messageBoardUserName,
        'messageBoardContent':messageBoardContent,
        'messageBoardCreatedTime': new Date().Format('yyyy-MM-dd hh:mm'),
      }
    }
  },(err,doc)=>{
    if (err) {
      getWrong(res,err);
    } else {
      getRight(res,doc);
    }
  })
})

//删除留言
router.post('/del',(req,res,next)=>{
  let { _id } = req.body;
  MessageBords.remove({
    _id
  },(err,doc)=>{
    if (err) {
      getWrong(res,err);
    } else {
      getRight(res,doc);
    }
  })
})
module.exports = router;