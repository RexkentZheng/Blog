<template>
	<div class="question-create">
		<el-input v-model="title" placeholder="请输入文章标题"></el-input>
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
				editorContent: '',
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
        	alert('请先登录再进行操作');
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
						this.title = res.result.questionTitle;
					}
				})
				this.initEditor();
			},
			saveQuestion () {
        axios.post('/questions/update',{
        	_id:this.$route.query.questionId,
        	questionTitle:this.title,
          questionContent:this.editorContent
        }).then((response)=>{
          let res = response.data;
          if (res.status === 0) {
          	alert('保存成功');
          	this.$router.push({
  						path:'/personalInfo/questionMine'
    				});
    				this.$router.go(0)
          }
        })
      },
      cancel(){
      	this.$router.push({
      		path:'/personalInfo'
      	})
      }
		}
	}
</script>