<template>
	<div class="question-details">
		<ul>
			<li>
				<p class="question-title">{{question.questionTitle}}</p>
			</li>
			<li class="clearfix">
				<p class="question-created-time">{{question.questionCreatedTime}}</p>
				<p class="question-author">{{question.questionAuthor}}</p>
			</li>
			<li>
 				<div class="question-content" v-html='question.questionContent'></div>
			</li>
			<li class="support clearfix">
				<el-button v-if='!supportFlag' @click='support()' type="primary" plain size='mini'>点赞</el-button>
				<el-button v-if='supportFlag' @click='unSupport()' plain size='mini'>取消赞</el-button>
				<p>{{question.like.length}}</p>
				<el-button v-if="this.getCookies('userName') !== question.questionAuthor" @click='showEditor()' type="primary" plain size='mini' class='comment'>回答</el-button>
			</li>
			<li v-show='answerFlag' class="answer clearfix">
				<div id="editor" style="text-align:left"></div>
				<el-button @click='answer()'type="primary" plain size='mini'>确定</el-button>
				<el-button @click='answerFlag = !answerFlag' plain size='mini'>取消</el-button>
			</li>
			<li class="answer-details clearfix">
				<ul v-for='(answer,index) in question.questionAnswers' class="one-piece clearfix">
					<li class="clearfix">
						<p class="answer-author">{{answer.answerAuthor}}</p>
						<i @click='nowChild === index ? nowChild = -1 : nowChild = index' v-if='answer.answerChildren.length !== 0' :class="nowChild === index ? 'el-icon-caret-top':'el-icon-caret-bottom'"></i>
						<p @click='delAnswerConfirm(answer._id)' v-if="(getCookies('userName') === answer.answerAuthor) || (getCookies('userName') === question.questionAuthor) " class="del">删除</p>
						<p @click='nowIndex = index' class="rep">回复</p>
					</li>
					<li class="clearfix">
						<div class="answer-content" style="text-align:left" v-html='answer.answerContent'></div>
						<p class="created-time">
							{{answer.answerCreatedTime}}
						</p>
					</li>
					<li class="clearfix">
						<ul v-if='index === nowChild' class="content-children">
							<li v-for='answerChild in answer.answerChildren' class="clearfix">
								<p>{{answerChild.commentContent}}</p>
								<p>{{answerChild.commentUserName}}</p>
							</li>
						</ul>
					</li>
					<li v-show='index === nowIndex' class="reply-new clearfix">
						<el-input size="mini" v-model="replyMessage" placeholder="请输入回复内容"></el-input>
						<el-button @click='nowIndex = -1' size="mini">取消</el-button>
						<el-button @click='reply(answer._id)' size="mini" type="primary">确定</el-button>
					</li>
				</ul>
			</li>
		</ul>
		<el-dialog
		  title="警告"
		  :visible.sync="dialogVisible"
		  width="30%">
		  <span>确认删除此回答？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="delAnswer()">确 定</el-button>
		    <el-button @click="dialogVisible = false">取 消</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	import axios from 'axios'
	import wangeditor from 'wangeditor'

	export default{
		data(){
			return{
				question:{
					like:[],
					questionAnswers:[]
				},
				supportFlag:false,
				answerFlag:false,
				Answer:'',
				isEditorExist:false,
				dialogVisible:false,
				nowChild:-1,
				nowIndex:-1,
				replyMessage:'',
				delAnswerId:'',
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
				axios.post('/questions/details',{
					questionId:this.$route.query._id
				}).then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						this.question = res.result;
					}
				})
			},
			initEditor(){
				let editor = new wangeditor('#editor')
        editor.customConfig.onchange = (html) => {
          this.Answer = html
        }
        editor.customConfig.menus = [
		    'bold',  // 粗体
		    'fontSize',  // 字号
		    'fontName',  // 字体
		    'italic',  // 斜体
		    'foreColor',  // 文字颜色
		    'backColor',  // 背景颜色
		    'link',  // 插入链接
		    'justify',  // 对齐方式
		    'quote',  // 引用
		    'emoticon',  // 表情
		    'image',  // 插入图片
		    'code',  // 插入代码
    		]
        editor.customConfig.uploadImgShowBase64 = true
        editor.create()
			},
			support(){
				if (this.question.questionAuthor === this.getCookies('userName')) {
					alert('请勿给自己的问答点赞');
				} else if (this.getCookies('userName') === '') {
					alert('请先登录再进行操作');
				} else {
					axios.post('/questions/support',{
						_id:this.question._id,
						userName:this.getCookies('userName')
					}).then((response)=>{
						let res = response.data;
						if (res.status === 10001) {
							alert('请勿重复点赞');
						} else if (res.status === 0) {
							alert('点赞成功');
							this.question.like.push(this.getCookies('userName'));
							this.supportFlag = true;
						} else {}{

						}
					})
				}
			},
			unSupport(){
				axios.post('/questions/unSupport',{
					_id:this.question._id,
					userName:this.getCookies('userName')
				}).then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						alert('取消赞成功');
						this.question.like.splice(this.question.like.indexOf(this.getCookies('userName')), 1);
						this.supportFlag = false;
					}
				})
			},
			answer(){
				axios.post('/questions/answer',{
					_id:this.question._id,
					answerAuthor:this.getCookies('userName'),
					answerContent:this.Answer,
				}).then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						alert('回答成功');
						this.$router.go(0);
					} else {
						alert('回答失败')
					}
				})
			},
			showEditor(){
				this.answerFlag = !this.answerFlag;
				if (!this.isEditorExist) {
					this.initEditor();
				}
				this.isEditorExist = true;
			},
			delAnswerConfirm(answerId){
				this.delAnswerId = answerId;
				this.dialogVisible = true;
			},
			delAnswer(){
				axios.post('questions/delAnswer',{
					questionId:this.question._id,
					answerId:this.delAnswerId,
				}).then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						alert('删除成功');
						this.dialogVisible = false;
						this.$router.go(0);
					} else {
						alert('删除失败')
					}
				})
			},
			reply(answerId){
				axios.post('/questions/reply',{
					_id:this.question._id,
					answerId:answerId,
					commentUserName:this.getCookies('userName'),
					commentContent:this.replyMessage
				}).then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						alert('回复成功');
						this.$router.go(0);
					} else {
						alert('回复失败')
					}
				})
			}
		}
	}
</script>