<template>
  <div class="user-info">
    <ul>
      <li>
        <img :src="userInfo.baseInfo.userHP">
      </li>
      <li v-if='userInfo.baseInfo.userName' class="clearfix">
        <p>用户名：</p>
        <p>{{userInfo.baseInfo.userName}}</p>
      </li>
      <li v-if='userInfo.baseInfo.userTel' class="clearfix">
        <p>电话</p>
        <p>{{userInfo.baseInfo.userTel}}</p>
      </li>
      <li v-if='userInfo.baseInfo.userEmail' class="clearfix">
        <p>邮箱</p>
        <p>{{userInfo.baseInfo.userEmail}}</p>
      </li>
      <li v-if='userInfo.baseInfo.userMotto' class="clearfix">
        <p>座右铭</p>
        <p>{{userInfo.baseInfo.userMotto}}</p>
      </li>
      <li v-if='userInfo.baseInfo.userIntroduce' class="clearfix">
        <p>简介</p>
        <p>{{userInfo.baseInfo.userIntroduce}}</p>
      </li>
    </ul>
    <div class="user-questions">
      <h3>用户问答</h3>
      <p v-if='userInfo.questions.length === 0'>此用户未创建任何问答</p>
      <ul v-if='userInfo.questions !== []'>
        <li v-for='question in userInfo.questions'>
          <ul class="one-piece">
            <li class="clearfix">
              <p>
                <router-link :to="{path:'/question/details',query:{_id:question._id}}">
                  {{question.questionTitle}}
                </router-link>
              </p>
            </li>
            <li class="clearfix">
              <p>&nbsp<router-link :to="{path:'/userInfo',query:{userId:question.questionAuthor}}">
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
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      userInfo:{
        baseInfo:{},
        questions:[],
      }
    }
  },
  mounted(){
    this.init();
  },
  methods:{
    init(){
      //获取用户基本信息
      if (this.$route.query.userId) {
        axios.post('/personalInfos/detailsById',{
          userId:this.$route.query.userId
        }).then((response)=>{
          let res = response.data;
          if (res.status === 0) {
            this.userInfo.baseInfo = res.result;
            //获取用户问答
            axios.post('/questions/list',{
              questionAuthor:this.userInfo.baseInfo.userName
            }).then((response)=>{
              let res = response.data;
              if (res.status === 0) {
                this.userInfo.questions = res.result;
              }
            })
          }
        })
      } else if (this.$route.query.userName) {
        axios.post('/personalInfos/detailsByName',{
          userName:this.$route.query.userName
        }).then((response)=>{
          let res = response.data;
          if (res.status === 0) {
            this.userInfo.baseInfo = res.result;
            //获取用户问答
            axios.post('/questions/list',{
              questionAuthor:this.userInfo.baseInfo.userName
            }).then((response)=>{
              let res = response.data;
              if (res.status === 0) {
                this.userInfo.questions = res.result;
              }
            })
          }
        })
      }else{
        this.$message({
          message:'非法路由',
          type:'warning'
        })
        this.$router.push({
          path:'/home'
        })
      }
    }
  }
}
</script>