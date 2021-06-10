<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div class="title">电商管理系统学习</div>
      <el-button @click="logout" type="info">退出登录</el-button>
    </el-header>
    <!-- 页面主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="asidewidth">
        <div class="toggle-btn" @click="collapseMenu">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          :unique-opened="true"
          :collapse="isCollapse"
          active-text-color="#ffd04b"
          :collapse-transition="false"
          :router="true"
          :default-active="actPath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <!-- 二级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconOne[item.id]" class="ico"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+it.path"
              v-for="it in item.children"
              :key="it.id"
              @click="saveNavState('/'+it.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{it.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
 
<script>
import { getHomeData } from 'network/home'
export default {
  name: 'home',
  data() {
    return {
      //左侧菜单数据
      menuList: [],
      iconOne: {
        125: 'el-icon-s-custom',
        103: 'el-icon-folder-opened',
        101: 'el-icon-goods',
        102: 'el-icon-document',
        145: 'el-icon-s-marketing',
      },
      isCollapse: false,
      asidewidth: '200px',
      actPath: '',
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    getData() {
      getHomeData().then((res) => {
        console.log(res)
        if (res.meta.status != 200) return this.$message.error(res.meta.msg)
        this.menuList = res.data
      })
    },
    collapseMenu() {
      if (this.isCollapse) {
        this.isCollapse = false
        this.asidewidth = '200px'
      } else {
        this.isCollapse = true
        this.asidewidth = '64px'
      }
    },
    saveNavState(activePath) {
      this.actPath=this.$route.path
    },
  },
  created() {
    this.getData()
    this.actPath = this.$route.path
  },
  props: {},
  components: {},
  computed: {},
}
</script>
 
<style lang='less' scoped>
.el-container {
  height: 100vh;
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    .title {
      font-size: 30px;
      color: #fff;
      font-weight: bolder;
    }
  }
  .el-aside {
    background-color: #333744;
    // transition: all 1s;
    // overflow: hidden;
    .el-menu {
      border-right: none;
    }
    .toggle-btn {
      text-align: center;
      color: #fff;
      background-color: #4a5064;
      padding: 10px 0;
      font-size: 25px;
      cursor: pointer;
    }
    .ico {
      margin-right: 15px;
      font-size: 25px;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>