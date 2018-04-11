<template>
	<div class="personal">
		<el-row>
			<el-col :span="7">
		    <el-menu>
		    	<router-link to='/home'>
			    	<el-menu-item index="1">
			        <i class="el-icon-location"></i>
			        <span slot="title">回到首页</span>
			      </el-menu-item>
		    	</router-link>
		      <el-submenu v-if="this.getCookies('userType') === '1'" index="2">
		        <template slot="title">
		          <i class="el-icon-document"></i>
		          <span>文章部分</span>
		        </template>
		        <router-link to='/personalInfo/articleCreate'>
		          <el-menu-item index="2-1">
			          &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
			        	新建文章
		        	</el-menu-item>
	        	</router-link>
	        	<router-link to='/personalInfo/articleMine'>
		        	<el-menu-item index="2-2">
			          &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
			        	我的文章
		        	</el-menu-item>
	        	</router-link>
		      </el-submenu>
		      <el-submenu index="3">
		        <template slot="title">
		          <i class="el-icon-question"></i>
		          <span>问答部分</span>
		        </template>
		        <router-link to='/personalInfo/questionCreate'>
		          <el-menu-item index="3-1">
			          &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
			        	新建问答
		        	</el-menu-item>
	        	</router-link>
	        	<router-link to='/personalInfo/questionMine'>
		        	<el-menu-item index="3-2">
			          &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
			        	我的问答
		        	</el-menu-item>
	        	</router-link>
		      </el-submenu>
		      <el-submenu index="4">
		        <template slot="title">
		          <i class="el-icon-setting"></i>
		          <span>个人设置</span>
		        </template>
		        <router-link to='/personalInfo/confClassify'>
		          <el-menu-item v-if="getCookies('userType') === '1'" index="4-1">
			          &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
			        	分类设置
		        	</el-menu-item>
	        	</router-link>
	        	<router-link to='/personalInfo/questionMine'>
		        	<el-menu-item index="4-2">
			          &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
			        	其他设置
		        	</el-menu-item>
	        	</router-link>
		      </el-submenu>
		    </el-menu>
		  </el-col>
		  <el-col :span="13" :offset="1">
		  	<article-create  v-if="pathName === 'articleCreate'"></article-create>
				<article-mine v-if="pathName === 'articleMine'"></article-mine>
				<article-edit v-if="pathName === 'articleEdit'"></article-edit>
				<question-create v-if="pathName === 'questionCreate'"></question-create>
				<question-mine v-if="pathName === 'questionMine'"></question-mine>
				<question-edit v-if="pathName === 'questionEdit'"></question-edit>
				<conf-classify v-if="pathName === 'confClassify'"></conf-classify>
		  </el-col>
		</el-row>
	</div>
</template>

<script>
	import axios from 'axios'
	import ArticleCreate from './personal-article-create'
	import ArticleMine from './personal-article-mine'
	import ArticleEdit from './personal-article-edit'
	import QuestionCreate from './personal-question-create'
	import QuestionMine from './personal-question-mine'
	import QuestionEdit from './personal-question-edit'
	import ConfClassify from './personal-conf-classify'

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
	    QuestionEdit,
	    ConfClassify,
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