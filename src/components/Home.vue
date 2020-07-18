<template>
  <el-container class="home_container">
    <el-header>
      <div>
        <img src="../assets/logo.png" width="50px" height="50px">
        <span>Vue start</span>
      </div>
      <el-button type="primary" @click="logout">退出</el-button></el-header>
<!--    主体栏-->
    <el-container>
<!--      侧边栏-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu background-color="#3399FF" :default-active="this.$route.path" router unique-opened text-color="#FFFFFF" active-text-color="#ffa200" :collapse="isCollapse" :collapse-transition="false">
          <!--一级导航-->
          <el-submenu :index="item.id.toString()" v-for="item in menulist" :key="item.id">
            <template slot="title"><i :class="iconsObj[item.id]"></i>{{ item.authName }}</template>
            <!--二级导航-->
            <el-menu-item :index="subItem.path.toString()" v-for="subItem in item.children" :key="subItem.id">
              <template slot="title"><i class="el-icon-menu"></i>{{ subItem.authName }}</template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menulist: [],
      iconsObj: {
        125: 'el-icon-s-custom',
        103: 'el-icon-s-platform',
        101: 'el-icon-s-ticket',
        102: 'el-icon-s-finance',
        145: 'el-icon-video-camera-solid'
      },
      isCollapse: false
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.menulist = res.data
      }
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  },
  created () {
    this.getMenuList()
  }
}
</script>

<style lang="less" scoped>
  .el-header{
    background-color: #FFFFFF;
    display: flex;
    justify-content: space-between;
    padding-left: 10px;
    align-items: center;
    > div{
      display: flex;
      align-items: center;
      span{
        margin-left: 15px;
      }
    }
  }
  .el-aside{
    background-color: #3399FF;
  }
  .el-main{
    background-color: #FFFFFF;
  }
  .home_container{
    height: 100%;
  }
  .el-icon-s-custom{
    margin-right: 10px;
  }
  .toggle-button{
    background-color: #2b4b6b;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
