const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const Conf = require('../models/conf');

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

//获取文章分类
router.post('/article/tags',(req,res,next)=>{
	Conf.findOne({},(err,doc)=>{
		if (err) {
			getWrong(res,err);
		} else {
			getRight(res,doc.articleTag)
		}
	})
})

//添加文章一级分类
router.post('/article/addFirstTag',(req,res,next)=>{
	let { firstName } = req.body;
	Conf.update({},{
		$addToSet:{
			'articleTag':{
				'tagName':firstName,
				'tagChild':[]
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

//删除文章一级分类
router.post('/article/delFirstTag',(req,res,next)=>{
	let { _id } = req.body;
	Conf.update({},{
		$pull:{
			'articleTag':{
				_id
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

//修改文章一级分类
router.post('/article/modifyFirstTag',(req,res,next)=>{
	let { _id, tagName, tagChild } = req.body;
	Conf.update({
		'articleTag._id':_id,
		'$atomic':'true'
	},{
		$set:{
			'articleTag.$':{
				tagName,
				tagChild
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

//获取问答分类
router.post('/question/tags',(req,res,next)=>{
	Conf.findOne({},(err,doc)=>{
		if (err) {
			getWrong(res,err);
		} else {
			getRight(res,doc.questionTag)
		}
	})
})

//添加问答一级分类
router.post('/question/addFirstTag',(req,res,next)=>{
	let { firstName } = req.body;
	Conf.update({},{
		$addToSet:{
			'questionTag':{
				'tagName':firstName,
				'tagChild':[]
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

//删除问答一级分类
router.post('/question/delFirstTag',(req,res,next)=>{
	let { _id } = req.body;
	Conf.update({},{
		$pull:{
			'questionTag':{
				_id
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

//修改问答一级分类
router.post('/question/modifyFirstTag',(req,res,next)=>{
	let { _id, tagName, tagChild } = req.body;
	Conf.update({
		'questionTag._id':_id,
		'$atomic':'true'
	},{
		$set:{
			'questionTag.$':{
				tagName,
				tagChild
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
module.exports = router;