<template>
	<div class="article-create">
		<el-input v-model="title" placeholder="请输入文章标题"></el-input>
		<el-input
		  type="textarea"
		  :rows="3"
		  placeholder="请输入文章简介"
		  v-model="introduce">
		</el-input>
		<div id="editor" style="text-align:left"></div>
		<el-button @click='saveArticle()' type="primary" plain >确定</el-button>
		<el-button @click='cancel()' plain >取消</el-button>
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
        longText:''
			}
		},
		mounted(){
			this.init();
		},
		methods:{
			init(){
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
			saveArticle:function () {
        axios.post('/articles/create',{
        	author:this.getCookies('userName'),
        	title:this.title,
        	introduce:this.introduce,
          content:this.editorContent
        }).then((response)=>{
          let res = response.data;
          if (res.status === 0) {
          	alert('保存成功');
          	this.$router.push({
  						path:'/personalInfo'
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