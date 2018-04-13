<template>
	<div class="article">
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
			    <div class="title">{{ props.item.articleTitle }}</div>
			    <span class="author">作者：{{ props.item.articleAuthor }}</span>
			  </template>
			</el-autocomplete>
		</div>
		<div class="filter-part clearfix">
			<el-select v-model="firstTag" @change='getSecondTags' @clear='$router.go(0)' clearable placeholder="一级分类" size='mini'>
		    <el-option
		      v-for="tag in tags"
		      :key="tag.tagName"
		      :label="tag.tagName"
		      :value="tag.tagName">
		    </el-option>
		  </el-select>
		  <el-select v-model="secondTag" @change='changeSecondTags' clearable placeholder="二级分类" size='mini'>
		    <el-option
		      v-for="tag in secondTags"
		      :key="tag"
		      :label="tag"
		      :value="tag">
		    </el-option>
		  </el-select>
		</div>
		<div class="list-part">
			<ul>
				<li v-for='article in currentArticles'>
					<ul class="one-piece">
						<li class="clearfix">
							<p>
								<router-link :to="{path:'/article/details',query:{_id:article._id}}">
									{{article.articleTitle}}
								</router-link>
							</p>
						</li>
						<li class="clearfix">
							<p><router-link :to="{path:'/userInfo',query:{userName:article.articleAuthor}}">
									{{article.articleAuthor}}&nbsp
								</router-link> / {{article.articleFirstTag}} / {{article.articleSecondTag}} / {{article.articleCreatedTime}} / 赞：{{article.like.length}}</p>
						</li>
						<li class="clearfix">
							<p>{{article.articleIntroduce}}</p>
						</li>
					</ul>
				</li>
			</ul>
			<el-pagination
	      @current-change="changePage"
	      :page-size="pageSize"
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
				keyWords:'',
				articles:[],
				groupedArticles:[],
				currentArticles:[],
				pageSize:10,
				firstTag:'',
				secondTag:'',
				tags:[],
				secondTags:[]
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
						this.sortArticles(this.articles);
					}
				})
				axios.post('/confs/article/tags').then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						this.tags = res.result;
					}
				})
			},
			getSecondTags(val){
				if (val !== '') {
					this.tags.forEach((tag)=>{
						if (tag.tagName === val) {
							this.secondTags = tag.tagChild
						}
					})
				} else {
					this.secondTags = []
				}
				if (this.firstTag) {
					this.firstTagFilter();
				} else {
					this.sortArticles(this.articles);
				}
			},
			changeSecondTags(){
				if (this.secondTag) {
					this.secondTagFilter();
				} else {
					this.sortArticles(this.articles);
				}
			},
			firstTagFilter(){
				let passedArticles = [];
				this.articles.forEach((article)=>{
					if (article.articleFirstTag === this.firstTag) {
						passedArticles.push(article);
					}
				});
				this.sortArticles(passedArticles);
			},
			secondTagFilter(){
				let passedArticles = [];
				this.articles.forEach((article)=>{
					if (article.articleSecondTag === this.secondTag) {
						passedArticles.push(article);
					}
				});
				this.sortArticles(passedArticles);
			},
			sortArticles(articles){
				this.currentArticles = [];
				this.groupedArticles = [];
				for(let i=0,len=articles.length;i<len;i+=this.pageSize){
	        this.groupedArticles.push(articles.slice(i,i+this.pageSize));
	      }
	      this.currentArticles = this.groupedArticles[0]
			},
			changePage(val){
				this.currentArticles = this.groupedArticles[''+(val-1)+''];
			},
			querySearch(queryString, cb){
				let articles = this.articles;
        let results = queryString ? articles.filter(this.createFilter(queryString)) : articles;
        cb(results);
			},
			createFilter(queryString) {
        return (article) => {
          return (article.articleTitle.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        this.keyWords = item.articleTitle;
        this.search();
      },
			search(){
				axios.post('/articles/search',{
					keyWords:this.keyWords
				}).then((response)=>{
					let res = response.data;
					if (res.status === 0) {
						this.articles = res.result;
						this.sortArticles(this.articles);
					}
				})
			}
		}
	}
</script>