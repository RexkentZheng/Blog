<template>
	<div class="article-create">
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
		<el-button @click='saveArticle()' type="primary" plain >确定</el-button>
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
		computed:{
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
				axios.post('/articles/details',{
					articleId:this.$route.query.articleId
				}).then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						this.editorContent = res.result.articleContent;
						this.title = res.result.articleTitle;
						this.introduce = res.result.articleIntroduce;
						this.firstTag = res.result.articleFirstTag;
						this.secondTag = res.result.articleSecondTag;
					}
				})
				this.initEditor();
				axios.post('/confs/article/tags').then((response)=>{
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
			saveArticle () {
				if (!this.title || !this.introduce || !this.editorContent || !this.firstTag || !this.secondTag)  {
					this.$message({
						message:'请输入所有信息后再进行保存',
						type:'warning'
					})
					return;
				}
        axios.post('/articles/update',{
        	_id:this.$route.query.articleId,
        	articleIntroduce:this.introduce,
        	articleTitle:this.title,
          articleContent:this.editorContent,
          articleFirstTag:this.firstTag,
          articleSecondTag:this.secondTag,
        }).then((response)=>{
          let res = response.data;
          if (res.status === 0) {
          	this.$message({
				      message: '保存成功',
				      type: 'success'
				    });
          	this.$router.push({
  						path:'/personalInfo/articleMine'
    				});
          }
        })
      },
      cancel(){
      	this.$router.push({
      		path:'/personalInfo/articleMine'
      	})
      }
		}
	}
</script>