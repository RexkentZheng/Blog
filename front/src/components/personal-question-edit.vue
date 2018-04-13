<template>
	<div class="question-create">
		<el-input v-model="title" placeholder="请输入文章标题"></el-input>
		<el-select v-model="firstTag" @change='getSecondTags' placeholder="请选择一级标题">
	    <el-option
	      v-for="tag in tags"
	      :key="tag.tagName"
	      :label="tag.tagName"
	      :value="tag.tagName">
	    </el-option>
	  </el-select>
	  <el-select v-model="secondTag" placeholder="清选择二级标题">
	    <el-option
	      v-for="secondTag in secondTags"
	      :key="secondTag"
	      :label="secondTag"
	      :value="secondTag">
	    </el-option>
	  </el-select>
		<el-input
		  type="textarea"
		  :rows="3"
		  placeholder="请输入文章简介"
		  v-model="introduce">
		</el-input>
		<div id="editor" style="text-align:left">
			<div v-html='editorContent'></div>
		</div>
		<el-button @click='saveQuestion()' type="primary" plain >确定</el-button>
		<el-button plain @click='cancel()'>取消</el-button>
	</div>
</template>
<script>
	import wangeditor from 'wangeditor'
	import axios from 'axios'
	
	export default{
		data(){
			return{
				title:'',
				introduce:'',
				editorContent: '',
				tags:[],
				firstTag:'',
				secondTag:'',
				secondTags:[],
			}
		},
		mounted(){
			this.init();
		},
		methods:{
			initEditor(){
				let editor = new wangeditor('#editor')
        editor.customConfig.onchange = (html) => {
          this.editorContent = html
        }
        editor.customConfig.menus = [
	        'head',  // 标题
			    'bold',  // 粗体
			    'fontSize',  // 字号
			    'fontName',  // 字体
			    'italic',  // 斜体
			    'underline',  // 下划线
			    'strikeThrough',  // 删除线
			    'foreColor',  // 文字颜色
			    'backColor',  // 背景颜色
			    'link',  // 插入链接
			    'list',  // 列表
			    'justify',  // 对齐方式
			    'quote',  // 引用
			    'emoticon',  // 表情
			    'image',  // 插入图片
			    'code',  // 插入代码
    		]
        editor.customConfig.uploadImgShowBase64 = true
        editor.create()
        if (!this.getCookies('userName')) {
        	this.$message({
			      message: '请先登录再进行操作',
			      type: 'warning'
			    });
        	this.$router.push({
        		path:'/'
        	})
        }
			},
			//查找cookie的方法
			getCookies(cname) {
				var name = cname + "=";
				var ca = document.cookie.split(';');
				for(var i = 0; i < ca.length; i++) {
					var c = ca[i];
					while(c.charAt(0) == ' ') c = c.substring(1);
					if(c.indexOf(name) != -1) return c.substring(name.length, c.length);
				}
				return "";
			},
			init(){
				axios.post('/questions/details',{
					questionId:this.$route.query.questionId
				}).then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						this.editorContent = res.result.questionContent;
						this.introduce = res.result.questionIntroduce;
						this.title = res.result.questionTitle;
						this.firstTag = res.result.questionFirstTag;
						this.secondTag = res.result.questionSecondTag;
					}
				})
				this.initEditor();
				axios.post('/confs/question/tags').then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						this.tags = res.result;
					}
				})
			},
			getSecondTags(val){
				this.tags.forEach((tag)=>{
					if (tag.tagName === val) {
						this.secondTags = tag.tagChild
					}
				})
			},
			saveQuestion () {
				if (!this.title || !this.introduce || !this.editorContent || !this.firstTag || !this.secondTag)  {
					this.$message({
						message:'请输入所有信息后再进行保存',
						type:'warning'
					})
					return;
				}
        axios.post('/questions/update',{
        	_id:this.$route.query.questionId,
        	questionIntroduce:this.introduce,
         	questionTitle:this.title,
          questionContent:this.editorContent,
          questionFirstTag:this.firstTag,
          questionecondTag:this.secondTag,
        }).then((response)=>{
          let res = response.data;
          if (res.status === 0) {
          	this.$message({
				      message: '保存成功',
				      type: 'success'
				    });
          	this.$router.push({
  						path:'/personalInfo/questionMine'
    				});
    				this.$router.go(0)
          }
        })
      },
      cancel(){
      	this.$router.push({
      		path:'/personalInfo/questionMine'
      	})
      }
		}
	}
</script>