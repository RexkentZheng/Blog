<template>
	<div class="article-details">
		<ul>
			<li>
				<p class="article-title">{{article.articleTitle}}</p>
			</li>
			<li class="clearfix">
				<p class="article-created-time">{{article.articleCreatedTime}}</p>
				<p class="article-author">{{article.articleAuthor}}</p>
			</li>
			<li>
 				<div class="article-content" v-html='article.articleContent'></div>
			</li>
			<li class="support clearfix">
				<el-button v-if='!supportFlag' @click='support()' type="primary" plain size='mini'>点赞</el-button>
				<el-button v-if='supportFlag' @click='unSupport()' plain size='mini'>取消赞</el-button>
				<p>{{article.like.length}}</p>
				<el-button v-if="this.getCookies('userName') !== article.articleAuthor" @click='commentFlag = !commentFlag' type="primary" plain size='mini' class='comment'>评论</el-button>
			</li>
			<li v-if='commentFlag' class="comment clearfix">
				<el-input v-model='firstComment' size='mini'></el-input>
				<el-button @click='commentFlag = !commentFlag' plain size='mini'>取消</el-button>
				<el-button type="primary" plain size='mini'>确定</el-button>
			</li>
		</ul>
	</div>
</template>

<script>
	import axios from 'axios'
	
	export default{
		data(){
			return{
				article:{},
				supportFlag:false,
				firstComment:'',
				commentFlag:false,
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
				axios.post('/articles/details',{
					articleId:this.$route.query._id
				}).then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						this.article = res.result;
						if (this.article.like.indexOf(this.getCookies('userName')) >= 0) {
							this.supportFlag = true;
						}
					}
				});
			},
			support(){
				if (this.article.articleAuthor === this.getCookies('userName')) {
					alert('请勿给自己的文章点赞');
				} else if (this.getCookies('userName') === '') {
					alert('请先登录再进行操作');
				} else {
					axios.post('/articles/support',{
						_id:this.article._id,
						userName:this.getCookies('userName')
					}).then((response)=>{
						let res = response.data;
						if (res.status === 10001) {
							alert('请勿重复点赞');
						} else if (res.status === 0) {
							alert('点赞成功');
							this.article.like.push(this.getCookies('userName'));
							this.supportFlag = true;
						} else {}{

						}
					})
				}
			},
			unSupport(){
				axios.post('/articles/unSupport',{
					_id:this.article._id,
					userName:this.getCookies('userName')
				}).then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						alert('取消赞成功');
						this.article.like.splice(this.article.like.indexOf(this.getCookies('userName')), 1);
						this.supportFlag = false;
					}
				})
			}
		}
	}
</script>