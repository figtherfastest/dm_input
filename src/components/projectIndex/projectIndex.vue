<template>
  <div class="projectIndex">
    <div class="header">
      景区填报系统
      <div class="back">
        <span class="leftArrow"></span>
        <span class="back">返回</span>
      </div>
    </div>
    <div class="content">
      <ul class="report">
        <li class="hasReport" v-show="tittleData.ifWrite == '1'">
          <img src="../../assets/image/projectIndex/hasReport.png" alt="">
          <span>今日已填报</span>
        </li>
        <li class="noReport" v-show="tittleData.ifWrite == '0'">
          <img src="../../assets/image/projectIndex/noReport.png" alt="">
          <span>今日未填报</span>
        </li>
      </ul>
      <div class="time" v-show="tittleData.ifWrite == '1'">
        <span class="font">填报时间</span>
        <span class="timeDetail">{{tittleData.formDate | formatDa}}</span>
      </div>
    </div>
    <div class="calendar">
      <div class="tittle ">历史填报记录</div>
      <ul class="week date-title">
        <li>日</li>
        <li>一</li>
        <li>二</li>
        <li>三</li>
        <li>四</li>
        <li>五</li>
        <li>六</li>
      </ul>
      <div class="calendarDeatails">
        <calendar @goInputState="goInputState"></calendar>
      </div>
    </div>
    <div class="footer">
      <div class="wap">
        <div class="toIndex">
          <img src="../../assets/image/projectIndex/index.png" alt="">
          <span class="tit">首页</span>
        </div>
        <div class="toInput" @click="toInput">
          <img src="../../assets/image/projectIndex/inputUnchooses.png" alt="">
          <span class="tit">填报</span>
        </div>
        <div class="personCenter" @click="toPersonCenter">
          <img src="../../assets/image/projectIndex/personCenterUnchoosed.png" alt="">
          <span class="tit">个人中心</span>
        </div>
      </div>
    </div>
    <div class="layer" v-show="layer">
      <div class="layerOut"></div>
      <ul class="tittleBox">
        <li class="tittle">提示</li>
        <li class="tittleContent">{{remindContent}}</li>
        <li class="bottom">
          <div class="confirmBtn" @click="confirmBtn">确定</div>
          <div class="quitBtn" @click="clickQuitBtn" v-show="quitBtn">取消</div>
        </li>
      </ul>
    </div>
    <div class="loading" v-show="loadings">
      <div class="layerOut"></div>
      <div class="loadingwap">
        <span id="loading5">
           <span id="outerCircle"></span>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
  import calendar from '../calendars/calendars'
  import {getIndexDatas} from '../../api/projectIndex'

  export default {
    name: "projectIndex",
    data() {
      return {
        tittleData: {},
        todayId: '',
        layer: false,
        quitBtn: true,
        remindContent: '',
        hasInputId: '',
        layerState: '',
        inputTime: '',
        loadings:false
      }
    },
    created() {
      this.chargeTodayState()
    },
    methods: {
      //获取当天的填报情况
      chargeTodayState() {
        var dates = this.fromatParseToDate(new Date().getTime())
        var date = {
          startTime: this.formatDateToParse(dates.years + '-' + dates.months + '-' + dates.days + ' 00:00:00'),
          endTime: this.formatDateToParse(dates.years + '-' + dates.months + '-' + dates.days + ' 23:59:59')
        }
        getIndexDatas(date).then(res => {
          this.tittleData = res.data.data[0]
        })
      },
      //日历 日历的填报情况 如果是已填报 走详情 未填报 去填报
      goInputState(item) {
        if (item.ifWrite === '1') {
          this.layer = true
          this.hasInputId = item.id
          this.remindContent = '已填报，是否去修改'
          this.layerState = 'calendLayer'
          this.inputTime = item.date
          // this.goBeautyFillResult(item.id)
        } else if (item.ifWrite === '0') {
          this.$router.push({
            path: '/beautyFill',
            query: {
              id: item.id,
              page: 'projectIndex',
              time: item.date
            }
          })
        }
      },
      //弹窗的确定按钮
      confirmBtn() {
        if (this.layerState === 'calendLayer') {
          //去详情
          this.layer = false
          this.$router.push({
            path: '/beautyFillResult',
            query: {
              id: this.hasInputId,
              time: this.inputTime
            }
          })
        } else if (this.layerState === 'footerBtnLayer') {
          //如果是当天已填报 则
          this.layer = false
        }

      },
      //弹窗的取消按钮
      clickQuitBtn() {
        this.layer = false
      },
      //点击最下面填报按钮，如果是已填报，那就是弹窗今日已填报   如果没有填报，那就去填报
      toInput() {
        if (this.tittleData.ifWrite === '1') {
          this.layer = true
          this.remindContent = '今日已填报'
          this.layerState = 'footerBtnLayer'
          this.quitBtn = false
        } else if (this.tittleData.ifWrite === '0') {
          this.$router.push({
            path: '/beautyFill',
            query: {
              id: this.tittleData.id
            }
          })
        }

      },
      //点击去个人中心
      toPersonCenter() {
        this.$router.push({
          path: '/personalCenter'
        })
      },

      //时间戳转出成正常法人日期
      formatDateToParse(date) {
        return new Date(date).getTime()
      },
      //时间戳转化成正常的时间
      fromatParseToDate(date) {
        var time = new Date(date)
        var year = time.getFullYear()
        var month = time.getMonth() + 1 > 10 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)
        var day = time.getDate() >= 10 ? time.getDate() : '0' + time.getDate()
        var dates = {
          years: year,
          months: month,
          days: day
        }
        return dates
      },
    },
    components: {
      calendar
    },
    filters: {
      formatDa(item) {
        var time = new Date(item)
        var year = time.getFullYear()
        var month = time.getMonth() + 1 >= 10 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)
        var day = time.getDate() >= 10 ? time.getDate() : '0' + time.getDate()
        var hour = time.getHours() >= 10 ? time.getHours() : '0' + time.getHours()
        var minute = time.getMinutes() >= 10 ? time.getMinutes() : '0' + time.getMinutes()
        var secomd = time.getSeconds() >= 10 ? time.getSeconds() : '0' + time.getSeconds()
        var dates = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + secomd
        return dates
      }
    }
  }

