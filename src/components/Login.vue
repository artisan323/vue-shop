<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avater_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <el-form :model="loginForm" label-width="0px" class="login_form">
        <el-form-item >
          <el-input v-model="loginForm.username" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item >
          <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-search"></el-input>
        </el-form-item>

        <div class="btns">
          <el-button type="primary">登陆</el-button>
          <el-button type="info">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container{
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avater_box{
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position:  absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img{
        width: 100%;
        height: 100%;
        background-color: #eee;
        border-radius: 50%;
      }
    }
  }
  .btns{
    display: flex;
    justify-content: center;
  }
  .login_form{
    position: absolute;
    bottom: 25px;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
  }
</style>
