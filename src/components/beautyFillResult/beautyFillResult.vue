<template>
  <div class="beautyFill">
    <div class="header">
      景区填报
      <div class="back" @click="back">
        <span class="leftArrow"></span>
        <span>返回</span>
      </div>
    </div>
    <div class="content">
      <div class="tittle">
        <div class="system">丽江景区填报系统</div>
        <div class="data">{{loadData.formDate | formDate}}</div>
      </div>
      <ul class="wap">
        <li class="list">
          <span class="count">当日游客接待量</span>
          <span class="unit">
            <span class="num">{{loadData.todayReceive}}</span>
            <span class="countss">人数</span>
          </span>
        </li>
        <li class="list">
          <span class="count">当日门票收入</span>
          <span class="unit">
            <span class="num">{{loadData.todayTicket}}</span>
            <span class="countss">人数</span>
          </span>
        </li>
        <li class="list">
          <span class="count">当日其他收入</span>
          <span class="unit">
            <span class="num">{{loadData.todayOther}}</span>
            <span class="countss">人数</span>
          </span>
        </li>
        <li class="list">
          <span class="count">当日停车数</span>
          <span class="unit">
            <span class="num">{{loadData.stopNum}}</span>
            <span class="countss">人数</span>
          </span>
        </li>
        <li class="list">
          <span class="count">当日团队人数</span>
          <span class="unit">
            <span class="num">{{loadData.teamPeople}}</span>
            <span class="countss">人数</span>
          </span>
        </li>
        <li class="list">
          <span class="count">当日散客数</span>
          <span class="unit">
            <span class="num">{{loadData.otherPeople}}</span>
            <span class="countss">人数</span>
          </span>
        </li>
      </ul>
    </div>
    <div class="fix" @click="toBeautyFill">
      <div class="btn">修改</div>
    </div>
    <div class="footer">
      <div class="wap" >
        <div class="toIndex" @click="toIndex">
          <img src="../../assets/image/projectIndex/indexUnchoosed.png" alt="">
          <span class="tit">首页</span>
        </div>
        <div class="toInput" >
          <!--@click="toInput"-->
          <img src="../../assets/image/projectIndex/input.png" alt="">
          <span class="tit">填报</span>
        </div>
        <div class="personCenter" @click="toPersonCenter">
          <img src="../../assets/image/projectIndex/personCenterUnchoosed.png" alt="">
          <span class="tit">个人中心</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {goBeautyFillResult} from '../../api/projectIndex'
  export default {
    name: "beautyFillResult",
    data(){
      return{
        loadData:{},
        id:this.$route.query.id
      }
    },
    created(){
      this.goBeautyFillResult(this.id)
    },
    methods:{
      goBeautyFillResult(data) {
        goBeautyFillResult(data).then(res => {
         this.loadData = res.data.data
          console.log(this.loadData);
        })
      },
      back(){
        this.$router.push({
          path:'/projectIndex'
        })
      },
      toBeautyFill(){
        this.$router.push({
          path:'/beautyFill',
          query:{
            id: this.id,
            page:'fillResult',
            time:this.$route.query.time
          }
        })
      },
      toIndex(){
        this.$router.push({
          path:'/projectIndex'
        })
      },
      toPersonCenter(){
        this.$router.push({
          path: '/personalCenter'
        })
      }
    },
    filters:{
      formDate(item){
        var time = new Date(item)
        var year = time.getFullYear()
        var month = time.getMonth() + 1 > 10 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)
        var day = time.getDate() >= 10 ? time.getDate() : '0' + time.getDate()
        var dates =year+'年'+month+'月'+day+'日'
        return dates
      }
    }
  }
</script>

<style scoped lang="scss">
  .beautyFill {
    width: 100%;
    height: 100%;
    .header {
      width: 100%;
      height: 8%;
      background: #3d85ec;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px !important;
      color: white;
      .back {
        width: 80px;
        height: 8%;
        color: white;
        position: absolute;
        left: 20px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .leftArrow {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-top: 1px solid #fff;
          border-left: 1px solid #fff;
          transform: rotate(-45deg);
        }
      }

    }
    .content {
      width: 100%;
      height: 69%;
      .tittle {
        width: 82%;
        margin-left: 10%;
        height: 16%;
        .system {
          width: 100%;
          height: 60%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #3D85EC;
          font-size: 20px !important;
        }
        .data {
          width: 100%;
          height: 40%;
          text-align: center;
          color: #73798A;
          font-size: 18px !important;
        }
      }
      .wap {
        width: 90%;
        height: 78%;
        margin-left: 5%;
        border-radius: 10px;
        .list {
          width: 100%;
          height: 13.5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3%;
          box-shadow: #666 0 0 5px;
          border-radius: 5px;
          .count {
            width: 50%;
            height: 100%;
            font-size: 14px !important;
            color: #73798A;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding-left: 7%;
          }
          .unit {
            width: 50%;
            font-size: 12px !important;
            color: #73798A;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-right: 7%;
            .num {
              color: #727785;
              font-family: "Digital-7Mono";
              font-size: 22px !important;
            }
            .countss {
              font-size: 12px !important;
              padding-left: 4%;
              width: 20%;
            }
          }
        }
      }
    }
    .fix {
      width: 100%;
      height: 7%;
      .btn {
        width: 80%;
        margin-left: 10%;
        height: 50px;
        border-radius: 50px;
        font-size: 21px !important;
        color: #FFFFFF;
        display: block;
        text-align: center;
        line-height: 50px;
        background: #579BFE;
      }

    }
    .footer {
      width: 100%;
      height: 14%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f0f1f6;
      margin-top: 4%;
      .wap {
        width: 90%;
        margin-left: 5%;
        height: 90%;
        margin-top: 2%;
        display: flex;
        justify-content: space-between;
        .toIndex {
          width: 30%;
          height: 92%;
          margin-right: 4%;
          border-radius: 6px;
          background: #fff;
          img {
            width: 42%;
            height: 53%;
            display: block;
            text-align: center;
            margin: 0 auto;
            margin-top: 10%;
          }
          .tit {
            width: 100%;
            height: 20%;
            text-align: center;
            display: block;
            margin-top: 3%;
          }
        }
        .toInput {
          width: 30%;
          height: 92%;
          margin-right: 4%;
          border-radius: 6px;
          background: #fff;
          img {
            width: 42%;
            height: 53%;
            display: block;
            text-align: center;
            margin-left: 32%;
            margin-top: 10%;
          }
          .tit {
            width: 100%;
            height: 20%;
            text-align: center;
            display: block;
            margin-top: 3%;
          }
        }
        .personCenter {
          width: 30%;
          height: 92%;
          border-radius: 6px;
          background: #fff;
          img {
            width: 42%;
            height: 53%;
            display: block;
            text-align: center;
            margin: 0 auto;
            margin-top: 10%;
          }
          .tit {
            width: 100%;
            height: 20%;
            text-align: center;
            display: block;
            margin-top: 3%;
          }
        }
      }

    }
  }
</style>
