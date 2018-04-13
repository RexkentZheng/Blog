<template>
	<div class="info-edit">
		<ul>
			<li>
				<el-button @click="HPFlag = true" plain type='primary' size='small'>替换头像</el-button>
				<my-upload field="user" @crop-success="cropSuccess" @crop-upload-success="cropUploadSuccess" v-model="HPFlag" :width="300" :height="300" url="/personalInfos/HP" :params="data"  img-format="png"></my-upload>
				<img :src="imgDataUrl">
			</li>
			<li class="clearfix">
				<p>电话：</p>
				<el-input v-model='personalInfo.userTel' size='small'></el-input>
			</li>
			<li class="clearfix">
				<p>邮箱：</p>
				<el-input v-model='personalInfo.userEmail' size='small'></el-input>
			</li>
			<li class="clearfix">
				<p>生日：</p>
				<el-date-picker
					size='small'
		      v-model="personalInfo.userBirthday"
		      type="date"
		      placeholder="选择日期">
    </el-date-picker>
			</li>
			<li class="clearfix">
				<p>座右铭：</p>
				<el-input v-model='personalInfo.userMotto'  size='small'></el-input>
			</li>
			<li class="clearfix">
				<p>简介：</p>
				<el-input v-model='personalInfo.userIntroduce' type='textarea' size='small'></el-input>
			</li>
			<li>
				<el-button @click='changeInfo()' plain type='primary' size='small'>确定</el-button>
			</li>
		</ul>
	</div>
</template>
<script>
	import axios from 'axios'
	import myUpload from 'vue-image-crop-upload'

	export default{
		data(){
			return{
				personalInfo:{},
				HPFlag:false,
				mottoFlag:false,
				introduceFlag:false,
				imgDataUrl:'./../static/default.png',
				data:{
					id:'',
					name:''
				},
				date:'',
			}
		},
		components:{
			'my-upload': myUpload
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
				axios.post('/personalInfos/detailsById',{
					userId:this.getCookies('userId')
				}).then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						this.personalInfo = res.result;
						this.data.id = this.personalInfo.userId;
						this.data.name = 'user';
						if (this.personalInfo.userHP) {
							this.imgDataUrl = this.personalInfo.userHP
						}
					}
				})
			},
			cropSuccess(imgDataUrl, field){
          this.imgDataUrl = imgDataUrl;
      },
			cropUploadSuccess(jsonData, field) {
				this.personalInfo.userHP = './../static/images/'+this.data.id+'-'+this.data.name+'.png'
			},
			changeInfo(){
				let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
				if (!reg.test(this.personalInfo.userEmail)) {
					this.$message({
						message:'请输入正确的邮箱',
						type:'warning'
					})
					return;
				}
				if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.personalInfo.userTel))){
					this.$message({
						message:'请输入正确的电话',
						type:'warning'
					})
				}
				axios.post('/personalInfos/change',{
					allInfo:this.personalInfo
				}).then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						this.$message({
				      message: '修改成功',
				      type: 'success'
				    });
						this.init();
					}
				})
			},
		}
	}
</script>