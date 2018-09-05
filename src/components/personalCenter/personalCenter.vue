<template>
    <div class="personalCenter">
      <div class="header">
        个人中心
        <span class="close" @click="back">
      <span class="rightBottom"></span>
      <span class="leftTop"></span>
    </span>
      </div>
      <div class="content">
        <div class="wap">
          <div class="countInfo">
            <div class="tittle">
              <img src="../../assets/image/personalCenter/person.png" >
              <span>账号信息</span>
            </div>
            <div class="count">
              <span class="tit">账号: </span>
              <span class="name">追风的人</span>
            </div>
            <div class="role">
              <span class="tit">角色: </span>
              <span class="actor">景区上报人员</span>
            </div>
          </div>
          <div class="personInfo">
            <div class="tittle">
              <img src="../../assets/image/personalCenter/count.png" >
              <span>个人信息</span>
            </div>
            <div class="count">
              <span class="tit">姓名 : </span>
              <span class="name">追风的人</span>
            </div>
            <div class="role">
              <span class="tit">联系方式 : </span>
              <span class="actor">13333333333</span>
            </div>
            <div class="sex">
              <span class="gender">性别 : </span>
              <span class="female">男</span>
            </div>
          </div>
        </div>
      </div>
      <div class="footer" @click="loginOut">
        <div class="btn">退出登录</div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "personalCenter",
      methods:{
        back(){
          this.$router.push({
            path:'/projectIndex'
          })
        },
        loginOut(){
          this.$router.push({
            path:'/'
          })
        }
      }
    }
</script>

<style scoped lang="scss">
  .personalCenter{
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
      width: 100%;
      height: 75%;
      .wap{
        width: 90%;
        height: 100%;
        margin-left: 5%;
        .countInfo{
          width: 100%;
          box-shadow: #666 0px 0px 5px;
          margin-top: 30px;
          border-radius: 5px;
          .tittle{
            width: 100%;
            height: 30px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding-top: 10px;
            img{
              width: 20px;
              height: 20px;
              padding-left: 10px;
            }
            span{
              font-size: 18px !important;
              color:  #727785;
              padding-left: 8px;
            }
          }
          .count{
            width: 100%;
            height: 40px;
            .tit{
              font-size:14px !important;
              padding-left: 20px;
              line-height: 50px;
              color: #727785;
            }
            .name{
              font-size:14px !important;
              line-height: 50px;
              color:  #878D9D;
            }
          }
          .role{
            width: 100%;
            height: 30px;
            padding-bottom: 15px;
            .tit{
              font-size:14px !important;
              padding-left: 20px;
              line-height: 30px;
              color:  #878D9D;
            }
            .actor{
              font-size:14px !important;
              line-height: 30px;
              color:  #878D9D;
            }
          }
        }
        .personInfo{
          width: 100%;
          box-shadow: #666 0px 0px 5px;
          margin-top: 30px;
          border-radius: 5px;
          .tittle{
            width: 100%;
            height: 30px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding-top: 10px;
            img{
              width: 20px;
              height: 20px;
              padding-left: 10px;
            }
            span{
              font-size: 18px !important;
              color:  #727785;
              padding-left: 8px;
            }
          }
          .count{
            width: 100%;
            height: 40px;
            .tit{
              font-size:14px !important;
              padding-left: 20px;
              line-height: 50px;
              color: #727785;
            }
            .name{
              font-size:14px !important;
              line-height: 50px;
              color:  #878D9D;
            }
          }
          .role{
            width: 100%;
            height: 30px;
            .tit{
              font-size:14px !important;
              padding-left: 20px;
              line-height: 30px;
              color:  #878D9D;
            }
            .actor{
              font-size:14px !important;
              line-height: 30px;
              color:  #878D9D;
            }
          }
          .sex{
            width: 100%;
            height: 30px;
            padding-bottom: 15px;
            .gender{
              font-size:14px !important;
              padding-left: 20px;
              line-height: 30px;
              color:  #878D9D;
            }
            .female{
              font-size:14px !important;
              line-height: 30px;
              color:  #878D9D;
            }
          }
        }
      }
    }
    .footer{
      width: 100%;
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
