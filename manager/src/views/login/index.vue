<template>
    <div class="container">
      <div class="box">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <!-- 输入用户名 -->
          <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <!-- 输入密码 -->
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <!-- 输入验证码 -->
          <el-form-item label="验证码" prop="captcha">
            <el-input type="text" v-model="ruleForm.captcha" autocomplete="off">
              <template slot="append">
                <!-- v-html 直接将该变量内的字符串变成 html 元素 -->
                <!-- 点击时重新获取（刷新）验证码 -->
                <div v-html="captchaPic" @click="getCode"></div>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <!-- 登录按钮与重置表单按钮 -->
            <el-button class="btn" type="primary" @click="login('ruleForm')">登录</el-button>
            <el-button class="btn" @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      //检查用户名
      let checkUsername = (rule, value, callback) => {
        //不能为空
        if (value === '') callback(new Error('用户名不能为空'));
        else callback();
      };
      //检查密码
      let checkPassword = (rule, value, callback) => {
        //不能为空
        if (value === '') callback(new Error('密码不能为空'));
        else callback();
      };
      //检查验证码
      let checkCaptcha = (rule, value, callback) => {
        //验证码是否正确
        if (value != this.captchaAns) callback(new Error('验证码错误'));
        else callback();
      };
      return {
        //验证码答案
        captchaAns: '',
        //验证码 svg 图
        captchaPic: '',
        ruleForm: {
          //用户名，密码，输入的验证码
          username: '',
          password: '',
          captcha: '',
        },
        rules: {
          username: [
            //使用的验证方法是 checkUsername
            { validator: checkUsername, trigger: 'blur' }
          ],
          password: [
            { validator: checkPassword, trigger: 'blur' }
          ],
          captcha: [
            { validator: checkCaptcha, trigger: 'blur' }
          ],
        }
      };
    },
    methods: {
      //登录验证
      login(formName) {
        //这里会先验证表单是否正确，然后参数为一个回调函数
        //我们在回调函数里面编写请求后端服务器登录
        this.$refs[formName].validate((res) => {
          //如果校验通过
          if (res) {
            //获取参数
            let username = this.ruleForm.username;
            let password = this.ruleForm.password;
            //请求登录
            axios.post('/users/backend/login', {username, password})
              .then(({data: {code}}) => {
                if (code == 1) {
                  //响应拦截器里面会设置 token 跟 uid，这里就不用设置了
                  //跳转到主页
                  this.$router.push({ path: this.redirect || '/' });
                } else {
                  //登录失败
                  alert('用户名或密码错误');
                }
              })
          } else {
            //校验未通过
            console.log('参数错误');
            return false;
          }
        });
      },
      //重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
        //重置也刷新验证码
        this.getCode();
      },
      //获取验证码
      getCode() {
        //请求获取验证码
        axios.get('/users/backend/code')
          .then(({data: {code, data: {text, data}}}) => {
            if (code != 1) return alert('获取验证码失败');
            //验证码的答案
            this.captchaAns = text;
            //验证码的 svg 图
            this.captchaPic = data;
            //输出一遍答案，我自己都看不清图片
            console.log(text);
          });
      }
    },
    created() {
      //创建时获取一次验证码
      this.getCode();
    }
  }
  </script>
  
  <style scoped>
  .container {
    width: 100vw;
    height: 100vh;
    background-image: url('../image/image.webp');
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .box {
    width: 450px;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  .btn {
    width: 46%;
  }
  </style>
  