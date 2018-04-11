<template>
	<div class="article-mine">
		<ul v-if='articles.length === 0'>
			<li>当前没有文章</li>
		</ul>
		<ul v-if='articles.length > 0'>
			<li v-for="article in articles" >
				<ul class="one-piece">
					<li class="clearfix">
						<p class="title">{{article.articleTitle}}</p>
					</li>
					<li class="clearfix">
						<p class="created-time">{{article.articleCreatedTime}}</p>
						<p class="edit">
							<a href="javascript:;" @click='reload(article._id)'>点击编辑</a>
						</p>
						<p class="del">
							<a href="javascript:;" @click='delConfirm(article._id)'>删除</a>
						</p>
					</li>
					<li class="clearfix">
						<p class="introduce">
							{{article.articleIntroduce}}
						</p>
					</li>
				</ul>
			</li>
		</ul>
		<el-dialog
		  title="警告"
		  :visible.sync="dialogVisible"
		  width="30%">
		  <span>确认删除此回复？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="delArticle()">确 定</el-button>
		    <el-button @click="dialogVisible = false">取 消</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script>
	import axios from 'axios'

	export default{
		data(){
			return{
				articles:[],
				articlesGrouped:[],
				currentArticles:[],
				dialogVisible:false,
				delArticleId:'',
			}
		},
		mounted(){
			this.init();
		},
		methods:{
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
				axios.post('/articles/list',{
					articleAuthor:this.getCookies('userName')
				}).then((response)=>{
					let res= response.data;
					if (res.status === 0) {
						this.articles = res.result;
					}
				})
			},
			reload(articleId){
				this.$router.push({
					path:'/personalInfo/articleEdit',
					query:{articleId}
				});
			},
			delConfirm(articleId){
				this.dialogVisible = true;
				this.delArticleId = articleId;
			},
			delArticle(){
				axios.post('/articles/del',{
					_id:this.delArticleId
				}).then((response)=>{
					let res= response.data;
					if (res.status === 0) {
						this.dialogVisible = false;
						alert('删除成功！')
						this.init();
					}
				})
			}
		}
	}
</script>