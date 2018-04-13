var multer = require('multer');

//学生头像上传
var storageHP = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, "./../front/static/images");
	},
	filename: function(req, file, callback) {
		console.log(file.fieldname + "_" + Date.now() + "_" + file.originalname)
		callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
	},
});

//定义upload方法
var uploadHP = multer({
	storage: storageHP
}).single("user");


exports.uploadHP = uploadHP;

