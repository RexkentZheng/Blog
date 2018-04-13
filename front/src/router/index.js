import Vue from 'vue'
import Router from 'vue-router'
import home from './../components/home';
import article from "./../components/article";
import articleDetails from './../components/article-details'
import question from "./../components/question";
import questionDetails from "./../components/question-details";
import messageBord from "./../components/messageBord";
import personalInfo from "./../components/personalInfo";
import userInfo from './../components/userInfo';

Vue.use(Router)

export default new Router({
	routes: [{
    path: '/',
   redirect: '/home'
   },{
		path: '/home',
		name: 'home',
		component: home
	}, {
		path: "/article",
		name: 'article',
		component: article
	}, {
		path: "/article/details",
		name: 'articleDetails',
		component: articleDetails
	}, {
		path: "/question/details",
		name: 'questionDetails',
		component: questionDetails
	}, {
		path: "/question",
		name: 'question',
		component: question
	},{
		path: "/messageBord",
		name: 'messageBord',
		component: messageBord
	},{
		path: "/userInfo",
		name: 'userInfo',
		component: userInfo
	},{
		path: "/personalInfo",
		name: 'personalInfo',
		component: personalInfo
	},{
		path: "/personalInfo/*",
		name: 'personalInfo',
		component: personalInfo
	}]
})