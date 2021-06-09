<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <!-- 头像区域 -->
        <img src="~assets/img/login/person.svg" alt />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        label-width="0px"
        :rules="LoginFormRules"
        class="login_form"
        ref="loginFormRef"
        :model="form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="form.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-key" type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetFormData">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
 
<script>
import { LoginFun } from 'network/login'

export default {
  name: 'Login',
  data() {
    return {
      //表单的数据绑定
      form: {
        username: 'admin',
        password: '123456',
      },
      //表单的验证规则
      LoginFormRules: {
        //验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 20,
            message: '用户名长度在3到20个字符',
            trigger: 'blur',
          },
        ],
        //验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 10,
            message: '密码长度在6到10个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    //点击重置按钮
    resetFormData() {
      this.$refs.loginFormRef.resetFields()
    },
    //点击登录按钮
    login() {
      this.$refs.loginFormRef.validate((valid) => {
        if (!valid) return
        LoginFun(this.form)
          .then((res) => {
            console.log(res)
            if (res.meta.status != 200) {
              this.$message.error({
                message: '登录失败 , ' + res.meta.msg + ' ! ',
                showClose: true,
                onClose: () => {
                  console.log(123)
                },
              })
            } else {
              this.$message.success({
                message: '登录成功！',
                center: true,
                duration: 2000,
              })
              window.sessionStorage.setItem('token', res.data.token)
              this.$router.replace('/home')
            }
          })
          .catch((err) => {
            console.log(err)
          })
      })
    },
  },
  props: {},
  components: {},
  computed: {},
}
</script>
 
<style lang='less' scoped>
.login_container {
  background: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 460px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    overflow: hidden;
    padding: 10px;
    box-shadow: 0 0 10px #999;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 30px;
}
</style>