<template>
	<div class="conf-other">
		<div class="changePwd">
			<h3>修改密码</h3>
			<ul>
				<li class="clearfix">
					<p>请输入旧密码：</p><el-input type='password' v-model='oldPwd' size='mini'></el-input>
				</li>
				<li class="clearfix">
					<p>请输入新密码：</p><el-input type='password' v-model='newPwdFirst' size='mini'></el-input>
				</li>
				<li class="clearfix">
					<p>再次输入新密码：</p><el-input type='password' v-model='newPwdSecond' size='mini'></el-input>
				</li>
			</ul>
			<el-button @click='changePwd()' size='small' type="primary" plain>确定修改</el-button>
		</div>
	</div>
</template>
<script>
	import axios from 'axios'

	export default{
		data(){
			return{
				oldPwd:'',
				newPwdFirst:'',
				newPwdSecond:''
			}
		},
		mounted(){
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
			changePwd(){
				if (this.newPwdFirst !== this.newPwdSecond) {
					this.$message({
	          message: '两次输入的密码不一致',
	          type: 'warning'
	        });
				} else {
					axios.post('/users/changePwd',{
						userId:this.getCookies('userId'),
						oldPwd:this.oldPwd,
						newPwd:this.newPwdFirst
					}).then((response)=>{
						let res = response.data;
						if (res.status === 0) {
							this.$message({
			          message: '修改成功',
			          type: 'success'
			        });
						} else if(res.status === 10001){
							this.$message.error('初始密码错误');
						}else{
							this.$message.error('修改失败，请稍后再试');
						}
					})
				}
			},
		}
	}
</script>