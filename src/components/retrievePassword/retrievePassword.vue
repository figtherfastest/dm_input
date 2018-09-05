<template>
<div class="RetrievePassword">
  <div class="header">
    找回密码
    <span class="close" @click="back">
      <span class="rightBottom"></span>
      <span class="leftTop"></span>
    </span>
  </div>
  <div class="content">
    <div class="says">请联系管理员对您进行密码重置操作</div>
    <div class="connect">
      <a href="tel:13562662566">
        <span class="tel">联系电话：</span>
        <span class="number">13562662566</span>
      </a>
    </div>
  </div>
  <div class="footer" @click="back">
      <div class="btn">确认</div>
  </div>
</div>
</template>

<script>
    export default {
        name: "retrievePassword",
        methods:{
          back(){
            this.$router.push({
              path: `/`
            })
          }
        }
    }
</script>

<style scoped lang="scss">
  .RetrievePassword{
    width: 100%;
    height: 100%;
    .header{
      width: 100%;
      height: 8%;
      background:rgba(61,133,236,1);
      text-align: center;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px!important;
      .close{
        width: 25px;
        height: 25px;
        position: relative;
        position: absolute;
        top: 10px;
        left: 15px;
        .rightBottom{
          display: block;
          width: 25px;
          height: 1px;
          background:#FFFFFF;
          transform: rotate(45deg);
          position: absolute;
          top: 15px;
          left: 1px;
        }
        .leftTop{
          display: block;
          width: 25px;
          height: 1px;
          background:#FFFFFF;
          transform: rotate(-45deg);
          position: absolute;
          top: 15px;
          left: 1px;
        }
      }
    }
    .content{
      width: 80%;
      margin-left: 10%;
      margin-top: 50px;
      .says{
        width: 100%;
        font-size: 16px !important;
        color: #878D9D;
        line-height: 50px;
      }
      .connect{
        width: 100%;
        display: flex;
        justify-content: flex-start;
        a{
          text-decoration: none;
          .tel{
            color: #878D9D;
            font-size: 18px;
          }
          .number{
            color: #3D85EC;
            font-size: 18px;
          }
        }
      }
    }
    .footer{
      width: 100%;
      margin-top: 99%;
      .btn{
        width: 80%;
        margin-left: 10%;
        height: 45px;
        border-radius: 50px;
        font-size: 21px !important;
        color: #FFFFFF;
        display: block;
        text-align: center;
        line-height: 45px;
        background: #579BFE;
      }

    }
  }
</style>
