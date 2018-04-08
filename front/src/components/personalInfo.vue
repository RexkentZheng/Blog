<template>
	<div class="personal">
		<el-menu class="el-menu-demo" mode="horizontal" @select="init()">
			<el-submenu index="1">
		    <template slot="title">文章操作</template>
		    <el-menu-item index="1-1">
		    <router-link to='/personalInfo/articleCreate'>新建文章</router-link>
		  	</el-menu-item>
		    <el-menu-item index="1-2">
		    <router-link to='/personalInfo/articleMine'>我的文章</router-link>
		  	</el-menu-item>
		  </el-submenu>
		  <el-submenu index="2">
		    <template slot="title">问答操作</template>
		    <el-menu-item index="2-1">
		    <router-link to='/personalInfo/questionCreate'>新建问答</router-link>
			  </el-menu-item>
		    <el-menu-item index="2-2">
		    <router-link to='/personalInfo/questionMine'>我的问答</router-link>
		  	</el-menu-item>
		  </el-submenu>
		  <el-menu-item index="4">个人设置</el-menu-item>
		</el-menu>
		<article-create  v-if="pathName === 'articleCreate'"></article-create>
		<article-mine v-if="pathName === 'articleMine'"></article-mine>
		<article-edit v-if="pathName === 'articleEdit'"></article-edit>
		<question-create v-if="pathName === 'questionCreate'"></question-create>
		<question-mine v-if="pathName === 'questionMine'"></question-mine>
		<question-edit v-if="pathName === 'questionEdit'"></question-edit>
	</div>
</template>

<script>
	import axios from 'axios'
	import ArticleCreate from './personal-article-create'	
	import ArticleMine from './personal-article-mine'
	import ArticleEdit from './personal-article-edit'
	import QuestionCreate from './personal-question-create'
	import QuestionMine from './personal-question-mine'
	import questionEdit from './personal-question-edit'

	export default{
		data(){
			return{
				activeIndex: '1',
			}
		},
		components:{
	    ArticleCreate,
	    ArticleMine,
	    ArticleEdit,
	    QuestionCreate,
	    QuestionMine,
	    questionEdit,
	  },
	  computed:{
	  	pathName(){
	  		return this.$route.path.split('/')[2];
	  	}
	  },
		mounted(){
			this.init();
		},
		methods:{
			init(){
				if (!this.getCookies('userName')) {
					alert('请先登录再进行操作');
					this.$router.push({
						path:'/article'
					})
				}
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
		}
	}
</script>