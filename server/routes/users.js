const express = require('express');
const md5 = require('md5');
const mongoose = require('mongoose');

const router = express.Router();
const User = require('../models/user');
const hello = require('./../utils/userIdCreator.js');
const personalInfo = require('./../models/personalInfo');

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

// 链接数据库
mongoose.connect('mongodb://127.0.0.1:27017/blog')

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected success.');
})

mongoose.connection.on('error', () => {
  console.log('MongoDB connected fail.')
})

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connected disconnected.')
})

//用户注册
router.post('/register',(req,res,next)=>{
	let {userName,userPwd} = req.body;
	User.find({userName},(err,doc)=>{
		if (doc.length > 0) {
			res.json({
				status:10001,
				msg:'用户名重复',
				result:''
			})
		} else {
			User.findOne({}).sort({
		    userId: -1,
		  }).limit(1).exec((err, doc) => {
		  	if (doc !== null) {
		      const maxDate = parseFloat(doc.userId);
		      const userId = hello.createUserId(maxDate, 2);
		      User.create({
		  			userName:userName,
		  			userPwd:md5(userPwd),
		  			userId:userId,
		  			userType:2
		  		},(err1,doc1)=>{
		  			if (err1) {
		  				getWrong(res,err1);
		  			} else {
		  				getRight(res,doc1);
		  			}
		  		})
		  	} else {
		  		const userId = hello.createUserId(00000000000000, 2);
		  		User.create({
		  			userName:userName,
		  			userPwd:md5(userPwd),
		  			userId:userId,
		  			userType:2
		  		},(err1,doc1)=>{
		  			if (err1) {
		  				getWrong(res,err1);
		  			} else {
		  				getRight(res,doc1);
		  			}
		  		})
		  	}
		  })
		}
	})
})

//用户登录
router.post('/login', (req, res, next) => {
  const param = {
    userName: req.body.userName,
    userPwd: md5(req.body.userPwd),
  };
  User.findOne(param, (err, doc) => {
    if (err) {
      getWrong(res,err);
    } else if (doc) {
      const { userType } = doc;
      res.cookie('userId', doc.userId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 10,
      });
      res.cookie('userName', doc.userName, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 10,
      });
      res.cookie('userType', doc.userType, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 10,
      });
      res.json({
        status: 0,
        msg: '',
        result: {
          userName: doc.userName,
          userType: doc.userType,
        },
      });
    } else {
      res.json({
        status: 1,
        msg: '用户名密码错误',
        result: '',
      });
    }
  });
});

// 检查是否登录
router.get('/checkLogin', (req, res, next) => {
  if (req.cookies.userId) {
    res.json({
      status: 0,
      msg: '',
      result: ({
        userName: req.cookies.userName,
        userType: req.cookies.userType,
      }),
    });
  } else {
    res.json({
      status: 1,
      msg: '当前未登录',
      result: '',
    });
  }
});

// 登出功能
router.post('/logout', (req, res, next) => {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1,
  });
  res.cookie('userName', '', {
    path: '/',
    maxAge: -1,
  });
  res.cookie('userType', '', {
    path: '/',
    maxAge: -1,
  });
  res.json({
    status: 0,
    msg: '',
    result: '',
  });
});


//修改密码
router.post('/changePwd',(req,res,next)=>{
  let { userId, oldPwd, newPwd } = req.body;
  User.findOne({
    userId
  },(err,doc)=>{
    if (err) {
      getWrong(res,err);
    } else {
      console.log(doc.userPwd);
      console.log(md5(oldPwd));
      if (doc.userPwd !== md5(oldPwd)) {
        res.json({
          status:10001,
          msg:'原始密码错误',
          result:''
        })
      } else {
        User.update({
          userId
        },{
          $set:{
            userPwd:md5(newPwd)
          }
        },(err1,doc1)=>{
        if (err1) {
          getWrong(res,err1);
        } else {
          getRight(res,doc1);
        }})
      }
    }
  })
})
module.exports = router;