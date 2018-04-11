<template>
	<div class="question">
		<div class="search-part clearfix">
			<el-autocomplete
				size='small'
			  v-model="keyWords"
			  :fetch-suggestions="querySearch"
			  placeholder="请输入内容"
			  @select="handleSelect">
			  <i
			    class="el-icon-search el-input__icon"
			    size='small'
			    slot="suffix"
			    @click="search()">
			  </i>
			  <template slot-scope="props">
			    <div class="title">{{ props.item.questionTitle }}</div>
			    <span class="author">作者：{{ props.item.questionAuthor }}</span>
			  </template>
			</el-autocomplete>
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
							<p><router-link :to="{path:'/question/details',query:{_id:question._id}}">
									{{question.questionAuthor}}&nbsp
								</router-link>
						/ {{question.questionFirstTag}} / {{question.questionSecondTag}} / {{question.questionCreatedTime}} / 赞：{{question.like.length}}</p>
						</li>
						<li class="clearfix">
							<p>{{question.questionIntroduce}}</p>
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
				keyWords:'',
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
			sortQuestions(questions){
				this.currentQuestions = [];
				this.groupedQuestions = [];
				for(let i=0,len=questions.length;i<len;i+=this.pageSize){
	        this.groupedQuestions.push(questions.slice(i,i+this.pageSize));
	      }
	      this.currentQuestions = this.groupedQuestions[0]
			},
			changePage(val){
				this.currentQuestions = this.groupedQuestions[''+(val-1)+''];
			},
			querySearch(queryString, cb){
				let questions = this.questions;
        let results = queryString ? questions.filter(this.createFilter(queryString)) : questions;
        cb(results);
			},
			createFilter(queryString) {
        return (question) => {
          return (question.questionTitle.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        this.keyWords = item.questionTitle;
        this.search();
      },
			search(){
				axios.post('/questions/search',{
					keyWords:this.keyWords
				}).then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						this.questions = res.result;
						this.sortQuestions(this.questions);
					} else {}
				})
			}
		}
	}
</script>