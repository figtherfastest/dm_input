<template>
  <div class="index">
    <div class="content">
      <div class="footer">
        <div class="tittle">账号登录</div>
        <div class="count">
          <input v-model="countNumber" type="text" placeholder="请输入你的账号">
          <span v-show="countState">账号错误，重新输入或联系管理员</span>
          <span v-show="inputCount">请输入账号</span>
        </div>
        <div class="password">
          <input v-model="passWordNum" type="password" placeholder="请输入你的密码">
          <span v-show="passwordState">密码错误</span>
          <span v-show="inpuyPsd">请输入密码</span>
        </div>
        <div class="login">
          <div class="btn" @click="login">登录</div>
          <span class="forgetPassword" @click="forgetPassword" v-show="forgetPasswordRemind">忘记密码</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'index',
    data() {
      return {
        loading: 0,
        countState: false,
        inputCount: false,
        passwordState: false,
        inpuyPsd: false,
        forgetPasswordRemind: true,
        countNumber: '',
        passWordNum: ''
      }
    },

    methods: {
      forgetPassword() {
        this.$router.push({
          path: `/RetrievePassword`
        })
      },
      login() {
        if (!this.countNumber) {
          this.inputCount = true
          return
        } else if (!this.passWordNum) {
          this.inpuyPsd = true
          this.inputCount = false
          return
        }
        //这边是个借口，如果登录成功，那就跳转到首页
        this.$router.push({
          path: `/projectIndex`
        })


      }
    },
  }
</script>

<style scoped lang="scss">
  .index {
    width: 100%;
    height: 100%;
    .content {
      width: 100%;
      height: 100%;
      background: url("../assets/image/index/indexBg.png") no-repeat center;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      .footer {
        width: 68.3%;
        margin-left: 15.5%;
        height: 47.9%;
        background: url("../assets/image/index/loginBrick.png") no-repeat;
        background-size: 100% 100%;
        .tittle{
          width: 100%;
          height: 20%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #0066ff;
          font-size: 16px !important;
          font-weight: bolder;
          margin-top: 3%;
        }
        .count {
          width: 80%;
          margin-left: 10%;
          height: 18%;
          input {
            width: 100%;
            height: 54%;
            border: none;
            font-size: 12px;
            color: #B6B9C4;
            display: block;
            background: #F3F3FA;
            border-radius: 6px;
            padding-left: 5%;
            margin-top: 5%;
          }
          span {
            font-size: 10px;
            color: #FF6464;
            padding-left: 7%;
            display: inline-block;
            margin-top: 3px;
          }
        }
        .password {
          width: 80%;
          margin-left: 10%;
          height: 18%;
          margin-top: 2%;
          input {
            width: 100%;
            height: 54%;
            border: none;
            font-size: 12px;
            color: #B6B9C4;
            display: block;
            background: #F3F3FA;
            border-radius: 6px;
            padding-left: 5%;
            margin-top: 5%;
          }
          span {
            font-size: 10px;
            color: #FF6464;
            padding-left: 7%;
            display: inline-block;
            margin-top: 3px;
          }
        }
        .login {
          width: 80%;
          margin-left: 10%;
          height: 20%;
          margin-top: 9%;
          .btn {
            width: 100%;
            height: 60%;
            border-radius: 6px;
            font-size: 21px !important;
            color: #FFFFFF;
            display: block;
            text-align: center;
            line-height: 45px;
            background: #579BFE;
          }
          span {
            font-size: 10px;
            color: #FF6464;
            margin-top: 3px;
            display: flex;
            justify-content: center;
            color: #1a224a;;
          }
        }
      }
    }
  }

</style>--
