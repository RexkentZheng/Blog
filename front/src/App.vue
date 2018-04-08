<template>
  <div id="app">
    <common-login></common-login>
    <el-container>
      <el-header>
        <el-row :gutter="20">
          <el-col :span="14" :offset ='5'>
            <div class="nav-wrapper">
              <ul class="nav-main clearfix">
                <li>
                  <router-link to="/article">文章</router-link>
                </li>
                <li>
                  <router-link to="/question">问答</router-link>
                </li>
                <li>
                  <router-link to="/personalInfo">个人</router-link>
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
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<script>
import './assets/style/clear.css'
import './assets/style/style.css'

import CommonLogin from './components/login'

export default {
  name: 'App',
  data(){
    return{
    }
  },
  components:{
    CommonLogin
  },
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
