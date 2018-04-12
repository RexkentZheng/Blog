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
			<li class="clearfix">
				<p>{{article.articleIntroduce}}</p>
				<p>{{article.articleFirstTag}}/{{article.articleSecondTag}}</p>
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
				<el-button @click='comment()'type="primary" plain size='mini'>确定</el-button>
			</li>
			<li class="comment-details clearfix">
				<ul v-for='(comment,index) in article.comments' class="one-piece clearfix">
					<li class="clearfix">
						<p class="comment-author">{{comment.commentUserName}}</p>
						<i @click='nowChild === index ? nowChild = -1 : nowChild = index' v-if='comment.commentChildren.length > 0' :class="nowChild === index ? 'el-icon-caret-top':'el-icon-caret-bottom'"></i>
						<p @click='delCommentConfirm(comment._id)' v-if="getCookies('userName') === article.articleAuthor" class="del">删除</p>
						<p @click='nowIndex = index' class="rep">回复</p>
					</li>
					<li class="clearfix">
						<p class="main-content">
							{{comment.commentContent}}
						</p>
						<p class="created-time">
							{{comment.commentCreatedTime}}
						</p>
					</li>
					<li class="clearfix">
						<ul v-if='index === nowChild' class="content-children">
							<li v-for='commentChild in comment.commentChildren' class="clearfix">
								<p>{{commentChild.commentContent}}</p>
								<p>{{commentChild.commentUserName}}</p>
							</li>
						</ul>
					</li>
					<li v-show='index === nowIndex' class="reply-new clearfix">
						<el-input size="mini" v-model="replyMessage" placeholder="请输入回复内容"></el-input>
						<el-button @click='nowIndex = -1' size="mini">取消</el-button>
						<el-button @click='reply(comment._id)' size="mini" type="primary">确定</el-button>
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
		    <el-button type="primary" @click="delComment()">确 定</el-button>
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
				article:{
					like:[],
				},
				supportFlag:false,
				firstComment:'',
				commentFlag:false,
				replyMessage:'',
				nowChild:-1,
				nowIndex:-1,
				delCommentId:'',
				dialogVisible: false,
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
					this.$message({
	          message: '请勿给自己的文章点赞',
	          type: 'warning'
	        });
				} else if (this.getCookies('userName') === '') {
					this.$message({
	          message: '请先登录再进行操作',
	          type: 'warning'
	        });
				} else {
					axios.post('/articles/support',{
						_id:this.article._id,
						userName:this.getCookies('userName')
					}).then((response)=>{
						let res = response.data;
						if (res.status === 10001) {
							this.$message({
			          message: '请勿重复点赞',
			          type: 'warning'
			        });
						} else if (res.status === 0) {
							this.$message({
			          message: '点赞成功',
			          type: 'success'
			        });
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
						this.$message({
		          message: '取消赞成功',
		          type: 'success'
		        });
						this.article.like.splice(this.article.like.indexOf(this.getCookies('userName')), 1);
						this.supportFlag = false;
					}
				})
			},
			comment(){
				if (this.getCookies('userName') === '') {
					this.$message({
	          message: '请先登录再进行操作',
	          type: 'warning'
	        });
	        return;
				}
				axios.post('/articles/comment',{
					_id:this.article._id,
					commentUserName:this.getCookies('userName'),
					commentContent:this.firstComment,
				}).then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						this.$message({
		          message: '评论成功',
		          type: 'success'
		        });
						this.$router.go(0);
					} else {
						this.$message({
		          message: '评论失败',
		          type: 'warning'
		        });
					}
				})
			},
			delCommentConfirm(commentId){
				this.delCommentId = commentId;
				this.dialogVisible = true;
			},
			delComment(){
				axios.post('articles/delComment',{
					articleId:this.article._id,
					commentId:this.delCommentId,
				}).then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						this.$message({
		          message: '删除成功',
		          type: 'success'
		        });
						this.dialogVisible = false;
						this.$router.go(0);
					} else {
						this.$message({
		          message: '删除失败',
		          type: 'warning'
		        });
					}
				})
			},
			reply(commentId){
				if (this.getCookies('userName') === '') {
					this.$message({
	          message: '请先登录再进行操作',
	          type: 'warning'
	        });
	        return;
				}
				axios.post('/articles/reply',{
					_id:this.article._id,
					commentId:commentId,
					commentUserName:this.getCookies('userName'),
					commentContent:this.replyMessage
				}).then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						this.$message({
	          message: '回复成功',
		          type: 'success'
		        });
		        this.init();
					} else {
						this.$message({
	          message: '回复失败',
		          type: 'warning'
		        });
		        this.init();
					}
				})
			}
		}
	}
</script>