<template>
  <div class="beautyFill">
    <div class="header">
      景区填报
      <div class="back" @click="back">
        <span class="leftArrow"></span>
        <span class="back">返回</span>
      </div>
    </div>
    <div class="content">
      <div class="tittle">
        <div class="system">景区填报系统</div>
        <div class="data">{{time |formatTime}}</div>
      </div>
      <ul class="wap">
        <li class="list">
          <span class="count">当日游客接待量</span>
          <img src="../../assets/image/beautyFill/star.png" alt="">
          <input ref="tirvalAccount" v-model="tirvalAccount" type="text" class="enter">
          <span class="unit">人数</span>
        </li>
        <li class="list">
          <span class="count">当日门票收入</span>
          <img src="" alt="">
          <input ref="monthSum" v-model="monthSum" type="text" class="enter">
          <span class="unit">元</span>
        </li>
        <li class="list">
          <span class="count">当日其它收入</span>
          <img src="" alt="">
          <input ref="anotherSum" v-model="anotherSum" type="text" class="enter">
          <span class="unit">元</span>
        </li>
        <li class="list">
          <span class="count">当日停车数</span>
          <img src="../../assets/image/beautyFill/star.png" alt="">
          <input ref="parkNum" v-model="parkNum" type="text" class="enter">
          <span class="unit">车位</span>
        </li>
        <li class="list">
          <span class="count">当日团队人数</span>
          <img src="../../assets/image/beautyFill/star.png" alt="">
          <input ref="teamPeopleNum" v-model="teamPeopleNum" type="text" class="enter">
          <span class="unit">位</span>
        </li>
        <li class="list">
          <span class="count">当日团队数</span>
          <img src="../../assets/image/beautyFill/star.png" alt="">
          <input ref="teamNum" v-model="teamNum" type="text" class="enter">
          <span class="unit">位</span>
        </li>
        <li class="list">
          <span class="count">当日散客人数</span>
          <img src="../../assets/image/beautyFill/star.png" alt="">
          <input ref="personal" v-model="personal" type="text" class="enter">
          <span class="unit">位</span>
        </li>
      </ul>
    </div>
    <div class="footer">
      <div class="btn" @click="save">保存</div>
    </div>
    <div class="layer" v-show="layer">
      <div class="layerOut"></div>
      <ul class="tittleBox">
        <li class="tittle">提示</li>
        <li class="content">{{remindContent}}</li>
        <li class="bottom">
          <div class="confirmBtn" @click="confirmBtn">确定</div>
          <div class="quitBtn" v-show="quitBtn">取消</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {getInputSceneDatas} from '../../api/beautyFill'
  import {goBeautyFillResult} from '../../api/projectIndex'

  export default {
    name: "beautyFill",
    data() {
      return {
        tirvalAccount: '',
        parkNum: '',
        teamNum: '',
        personal: '',
        quitBtn: false,
        remindContent: '',
        layer: false,
        monthSum: '',
        anotherSum: '',
        teamPeopleNum: '',
        page:this.$route.query.page,
        time:this.$route.query.time
      }
    },
    created() {
      this.loadHtml()
    },
    methods: {
      loadHtml() {
        if (this.page ==='fillResult') {
          goBeautyFillResult(this.$route.query.id).then(res => {
            this.tirvalAccount = res.data.data.todayReceive
            this.monthSum = res.data.data.todayTicket
            this.anotherSum = res.data.data.todayOther
            this.parkNum = res.data.data.stopNum
            this.teamPeopleNum = res.data.data.teamPeople
            this.teamNum = res.data.data.teamNum
            this.personal = res.data.data.otherPeople
          })
        }
      },
      //返回按钮 返回首页
      back() {
        this.$router.push({
          path: `/projectIndex`,
        })
      },
      //保存按钮
      save() {
        if (!this.tirvalAccount) {
          this.layer = true
          this.remindContent = '请输入游客接待量数'
          this.$refs.tirvalAccount.style.border = '1px solid #dc7777'
          return
        } else if (!this.parkNum) {
          this.layer = true
          this.remindContent = '请输入当日停车数'
          this.$refs.parkNum.style.border = '1px solid #dc7777'
          return
        } else if (!this.teamPeopleNum) {
          this.layer = true
          this.remindContent = '请输入当日团队人数'
          this.$refs.teamPeopleNum.style.border = '1px solid #dc7777'
          return
        } else if (!this.teamNum) {
          this.layer = true
          this.remindContent = '请输入当日团队数'
          this.$refs.teamNum.style.border = '1px solid #dc7777'
          return
        } else if (!this.personal) {
          this.layer = true
          this.remindContent = '请输入当月日散客数'
          this.$refs.personal.style.border = '1px solid #dc7777'
          return
        }

        var params = {
          id: this.$route.query.id,//从上个页面进来的
          todayReceive: Number(this.tirvalAccount),
          todayMoney: Number(this.monthSum),
          todayTicket: Number(this.monthSum) + Number(this.anotherSum),
          todayOther: Number(this.anotherSum),
          stopNum: Number(this.parkNum),
          teamNum: Number(this.teamNum),
          teamPeople: Number(this.teamPeopleNum),
          otherPeople: Number(this.personal),
          formDate: this.$route.query.date,
          ifWrite: '1'
        }
        //填报
        getInputSceneDatas(params).then(res => {
          if (res.data.code === 'OK') {
            this.$router.push({
              path: `/projectIndex`,
            })
          }
        })
      },
      //弹层按钮
      confirmBtn() {
        this.layer = false
      }
    },
    filters:{
      formatTime(item){
        var time = new Date(Number(item))
        var year = time.getFullYear()
        var month = time.getMonth() + 1 > 10 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)
        var day = time.getDate() >= 10 ? time.getDate() : '0' + time.getDate()

        var date = year+'年'+month+'月'+day+'日'
        return date
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
        .back {
          font-size: 16px !important;
        }
      }

    }
    .content {
      width: 100%;
      height: 80%;
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
        border: 1px solid rgba(202, 209, 220, 0.46);
        .list {
          width: 100%;
          height: 14.28%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .count {
            width: 31.5%;
            height: 100%;
            font-size: 13px !important;
            color: #73798A;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-right: 5px;
          }
          img {
            width: 5px;
            height: 5px;
            padding-right: 5px;
          }
          .enter {
            width: 53.2%;
            height: 30px;
            background: #F3F3FA;
            border-radius: 5px;
            border: none;
            display: flex;

          }
          .unit {
            font-size: 12px !important;
            color: #73798A;
            padding-left: 3px;
          }
        }
      }
    }
    .footer {
      width: 100%;
      height: 10%;
      .btn {
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
    .layer {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 100;
      .layerOut {
        width: 100%;
        height: 100%;
        opacity: 0.6;
        background: black;
        z-index: 10;
        position: absolute;
        top: 0;
        left: 0;
      }
      .tittleBox {
        width: 90%;
        margin-left: 5%;
        height: 240px;
        background: white;
        border-radius: 8px;
        z-index: 200;
        position: absolute;
        left: 0;
        top: 30%;
        .tittle {
          width: 100%;
          height: 30%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20px !important;
          color: rgba(9, 17, 63, 0.96);
        }
        .content {
          width: 100%;
          height: 40%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 16px !important;
        }
        .bottom {
          width: 100%;
          height: 30%;
          display: flex;
          justify-content: space-around;
          align-items: center;
          .confirmBtn {
            width: 25%;
            height: 60%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: green;
            color: white;
            font-size: 18px !important;
            -webkit-border-radius: 8px;
            -moz-border-radius: 8px;
            border-radius: 8px;
          }
          .quitBtn {
            width: 25%;
            height: 60%;
            background: gray;
            color: black;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 18px !important;
            -webkit-border-radius: 8px;
            -moz-border-radius: 8px;
            border-radius: 8px;
          }
        }
      }

    }
  }
</style>
