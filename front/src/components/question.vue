<template>
	<div class="question">
		<div class="search-part clearfix">
			<el-input size="mini" v-model="keyWrods" placeholder="请输入内容"></el-input>
			<el-button size="mini" type="primary" icon="el-icon-search">搜索</el-button>
		</div>
		<div class="list-part">
			<ul>
				<li v-for='question in currentQuestions'>
					<ul class="one-piece">
						<li class="clearfix">
							<p>
								<router-link :to="{path:'/question/details',query:{_id:question._id}}">
									{{question.questionTitle}}
								</router-link>
							</p>
						</li>
						<li class="clearfix">
							<p>{{question.questionCreatedTime}}</p>
							<p>{{question.questionAuthor}}</p>
						</li>
					</ul>
				</li>
			</ul>
			<el-pagination
	      @current-change="changePage"
	      :page-size="pageSize"
	      layout="total, prev, pager, next, jumper"
	      :total="questions.length">
	    </el-pagination>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'

	export default{
		data(){
			return{
				keyWrods:'',
				questions:[],
				groupedQuestions:[],
				currentQuestions:[],
				pageSize:10,
			}
		},
		mounted(){
			this.init();
		},
		methods:{
			init(){
				axios.post('/questions/all').then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						this.questions = res.result;
						for(var i=0,len=this.questions.length;i<len;i+=this.pageSize){
			        this.groupedQuestions.push(this.questions.slice(i,i+this.pageSize));
			      }
			      this.currentQuestions = this.groupedQuestions[0]
					}
				})
			},
			changePage(val){
				this.currentQuestions = this.groupedQuestions[''+(val-1)+''];
			}
		}
	}
</script>