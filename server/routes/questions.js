const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const hello = require('./../utils/userIdCreator.js');
const Question = require('../models/question');

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

//创建文章
router.post('/create',(req,res,next)=>{
  let { author, title, content } = req.body;
  Question.findOne({}).sort({
    questionId: -1,
  }).limit(1).exec((err, doc) => {
    if (doc !== null) {
      const maxDate = parseFloat(doc.userId);
      const questionId = hello.createUserId(maxDate, 4);
      Question.create({
        'questionId':questionId,
        'questionAuthor':author,
        'questionTitle':title,
        'questionContent':content,
        'questionCreatedTime': new Date().Format('yyyy-MM-dd hh:mm'),
        'like':[],
        'questionAnswers':[
          {
            'answerCreatorName':'String',
            'answerContent':'String',
            'answerCreatedTime':'String'
          }
        ]
      },(err,doc)=>{
        if (err) {
          getWrong(res, err);
        } else {
          getRight(res, doc);
        }
      })    
    }else{
      const questionId = hello.createUserId(00000000000000, 4);
      Question.create({
        'questionId':questionId,
        'questionAuthor':author,
        'questionTitle':title,
        'questionContent':content,
        'questionCreatedTime': new Date().Format('yyyy-MM-dd hh:mm'),
        'like':[],
        'questionAnswers':[
          {
            'answerCreatorName':'String',
            'answerContent':'String',
            'answerCreatedTime':'String'
          }
        ]
      },(err,doc)=>{
        if (err) {
          getWrong(res, err);
        } else {
          getRight(res, doc);
        }
      })    
    }
  })
})

//问答列表接口
router.post('/list',(req,res,next)=>{
  let { questionAuthor } = req.body;
  Question.find({
    questionAuthor
  },(err,doc)=>{
    if (err) {
      getWrong(res,err);
    } else {
      getRight(res,doc);
    }
  })
})

//问答详情
router.post('/details',(req,res,next)=>{
  let { questionId } = req.body;
  Question.findOne({
    _id:questionId
  },(err,doc)=>{
    if (err) {
      getWrong(res,err);
    } else {
      getRight(res,doc);
    }
  })
})

//修改问答
router.post('/update',(req,res,next)=>{
  let { _id, questionTitle, questionContent } = req.body;
  Question.update({
    _id
  },{
    'questionTitle':questionTitle,
    'questionContent':questionContent,
  },(err,doc)=>{
    if (err) {
      getWrong(res,err);
    } else {
      getRight(res,doc);
    }
  })
})

//获取全部问答
router.post('/all',(req,res,next)=>{
  Question.find({},(err,doc)=>{
    if (err) {
      getWrong(res,err);
    } else {
      getRight(res,doc);
    }
  })
})
module.exports = router;