</script>

<style scoped lang="scss">

  .projectIndex {
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
      width: 90%;
      margin-left: 5%;
      height: 20%;
      margin-bottom: 2%;
      margin-top: 2%;
      border: 1px solid #CAD1DC;
      border-radius: 6px;
      .report {
        width: 100%;
        height: 30%;
        margin-top: 10%;
        .hasReport {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 35px;
            height: 35px;
          }
          span {
            font-size: 23px !important;
            color: #3D85EC;
            padding-left: 8px;
          }
        }
        .noReport {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 35px;
            height: 35px;
          }
          span {
            font-size: 23px !important;
            color: #3D85EC;
            padding-left: 8px;
          }
        }

      }
      .time {
        width: 100%;
        height: 20%;
        display: flex;
        justify-content: center;
        align-items: center;
        .font {
          font-size: 16px !important;
          color: #73798A;
        }
        .timeDetail {
          font-size: 16px !important;
          color: #73798A;
          padding-left: 10px;
        }

      }
    }
    .calendar {
      width: 90%;
      margin-left: 5%;
      height: 53%;
      padding-bottom: 5%;
      border-radius: 6px;
      border: 1px solid #CAD1DC;
      .tittle {
        width: 100%;
        height: 12%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px !important;
        color: #72778a;
        border-bottom: 1px solid #f4f4f4;
      }
      .week {
        width: 90%;
        margin-left: 5%;
        height: 9%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        li {
          color: #737a8a;
          font-size: 16px !important;
        }
      }
      .calendarDeatails {
        width: 100%;
        height: 84%;
        overflow: hidden;
      }
      /*这边不要*/
      .calendar-container {
        width: 90%;
        margin-left: 5%;
        height: 79%;
        overflow-y: scroll;
        overflow-scrolling: touch;
        transition: height 0.5s ease;
        .date-container {
          width: 100%;
          height: 70%;
          .date-header {
            width: 100%;
            height: 16.7%;
            text-align: center;
            background-color: #F8F8F8;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #73798A;
          }
          .date-board {
            width: 100%;
            height: 80%;
            display: flex;
            display: -webkit-flex;
            flex-wrap: wrap;
            -webkit-flex-wrap: wrap;
            text-align: center;
            div {
              width: 13.28571%;
              padding: .10rem 0;
              height: 19%;
              margin-right: 1%;
              margin-bottom: 1%;
              .datas {
                width: 100%;
                height: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 12px !important;
              }
              .inputs {
                width: 100%;
                height: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 10px !important;
              }
            }
          }
        }
        .premonth {
          margin-top: -56%;
        }
      }
      /*这边不要*/
    }
    .footer {
      width: 100%;
      height: 14%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f0f1f6;
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
        .tittleContent {
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
    .loading {
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
      .loadingwap {
        width: 90%;
        margin-left: 5%;
        height: 200px;
        z-index: 200;
        position: absolute;
        left: 0;
        top: 45%;
        display: flex;
        justify-content: center;
        align-items: center;
        #loading5 {
          display: block;
          width: 35px;
          height: 35px;
          #outerCircle {
            display: block;
            position: absolute;
            margin: 0 auto;
            width: 35px;
            height: 35px;
            border-top: 7px solid #06F;
            border-bottom: 7px solid #06F;
            border-left: 7px solid transparent;
            border-right: 7px solid transparent;

            border-radius: 80px;
            animation: cwSpin .666s linear .2s infinite;
          }
          #outerCircle {
            box-shadow: none;
            border-top: 7px solid transparent;
            border-bottom: 7px solid #06F;
            border-left: 7px solid #06F;
            border-right: 7px solid transparent;
            animation: cwSpin .666s linear .2s infinite;
          }
          @keyframes cwSpin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        }

      }

    }
  }

  .hasInputState {
    background: #01D080;
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
  }

  .noInputState {
    background: #FF6464;
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
  }
</style>
