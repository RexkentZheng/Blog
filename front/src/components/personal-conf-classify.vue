<template>
	<div class="conf-classify">
		<div class="btn-part">
			<el-button @click="changeType('article')" v-bind:disabled="classifyType === 'article'" type="primary" plain >文章分类</el-button>
			<el-button @click="changeType('qeustion')" v-bind:disabled="classifyType === 'qeustion'" type="primary" plain >问答分类</el-button>
		</div>
		<div class="content-part">
			<div  v-show="this.classifyType === 'article'" class="article-classify">
				<ul>
					<li>
						<el-button @click="addFirstTagBefore('article')" size='mini'>新建一级分类</el-button>
					</li>
					<li v-for='(articleTag,index) in articleTags' class="clearfix">
						<p class='first-name'>{{articleTag.tagName}}</p>
						<p class='opreation'>
							<span @click="delFirstTag('article',articleTag._id)">删除</span>
							<span @click='editTag(index,articleTag)'>编辑</span>
						</p>
						<ul v-show='nowIndex === index'>
							<li class="update">
								<el-input v-model='nowTagName' size='mini'></el-input>
								<el-input
								  type="textarea"
								  :autosize="{ minRows: 1, maxRows: 3}"
								  placeholder="请输入二级标签,中间用+号分隔"
								  v-model="nowTagChild">
								</el-input>
								<el-button @click='nowIndex = -1' size='mini' >取消</el-button>
								<el-button @click="modifyFirstTag('article',articleTag._id)" type='primary' size='mini' >确定</el-button>
							</li>
						</ul>
					</li>
				</ul>
			</div>
			<div  v-show="this.classifyType === 'qeustion'" class="question-classify">
				<ul>
					<li>
						<el-button @click="addFirstTagBefore('question')" size='mini'>新建一级分类</el-button>
					</li>
					<li v-for='(questionTag,index) in questionTags' class="clearfix">
						<p class='first-name'>{{questionTag.tagName}}</p>
						<p class='opreation'>
							<span @click="delFirstTag('question',questionTag._id)">删除</span>
							<span @click='editTag(index,questionTag)'>编辑</span>
						</p>
						<ul v-show='nowIndex === index'>
							<li class="update">
								<el-input v-model='nowTagName' size='mini'></el-input>
								<el-input
								  type="textarea"
								  :autosize="{ minRows: 1, maxRows: 3}"
								  placeholder="请输入二级标签,中间用+号分隔"
								  v-model="nowTagChild">
								</el-input>
								<el-button @click='nowIndex = -1' size='mini' >取消</el-button>
								<el-button @click="modifyFirstTag('question',questionTag._id)" type='primary' size='mini' >确定</el-button>
							</li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
	import axios from 'axios'

	export default{
		data(){
			return{
				classifyType:'',
				articleTags:[],
				questionTags:[],
				nowIndex:-1,
				nowTagName:'',
				nowTagChild:''
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
				axios.post('/confs/article/tags',{}).then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						this.articleTags = res.result;
					}
				});
				axios.post('/confs/question/tags',{}).then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						this.questionTags = res.result;
					}
				});
			},
			changeType(typeName){
				this.classifyType = typeName;
			},
			addFirstTag(type,firstName){
				axios.post(`/confs/${type}/addFirstTag`,{
					firstName
				}).then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						this.$message({
	            type: 'success',
	            message: '添加成功'
	          });
	          this.init();
					} else {
						this.$message.error('添加失败，请稍后再试');
					}
				})
			},
			delFirstTag(type,_id){
				axios.post(`/confs/${type}/delFirstTag`,{
					_id
				}).then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						this.$message({
	            type: 'success',
	            message: '删除成功'
	          });
	          this.init();
					} else {
						this.$message.error('删除失败，请稍后再试');
					}
				})
			},
			editTag(index,articleTag){
				this.nowIndex = index;
				this.nowTagName = articleTag.tagName;
				this.nowTagChild = articleTag.tagChild.join('+')
			},
			modifyFirstTag(type,_id){
				axios.post(`/confs/${type}/modifyFirstTag`,{
					_id,
					tagName:this.nowTagName,
					tagChild:this.nowTagChild.split('+'),
				}).then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						this.$message({
	            type: 'success',
	            message: '修改成功'
	          });
	          this.init();
	          this.nowIndex = -1;
					} else {
						this.$message.error('修改失败，请稍后再试');
					}
				})
			},
			addFirstTagBefore(type) {
        this.$prompt('请输入分类名称', '输入', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }).then(({ value }) => {
        	this.addFirstTag(type,value);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
		}
	}
</script>