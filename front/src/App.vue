<template>
  <div id="app">
    <common-login></common-login>
    <el-container>
      <el-header v-if="this.$route.path.split('/')[1] !== 'personalInfo'">
        <el-row :gutter="20">
          <el-col :span="14" :offset ='5'>
            <div class="nav-wrapper">
              <ul class="nav-main clearfix">
                <li>
                  <router-link to="/home">首页</router-link>
                </li>
                <li>
                  <router-link to="/article">文章</router-link>
                </li>
                <li>
                  <router-link to="/question">问答</router-link>
                </li>
                <li>
                  <router-link :to="{path:'/userInfo',query:{userId:getCookies('userId')}}">个人</router-link>
                </li>
                <li>
                  <router-link to="/messageBord">留言板</router-link>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>
        <common-footer></common-footer>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import './assets/style/clear.css'
import './assets/style/style.css'

import CommonLogin from './components/login'
import CommonFooter from './components/footer'

export default {
  name: 'App',
  data(){
    return{
    }
  },
  components:{
    CommonLogin,
    CommonFooter
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
  }
}
</script>

<style>
body{
  margin: 0;
  padding: 0;
}
#app {
  text-align: center;
}
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
