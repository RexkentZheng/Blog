const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const PersonalInfo = require('../models/personalInfo');
const upload = require('./../utils/upload');
const fs = require('fs');

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

//根据用户Id获取用户信息
router.post('/detailsById',(req,res,next)=>{
	let { userId } = req.body;
	PersonalInfo.findOne({
		userId
	},(err,doc)=>{
		if (err) {
			getWrong(res,err);
		} else {
			getRight(res,doc);
		}
	})
})

//根据用户名获取用户信息
router.post('/detailsByName',(req,res,next)=>{
  let { userName } = req.body;
  PersonalInfo.findOne({
    userName
  },(err,doc)=>{
    if (err) {
      getWrong(res,err);
    } else {
      getRight(res,doc);
    }
  })
})

//修改用户信息
router.post('/change',(req,res,next)=>{
	let { allInfo } = req.body;
	PersonalInfo.update({
		_id:allInfo._id
	},{
		userTel:allInfo.userTel,
		userEmail:allInfo.userEmail,
		userMotto:allInfo.userMotto,
		userIntroduce:allInfo.userIntroduce,
		userBirthday:allInfo.userBirthday,
		userHP:allInfo.userHP,
	},(err,doc)=>{
		if (err) {
			getWrong(res,err);
		} else {
			getRight(res,doc);
		}
	})
})

// 上传学生头像
router.post('/HP', (req, res, next) => {
  upload.uploadHP(req, res, (err) => {
  	console.log(req.body)
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        result: '',
      });
    } else {
      // 上传成功之后修改文件名
      fs.rename(req.file.path, `${req.file.destination}/${req.body.id}-${req.body.name}.png`, (err1) => {
        if (err1) {
          res.json({
            status: 11,
            msg: err1.message,
            result: '',
          });
        } else {
          res.json({
            status: 0,
            msg: 'Suc',
            src: req.file,
            result: '',
          });
        }
      });
    }
  });
});
module.exports = router;