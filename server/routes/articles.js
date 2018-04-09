const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const hello = require('./../utils/userIdCreator.js');
const Article = require('../models/article');

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
  Article.findOne({}).sort({
    articleId: -1,
  }).limit(1).exec((err, doc) => {
    if (doc !== null) {
      const maxDate = parseFloat(doc.userId);
      const articleId = hello.createUserId(maxDate, 3);
      Article.create({
        'articleId':articleId,
        'articleAuthor':author,
        'articleTitle':title,
        'articleContent':content,
        'articleCreatedTime': new Date().Format('yyyy-MM-dd hh:mm'),
        'like':[],
        'comments':[
          {
            'commentUserName':'String',
            'commentContent':'String',
            'commentTime':'String'
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
      const articleId = hello.createUserId(00000000000000, 3);
      Article.create({
        'articleId':articleId,
        'articleAuthor':author,
        'articleTitle':title,
        'articleContent':content,
        'articleCreatedTime': new Date().Format('yyyy-MM-dd hh:mm'),
        'like':[],
        'comments':[
          {
            'commentUserName':'String',
            'commentContent':'String',
            'commentTime':'String'
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

//文章列表接口
router.post('/list',(req,res,next)=>{
  let { articleAuthor } = req.body;
  Article.find({
    articleAuthor
  },(err,doc)=>{
    if (err) {
      getWrong(res,err);
    } else {
      getRight(res,doc);
    }
  })
})

//文章详情
router.post('/details',(req,res,next)=>{
  let { articleId } = req.body;
  console.log(articleId);
  Article.findOne({
    _id:articleId
  },(err,doc)=>{
    if (err) {
      getWrong(res,err);
    } else {
      getRight(res,doc);
    }
  })
})

//修改文章
router.post('/update',(req,res,next)=>{
  let { _id, articleTitle, articleContent } = req.body;
  Article.update({
    _id
  },{
    'articleTitle':articleTitle,
    'articleContent':articleContent,
  },(err,doc)=>{
    if (err) {
      getWrong(res,err);
    } else {
      getRight(res,doc);
    }
  })
})

//获取全部文章
router.post('/all',(req,res,next)=>{
  Article.find({},(err,doc)=>{
    if (err) {
      getWrong(res,err);
    } else {
      getRight(res,doc);
    }
  })
})

//文章点赞
router.post('/support',(req,res,next)=>{
  let { _id, userName } = req.body;
  Article.findOne({_id},(err,doc)=>{
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
        Article.update({
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

//文章取消赞
router.post('/unSupport',(req,res,next)=>{
  let { _id, userName } = req.body;
  Article.update({
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

//评论文章
router.post('/comment',(req,res,next)=>{
  let { _id, commentUserName, commentContent } = req.body;
  Article.update({
    _id
  },{
    $addToSet:{
      'comments':{
        'commentUserName':commentUserName,
        'commentContent':commentContent,
        'commentCreatedTime':new Date().Format('yyyy-MM-dd hh:mm')
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

//删除评论
router.post('/delComment',(req,res,next)=>{
  let { articleId, commentId } = req.body;
  Article.update({
    '_id':articleId
  },{
    $pull:{
      'comments':{
        '_id':commentId
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

//回复评论
router.post('/reply',(req,res,next)=>{
  let { _id, commentId, commentUserName, commentContent } = req.body;
  Article.update({
    '_id':_id,
    'comments._id':commentId,
    '$atomic' : 'true'
  },{
    $push: {
      'comments.$.commentChildren': {
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
module.exports = router;