<template>
	<div class="message">
		<el-button @click='newMessageFlag=true' v-if="getCookies('userType') !== 1" type="primary" size='small' plain>新建留言</el-button>
		<div class="new-message" v-if='newMessageFlag'>
			<el-input v-model='newMessage'></el-input>
			<el-button @click='subminMessgae()'type="primary" size='mini' plain>确定提交</el-button>
			<el-button @click='newMessageFlag=false' size='mini' plain>取消</el-button>
		</div>
		<ul>
			<li>
				<ul v-for='(message,index) in messages' class="one-piece clearfix">
					<li class="clearfix">
						<p class="content-author">{{message.messageBoardUserName}}</p>
						<i @click='nowChild === index ? nowChild = -1 : nowChild = index' v-if='message.messageBoardChildren.length>0' :class="nowChild === index ? 'el-icon-caret-top':'el-icon-caret-bottom'"></i>
						<p v-if=" parseFloat(getCookies('userType')) === 1" class="del">删除</p>
						<p @click='nowIndex = index' v-if="getCookies('userType') !== 1" class="rep">回复</p>
					</li>
					<li class="clearfix">
						<p class="main-content">
							{{message.messageBoardContent}}
						</p>
						<p class="created-time">
							{{message.messageBoardCreatedTime}}
						</p>
					</li>
					<li class="clearfix">
						<ul v-if='index === nowChild' class="content-children">
							<li v-for='messageBoardChild in message.messageBoardChildren' class="clearfix">
								<p>{{messageBoardChild.messageBoardContent}}</p>
								<p>{{messageBoardChild.messageBoardUserName}}</p>
							</li>
						</ul>
					</li>
					<li v-show='index === nowIndex' class="reply-new clearfix">
						<el-input size="mini" v-model="replyMessage" placeholder="请输入回复内容"></el-input>
						<el-button @click='nowIndex = -1' size="mini">取消</el-button>
						<el-button @click='submitReply(message._id)' size="mini" type="primary">确定</el-button>
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
				newMessage:'',
				newMessageFlag:false,
				replyMessage:'',
				messages:[],
				nowIndex:-1,
				nowChild:-1,
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
				axios.post('/messageBords/list').then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						this.messages = res.result;
						this.messages.forEach((item)=>{
							item['isChildrenShow'] = false;
							item['isReplyShow'] = false;
						})
					}
				})
			},
			subminMessgae(){
				axios.post('/messageBords/create',{
					messageBoardUserName:this.getCookies('userName'),
					messageBoardContent:this.newMessage
				}).then((response)=>{
					let res =response.data;
					if (res.status === 0) {
						alert('提交成功');
						this.$router.go(0);
					}
				})
			},
			changeReply(message){
				this.messages.forEach((item)=>{
					if (item._id === message._id) {
						item.isReplyShow = !item.isReplyShow
					}
				})
			},
			submitReply(messageId){
				axios.post('/messageBords/reply',{
					messageBoardUserName:this.getCookies('userName'),
					messageBoardContent:this.replyMessage,
					_id:messageId
				}).then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						alert('提交成功');
						this.$router.go(0);
					}
				})
			}
		}
	}
</script>