<template>
	<div class="header">
		<div class="bar-wraper">
			<div class="bar">
				<ul class="login">
					<li v-if="nickName">
						<a class="kill-decoration header-a" href="javascript:;" @click="userLink()" >{{nickName}}</a>
					</li>
					<li v-if="!nickName">
						<a class="kill-decoration header-a" href="javascript:;" @click="isLogin=true" >登录</a>
					</li>
					<li v-if="!nickName">
						<a class="kill-decoration header-a" href="javascript:;" @click="isRegister=true" >注册</a>
					</li>
					<li v-if="nickName">
						<a class="kill-decoration header-a" href="javascript:;" @click="logout()" >登出</a>						
					</li>
				</ul>
			</div>
		</div>
		<div class="nav-wraper">
			<div class="nav ">
				<div class="logo-part">
					<router-link to='/'>
					</router-link>
				</div>
			</div>
		</div>
		<div class="login-wraper" v-if="isLogin || isRegister">
			<div class="login-part" v-if='isLogin'>
				<div class="login-main">
					<dl class="clearfix userName">
						<dt>用户名：</dt>
						<dd>
							<el-input v-bind:autofocus="loginWrapFlag" v-model="userName" type="text" /></el-input>
						</dd>
					</dl>
					<span class="errorTip" v-if="errorTipFlag">{{errorTipContent}}</span>
					<dl class="clearfix userPwd">
						<dt>密&nbsp;&nbsp;&nbsp;码：</dt>
						<dd>
							<el-input v-model="userPwd" type="password" /></el-input>
						</dd>
					</dl>
					<div class="btn-line">
						<el-button type="primary" plain @keyup="login()" @click="login()">登录</el-button>
						<el-button plain @click="isLogin=false">取消</el-button>
					</div>
				</div>
			</div>
			<div class="login-part register" v-if='isRegister'>
				<div class="login-main">
					<dl class="clearfix userName">
						<dt>用户名：</dt>
						<dd>
							<el-input v-bind:autofocus="loginWrapFlag" v-model="userName" type="text" /></el-input>
						</dd>
					</dl>
					<span class="errorTip" v-if="errorTipFlag">{{errorTipContent}}</span>
					<dl class="clearfix userPwd">
						<dt>密&nbsp;&nbsp;&nbsp;码：</dt>
						<dd>
							<el-input v-model="userPwd" type="password" /></el-input>
						</dd>
					</dl>
					<dl class="clearfix userPwd">
						<dt>再次输入密码：</dt>
						<dd>
							<el-input v-model="userPwdAgain" type="password" /></el-input>
						</dd>
					</dl>
					<div class="btn-line">
						<el-button type="primary" plain @keyup="login()" @click="register()">注册</el-button>
						<el-button plain @click="isRegister=false">取消</el-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	
	export default{
		data(){
			return{
				userName:'',
				userPwd:'',
				userPwdAgain:'',
				userType:'',
				errorTipFlag:false,
				errorTipContent:"",
				loginWrapFlag:false,
				nickName:'',
				isLogin:false,
				isRegister:false
			}
		},
		mounted(){
			this.checkLogin();
			this.enterClick();
		},
		methods:{
			checkLogin(){
				axios.get('/users/checkLogin').then((response)=>{
					let res = response.data;
					if (res.status == 0) {
						this.nickName = res.result.userName;
						this.userType = res.result.userType;
					}else{
						
					}
				})
			},
			userLink(){
				this.$router.push({
					path:'/personalInfo'
				});
			},
			login(){
				if (!this.userName || !this.userPwd) {
					this.errorTipFlag = true;
					this.errorTipContent = "用户名或密码不能为空";
				}
				axios.post('/users/login',{
					userName:this.userName,
					userPwd:this.userPwd
				}).then((response)=>{
					let res = response.data;
					if (res.status == 0) {
						this.loginWrapFlag = false;
						this.nickName = res.result.userName;
						this.userType = res.result.userType;
						this.$router.go(0);
					}else{
						this.errorTipFlag = true;
						this.errorTipContent = "用户名或密码错误";
					}
				})
			},
			register(){
				let reg = /[~#^$@%&!*()<>:;'"{}【】  ]/gi;
				if (reg.test(this.userName)) {
					this.$message({
			      message: '用户名中含有特殊字符',
			      type: 'warning'
			    });
        	return;  
    		}
    		if (this.userName.split('').length>12) {
    			this.$message({
			      message: '用户名长度超过12位',
			      type: 'warning'
			    });
        	return;
    		}
    		if (this.userName === '') {
    			this.$message({
			      message: '用户名不能为空',
			      type: 'warning'
			    });
        	return;
    		}
				if (this.userPwd !== this.userPwdAgain) {
					this.$message({
			      message: '两次输入的密码不一致',
			      type: 'warning'
			    });
				} else {
					axios.post('./users/register',{
						userName:this.userName,
						userPwd:this.userPwd
					}).then((response)=>{
						const res = response.data;
						if (res.status === 10001) {
							this.$message({
					      message: res.msg,
					      type: 'warning'
					    });
						} else if(res.status === 1){
							this.$message({
					      message: '注册失败，请稍后再试',
					      type: 'warning'
					    });
						}else{
							this.$message({
					      message: '注册成功',
					      type: 'success'
					    });
							this.$router.go(0);
						}
					})
				}
			},
			logout(){
				axios.post('/users/logout').then((response)=>{
					let res = response.data;
					if (res.status == 0) {
						this.nickName = '';
						this.$router.push({
							path:'/home'
						})
					}
				})
			},
			toIndex(){
				this.$router.push({
					path:'/'
				})
			},
			//回车触发搜索事件，只有将事件绑定在document上才能不用获取焦点就触发事件
			enterClick() {
				var tg = this;
				document.onkeydown = function(e) {
					var key = window.event.keyCode;
					if (key == 13) {
						tg.login();
					}
				}
			}
		}
	}
</script>