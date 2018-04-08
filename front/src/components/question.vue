<template>
	<div class="question">
		<div class="search-part clearfix">
			<el-input size="mini" v-model="keyWrods" placeholder="请输入内容"></el-input>
			<el-button size="mini" type="primary" icon="el-icon-search">搜索</el-button>
		</div>
		<div class="list-part">
			<ul>
				<li v-for='question in questions'>
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
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page.sync="currentPage3"
	      :page-size="100"
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
					}
				})
			}
		}
	}
</script>