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

//创建问答
router.post('/create',(req,res,next)=>{
  let { author, title, introduce, content, questionFirstTag, questionSecondTag } = req.body;
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
        'questionFirstTag':questionFirstTag,
        'questionSecondTag':questionSecondTag,
        'questionIntroduce':introduce,
        'questionContent':content,
        'questionCreatedTime': new Date().Format('yyyy-MM-dd hh:mm'),
        'like':[],
        'questionAnswers':[]
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
        'questionFirstTag':questionFirstTag,
        'questionSecondTag':questionSecondTag,
        'questionIntroduce':introduce,
        'questionContent':content,
        'questionCreatedTime': new Date().Format('yyyy-MM-dd hh:mm'),
        'like':[],
        'questionAnswers':[]
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
  let { _id, questionTitle, questionIntroduce, questionContent, questionFirstTag, questionSecondTag } = req.body;
  Question.update({
    _id
  },{
    questionTitle,
    questionIntroduce,
    questionContent,
    questionFirstTag,
    questionSecondTag
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
  Question.find({},'questionAuthor questionTitle questionIntroduce like questionFirstTag questionSecondTag questionCreatedTime',(err,doc)=>{
    if (err) {
      getWrong(res,err);
    } else {
      getRight(res,doc);
    }
  })
})

//问答点赞
router.post('/support',(req,res,next)=>{
  let { _id, userName } = req.body;
  Question.findOne({_id},(err,doc)=>{
    if (err) {
      getWrong(res,err);
    } else {
      console.log(doc.like);
      console.log(doc.like.indexOf(userName));
      if (doc.like.indexOf(userName) >= 0) {
        res.json({
          status:10001,
          msg:'已点过'
        })
      } else {
        Question.update({
          _id
        },{
          $addToSet:{
            'like': userName
          }
        },(err1,doc1)=>{
          if (err1) {
            getWrong(res,err1);
          } else {
            getRight(res,doc1);
          }
        })
      }
    }
  })
})

//问答取消赞
router.post('/unSupport',(req,res,next)=>{
  let { _id, userName } = req.body;
  Question.update({
    _id
  },{
    $pull:{
      'like': userName
    }
  },(err,doc)=>{
    if (err) {
      getWrong(res,err);
    } else {
      getRight(res,doc);
    }
  })
})

//回答问答
router.post('/answer',(req,res,next)=>{
  let { _id, answerAuthor, answerContent } = req.body;
  console.log(req.body)
  Question.update({
    _id
  },{
    $addToSet:{
      'questionAnswers':{
        'answerAuthor':answerAuthor,
        'answerContent':answerContent,
        'answerCreatedTime':new Date().Format('yyyy-MM-dd hh:mm')
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

//删除回答
router.post('/delAnswer',(req,res,next)=>{
  let { questionId, answerId } = req.body;
  Question.update({
    '_id':questionId
  },{
    $pull:{
      'questionAnswers':{
        '_id':answerId
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

//回复回答
router.post('/reply',(req,res,next)=>{
  let { _id, answerId, commentUserName, commentContent } = req.body;
  Question.update({
    '_id':_id,
    'questionAnswers._id':answerId,
    '$atomic' : 'true'
  },{
    $push: {
      'questionAnswers.$.answerChildren': {
        'commentUserName':commentUserName,
        'commentContent':commentContent,
        'commentCreatedTime':new Date().Format('yyyy-MM-dd hh:mm')
      },
    },
  },(err,doc)=>{
    if (err) {
      getWrong(res,err);
    } else {
      getRight(res,doc);
    }
  })
})

//搜索问答
router.post('/search',(req,res,next)=>{
  const { keyWords } = req.body;
  console.log(keyWords);
  const reg = new RegExp(keyWords, 'i')
  Question.find({
    $or:[{
      questionAuthor:{
        $regex:reg,
      }
    },{
      questionTitle:{
        $regex:reg,
      }
    },{
      questionFirstTag:{
        $regex:reg,
      }
    },{
      questionSecondTag:{
        $regex:reg,
      }
    }]
  },(err,doc)=>{
    if (err) {
      getWrong(res,err);
    } else {
      getRight(res,doc);
    }
  })
})

//获取最新问答
router.post('/new',(req,res,next)=>{
  Question.find({},'questionAuthor questionTitle questionIntroduce like questionFirstTag questionSecondTag questionCreatedTime').sort({
    questionId: -1,
  }).limit(6).exec((err, doc) => {
    if (err) {
      getWrong(res,err);
    } else {
      getRight(res,doc);
    }
  })
})

//删除问答
router.post('/del',(req,res,next)=>{
  let { _id } = req.body;
  Question.remove({
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