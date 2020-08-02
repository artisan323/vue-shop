<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avater_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">

        <el-form-item  prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-search"></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-search"></el-input>
        </el-form-item>

        <div class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
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
      },
      // 表单验证规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入登陆名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符之间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      // console.log(this) 通过 this 对象获取表单示例
      this.$refs.loginFormRef.resetFields()
    },
    async login () {
      this.$refs.loginFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res)
        // 消息弹出框
        if (res.meta.status !== 200) {
          this.$message.error('登录失败！')
        } else {
          this.$message({
            message: '登陆成功!',
            type: 'success'
          })
          // 保存 token
          console.log(res.data.token)
          window.sessionStorage.setItem('token', res.data.token)
          // 跳转页面
          this.$router.push('/home')
        }
      })
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
