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
<!-- 				<p v-html='article.articleContent'></p>-->
 				<div class="question-content" v-html='question.questionContent'></div>
			</li>
		</ul>
	</div>
</template>

<script>
	import axios from 'axios'

	export default{
		data(){
			return{
				question:{},
			}
		},
		mounted(){
			this.init();
		},
		methods:{
			init(){
				axios.post('/questions/details',{
					questionId:this.$route.query._id
				}).then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						this.question = res.result;
					}
				})
			}
		}
	}
</script>