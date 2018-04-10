<template>
  <div class="home">
    <div class="main-introduce">
    	<div class="main-wrapper clearfix">
    		<div class="img-wrapper clearfix">
    			<router-link to='/article'>
  	  			<img src="./../assets/images/article-banner.jpeg">
    			</router-link>
    		</div>
    		<ul>
  				<li class="title">
  					<router-link to='/article'>文章部分</router-link>
  				</li>
  				<li class="text">
  					<p>这里是文章列表介绍这里是文章列表介绍这里是文章列表介绍这里是文章列表介绍这里是文章列表介绍这里是文章列表介绍这里是文章列表介绍</p>
  				</li>
  			</ul>
    	</div>
    	<div class="main-wrapper clearfix">
    		<div class="img-wrapper clearfix">
 					<router-link to='/question'>
	    			<img src="./../assets/images/question-banner.jpeg">
 					</router-link>
    		</div>
    		<ul>
  				<li class="title">
  					<router-link to='/question'>问答部分</router-link>
  				</li>
  				<li class="text">
  					<p>这里是问答列表这里是问答列表这里是问答列表这里是问答列表这里是问答列表这里是问答列表这里是问答列表这里是问答列表这里是问答列表</p>
  				</li>
  			</ul>
    	</div>
    </div>
		<div class="new-articles clearfix">
			<div class="clearfix">
				<h3>最新文章</h3>
			</div>
			<div v-if='articles' v-for='article in articles' class="one-article">
				<ul>
					<li class="article-title">
						<router-link :to="{path:'/article/details',query:{_id:article._id}}">
							{{article.articleTitle}}
						</router-link>
					<li class="article-introduce">
						<p>{{article.articleAuthor}}/{{article.articleCreatedTime}}</p>
					</li>
					<li class="article-showcut">
						<p>这一哥什么都没有的文章这一哥什么都没有的文章</p>
					</li>
				</ul>
			</div>
		</div>
		<div class="new-questions clearfix">
			<div class="clearfix">
				<h3>最新问答</h3>
			</div>
			<div v-if='questions' v-for='question in questions' class="one-question">
				<ul>
					<li class="question-title">
						<router-link :to="{path:'/question/details',query:{_id:question._id}}">
							{{question.questionTitle}}
						</router-link>
					<li class="question-introduce">
						<p>{{question.questionAuthor}}/{{question.questionCreatedTime}}</p>
					</li>
					<li class="question-showcut">
						<p>这一哥什么都没有的文章</p>
					</li>
				</ul>
			</div>
		</div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
    	articles:[],
    	questions:[]
    }
  },
  mounted(){
  	this.init();
  },
  methods:{
  	init(){
  		axios.post('/articles/new').then((response)=>{
  			let res = response.data;
  			if (res.status === 0) {
  				this.articles = res.result;
  			}
  		});
  		axios.post('/questions/new').then((response)=>{
  			let res = response.data;
  			if (res.status === 0) {
  				this.questions = res.result;
  			}
  		})
  	}
  }
}
</script>

<style scoped>

</style>
