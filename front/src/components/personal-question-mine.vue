<template>
	<div class="question-mine">
		<ul v-if='questions.length === 0'>
			<li>当前没有问答</li>
		</ul>
		<ul v-if='questions.length > 0'>
			<li v-for="question in questions" >
				<ul class="one-piece">
					<li class="clearfix">
						<p class="title">{{question.questionTitle}}</p>
					</li>
					<li class="clearfix">
						<p class="created-time">{{question.questionFirstTag}}/{{question.questionSecondTag}}/{{question.questionCreatedTime}}</p>
						<p class="edit">
							<a href="javascript:;" @click='reload(question._id)'>点击编辑</a>
						</p>
						<p class="del">
							<a href="javascript:;" @click='delConfirm(question._id)'>删除</a>
						</p>
					</li>
					<li class="clearfix">
						<p class="introduce">
							{{question.questionIntroduce}}
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
		    <el-button type="primary" @click="delQuestion()">确 定</el-button>
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
				questions:[],
				questionGrouped:[],
				currentquestions:[],
				dialogVisible:false,
				delQuestionId:'',
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
				axios.post('/questions/list',{
					questionAuthor:this.getCookies('userName')
				}).then((response)=>{
					let res= response.data;
					if (res.status === 0) {
						this.questions = res.result;
					}
				})
			},
			reload(questionId){
				this.$router.push({
					path:'/personalInfo/questionEdit',
					query:{questionId}
				});
			},
			delConfirm(questionId){
				this.dialogVisible = true;
				this.delQuestionId = questionId;
			},
			delQuestion(){
				axios.post('/questions/del',{
					_id:this.delQuestionId
				}).then((response)=>{
					let res= response.data;
					if (res.status === 0) {
						this.dialogVisible = false;
						this.$message({
		          message: '删除成功',
		          type: 'success'
		        });
						this.init();
					}
				})
			}
		}
	}
</script>