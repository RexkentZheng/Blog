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
					</li>
				</ul>
			</li>
		</ul>
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
				this.$router.go(0);
			}
		}
	}
</script>