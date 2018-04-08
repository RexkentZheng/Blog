<template>
	<div class="article">
		<div class="search-part clearfix">
			<el-input size="mini" v-model="keyWrods" placeholder="请输入内容"></el-input>
			<el-button size="mini" type="primary" icon="el-icon-search">搜索</el-button>
		</div>
		<div class="list-part">
			<ul>
				<li v-for='article in articles'>
					<ul class="one-piece">
						<li class="clearfix">
							<p>
								<router-link :to="{path:'/article/details',query:{_id:article._id}}">
									{{article.articleTitle}}
								</router-link>
							</p>
						</li>
						<li class="clearfix">
							<p>{{article.articleCreatedTime}}</p>
							<p>{{article.articleAuthor}}</p>
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
	      :total="articles.length">
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
				articles:[],
				groupedArticles:[],
				currentArticles:[],
			}
		},
		mounted(){
			this.init();
		},
		methods:{
			init(){
				axios.post('/articles/all').then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						this.articles = res.result;
					}
				})
			}
		}
	}
</script>