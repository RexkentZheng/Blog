<template>
	<div class="question-mine">
		<ul v-if='questions.length === 0'>
			<li>当前没有文章</li>
		</ul>
		<ul v-if='questions.length > 0'>
			<li v-for="question in questions" >
				<ul class="one-piece">
					<li class="clearfix">
						<p class="title">{{question.questionTitle}}</p>
					</li>
					<li class="clearfix">
						<p class="created-time">{{question.questionCreatedTime}}</p>
						<p class="edit">
							<a href="javascript:;" @click='reload(question._id)'>点击编辑</a>
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
				questions:[],
				questionGrouped:[],
				currentquestions:[],
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
				this.$router.go(0);
			}
		}
	}
</script>