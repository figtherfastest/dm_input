d
<template>
  <div class="childbox" ref="childbox">

    <div class="wap" ref="wapBox">
      <!--上一月-->
      <ul class="prevMonth">
        <div class="calendarTit">{{prevDate.years+'年'+prevDate.months+'月'}}</div>
        <div class="dateListWap">
          <div class="dayList" style="visibility: hidden" v-for="prevPrevRemainItem in prevfirstDayWeeks">00</div>
          <div class="dayList" :ifWrite="prevItem.ifWrite" v-for="(prevItem,prevIndex) in prevMonthDate" :style="inputState(prevItem.ifWrite)">
            <div class="dates"> {{prevIndex+1}}</div>
            <div class="state" v-show="prevItem.ifWrite == '1'">已填报</div>
            <div class="state" v-show="prevItem.ifWrite == '0'">未填报</div>
          </div>
          <div class="remaindayList" v-for="(prevRemainItem,prevRemainIndex) in prevMonthRemainsDate">
            {{prevRemainIndex+prevMonthDate.length+1}}
          </div>
        </div>
      </ul>
      <!--当前月-->
      <ul class="nowMonth">
        <div class="calendarTit">{{nowDate.years+'年'+nowDate.months+'月'}}</div>
        <div class="dateListWap">
          <div class="dayList" style="visibility: hidden" v-for="nowPrevRemainItem in NowfirstDayWeeks">00</div>
          <div class="dayList"  @click="goInputState(nowItem.ifWrite,nowItem.id,nowItem.formDate)" v-for="(nowItem,nowIndex) in nowMonthDate" :style="inputState(nowItem.ifWrite)">
            <div class="dates"> {{nowIndex+1}}</div>
            <div class="state" v-show="nowItem.ifWrite == '1'">已填报</div>
            <div class="state" v-show="nowItem.ifWrite == '0'">未填报</div>
          </div>
          <div class="remaindayList"   v-for="(remainItem,remainIndex) in nowMonthRemainsDate">
            {{remainIndex+nowMonthDate.length+1}}
          </div>
        </div>
      </ul>
      <!--下个月-->
      <ul class="nextMonth">
        <div class="calendarTit">{{nextDate.years+'年'+nextDate.months+'月'}}</div>
        <div class="dateListWap">
          <div class="dayList" style="visibility: hidden" v-for="nextNowItem in nextfirstDayWeeks">00</div>
          <div class="dayList" v-for="(nextItem,nextIndex) in nextMonthDate" :style="inputState(nextItem.ifWrite)">
            <div class="dates"> {{nextIndex+1}}</div>
            <div class="state" v-show="nextItem.ifWrite == '1'">已填报</div>
            <div class="state" v-show="nextItem.ifWrite == '0'">未填报</div>
          </div>
          <div class="remaindayList" v-for="(nextRemainItem,nextRemainIndex) in nextMonthRemainsDate">
            {{nextRemainIndex+nextMonthDate.length+1}}
          </div>
        </div>
      </ul>
    </div>

  </div>
</template>

<script>
  import {getIndexDatas} from '../../api/projectIndex'

  export default {
    data() {
      return {
        startPos: {x: 0, y: 0},
        endPos: {x: 0, y: 0},
        childbox: '',
        wapBox: '',
        wapTransFor: 0,
        translateX: 0,
        isScrolling: 0,

        nowDate: '',//当前日期
        NowfirstDayWeeks: 0,//当月第一天是星期几
        nowMonthDate: {},//当前月份的填报天数
        nowMonthRemainsDate: 0, //当点月份还剩下没有填报的天数


        prevDate: '',//当前日期
        prevMonthDate: {},//上月份的填报天数
        prevMonthRemainsDate: 0, //上月份还剩下没有填报的天数
        prevfirstDayWeeks: 0,//上月第一天是星期几

        nextDate: '',//当前日期
        nextMonthDate: {},//上月份的填报天数
        nextMonthRemainsDate: 0, //上月份还剩下没有填报的天数
        nextfirstDayWeeks: 0,//上月第一天是星期几


        // prevfirstDayWeeks:0,//当月第一天是星期几
        // prevMonthDate:{},//当前月份的填报天数
        // nowMonthRemainsDate:0, //当点月份还剩下没有填报的天数

      }
    },
    created() {
      this.nowDate = this.fromatParseToDate(new Date().getTime())
      this.initCalendar(this.nowDate)
      //上一个月的填报情况
      this.prevDate = this.getPrevDates(this.nowDate)
      this.prevCalendar(this.prevDate)
      //获取下一月的情况
      this.nextDate = this.getNextDates(this.nowDate)
      this.nextCalendar(this.nextDate)
    },
    mounted() {
      this.init()
    },
    methods: {
      //填报状态  颜色的变化
      inputState(item) {
        if (item == 1) {
          return `background:#01D080`
        } else if (item == 0) {
          return `background:#FF6464`
        }
      },
      //初始化
      init() {
        //初始化日期组件，然他在
        this.touchstart()
      },
      //开始滑动
      touchstart(e) {
        this.childbox = this.$refs.childbox
        this.wapBox = this.$refs.wapBox

        var goCenterWidth = -this.childbox.clientWidth
        this.wapBox.style.transform = 'translateX(' + goCenterWidth + 'px' + ')'
        this.childbox.addEventListener('touchstart', e => {
          this.startPos = {x: 0, y: 0}
          this.endPos = {x: 0, y: 0}
          this.startPos = {x: e.targetTouches[0].pageX, y: e.targetTouches[0].pageY,time: +new Date}
          //获取偏移量
          const tranStr = this.wapBox.style.transform
          if (tranStr) {
            this.translateX = Number(tranStr.substring(11, tranStr.length - 3))
          } else {
            this.translateX = 0
          }
          this.childbox.addEventListener('touchmove', this.touchmove, false);
          this.childbox.addEventListener('touchend', this.touchend, false);
        })
      },
      touchmove(e) {
        //  当有多个touch的时候 不执行move
        if (e.targetTouches.length > 1) {
          return
        }
        this.endPos = {x: e.targetTouches[0].pageX - this.startPos.x, y: e.targetTouches[0].pageY - this.startPos.y}
        e.preventDefault()
        const x = this.translateX + this.endPos.x  //本来childbox的偏移量在加上滑动时间的偏移量及时总的偏移量
        this.wapBox.style.transform = 'translateX(' + x + 'px' + ')'
        if (x >= 0) {
          this.wapBox.style.transform = 'translateX(0px)'
        } else if (x <= 2 * this.translateX) {
          this.wapBox.style.transform = 'translateX(' + 2 * this.translateX + 'px' + ')'
        }
      },
      touchend(e) {
        let duration = +new Date - this.startPos.time; //滑动的持续时间
        if (Math.abs(this.endPos.x) > 30 && Number(duration) < 300) {  //水平拖动
          if (this.endPos.x > 30) {  //水平向右拖动的时候
            this.wapBox.style.transition = 'all 300ms ease'
            this.wapBox.style.transform = 'translateX(' + 0 + 'px)'
            this.resetTransition('left')
          } else if (this.endPos.x < -30) {//水平向做拖动
            this.wapBox.style.transition = 'all 300ms ease'
            this.wapBox.style.transform = 'translateX(' + -this.childbox.clientWidth * 2 + 'px)'
            this.resetTransition('right')
          }
        }else if(Number(duration) >= 300){
          if(Math.abs(this.endPos.x) > this.childbox.clientWidth / 2){
            if(this.endPos.x > 0){
              this.wapBox.style.transition = 'all 300ms ease'
              this.wapBox.style.transform = 'translateX(' + 0 + 'px)'
              this.resetTransition('left')
            } else {
              this.wapBox.style.transition = 'all 300ms ease'
              this.wapBox.style.transform = 'translateX(' + -this.calendarBox.clientWidth * 2 + 'px)'
              this.resetTransition('right')
            }
          }
        }

        this.childbox.removeEventListener('touchmove', this.touchmove, false);
        this.childbox.removeEventListener('touchend', this.touchend, false);
      },
      //判断向左还是向右滑动
      resetTransition(dir) {
        window.setTimeout(() => {
          this.wapBox.style.transition = ''
          this.wapBox.style.transform = 'translateX(' + -this.childbox.clientWidth + 'px)'
          if (dir === 'left') {//获取上一个月

            var dates =  this.getPrevDates(this.nowDate)
            this.nowDate = dates
            //同意获取前一个月的填报情况
            this.initCalendar(this.nowDate)
            //同意获取前一个月的填报情况 的前一月
            this.prevDate = this.getPrevDates(this.nowDate)
            this.prevCalendar(this.prevDate)
            //同意获取前一个月的填报情况 后一月
            this.nextDate = this.getNextDates(this.nowDate)
            this.nextCalendar(this.nextDate)

          } else if (dir === 'right') {//获取下一个月

            var dates =  this.getNextDates(this.nowDate)
            this.nowDate = dates
            //同意获取前一个月的填报情况
            this.initCalendar(this.nowDate)
            //同意获取前一个月的填报情况 的前一月
            this.prevDate = this.getPrevDates(this.nowDate)
            this.prevCalendar(this.prevDate)
            //同意获取前一个月的填报情况 后一月
            this.nextDate = this.getNextDates(this.nowDate)
            this.nextCalendar(this.nextDate)
          }
        }, 310)
      },
      //  初始化日期 判断当前月份填报情况
      initCalendar(nowDate) {
        var longMonth = this.getMonthDayByMonthYear(Number(nowDate.months), nowDate.years)//当前月份的天数
        var date = {
          startTime: this.formatDateToParse(nowDate.years + '-' + nowDate.months + '-01 00:00:00'),
          endTime: this.formatDateToParse(nowDate.years + '-' + nowDate.months + '-' + longMonth + ' 23:59:59')
        }
        this.getFristDayWeeks(nowDate.years, nowDate.months, 'now')
        this.loadData(date, longMonth, 'now')
      },
      //获取前一个月的填报情况
      prevCalendar(nowDate) {
        var longMonth = this.getMonthDayByMonthYear(Number(nowDate.months), nowDate.years)//当前月份的天数
        console.log(longMonth);
        var date = {
          startTime: this.formatDateToParse(nowDate.years + '-' + nowDate.months + '-01 00:00:00'),
          endTime: this.formatDateToParse(nowDate.years + '-' + nowDate.months + '-' + longMonth + ' 23:59:59')
        }
        this.getFristDayWeeks(nowDate.years, nowDate.months, 'prev')
        this.loadData(date, longMonth, 'prev')
      },
      //获取下一个月的填报情况
      nextCalendar(nowDate) {
        var longMonth = this.getMonthDayByMonthYear(Number(nowDate.months), nowDate.years)//当前月份的天数
        var date = {
          startTime: this.formatDateToParse(nowDate.years + '-' + nowDate.months + '-01 00:00:00'),
          endTime: this.formatDateToParse(nowDate.years + '-' + nowDate.months + '-' + longMonth + ' 23:59:59')
        }
        this.getFristDayWeeks(nowDate.years, nowDate.months, 'next')
        this.loadData(date, longMonth, 'next')
      },
      //获取数据
      loadData(data, longMonth, state) {
        getIndexDatas(data).then(res => {
          if (state === 'now') {
            this.nowMonthDate = res.data.data
            this.nowMonthRemainsDate = longMonth - res.data.data.length
          } else if (state === 'prev') {
            this.prevMonthDate = res.data.data
            this.prevMonthRemainsDate = longMonth - res.data.data.length
          } else if (state === 'next') {
            this.nextMonthDate = res.data.data
            this.nextMonthRemainsDate = longMonth - res.data.data.length
          }

        })
      },
      //  获取某个月的第一天是星期几
      getFristDayWeeks(year, month, state) {
        if (state === 'now') {
          this.NowfirstDayWeeks = new Date(year, Number(month) - 1, 1).getDay()
        } else if (state === 'prev') {
          this.prevfirstDayWeeks = new Date(year, Number(month) - 1, 1).getDay()
        } else if (state === 'next') {
          this.nextfirstDayWeeks = new Date(year, Number(month) - 1, 1).getDay()
        }

      },
      //获取某年某月有多少天
      getMonthDayByMonthYear(month, year) {
        // 判断是否为闰年
        const isLeap = (year % 100 === 0) ? (year % 400 === 0 ? 1 : 0) : (year % 4 === 0) ? 1 : 0
        const monthDay = [31, 28 + isLeap, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] // 数组中的每一项代表每个月的天数
        return monthDay[month - 1]
      },

      // 时间转化成时间戳
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
      //  获取上个月的日期
      getPrevDates(item) {
        var month = Number(item.months) - 1 >= 10 ? Number(item.months) - 1 : '0' + (Number(item.months) - 1)
        var year = item.years
        var day = item.days
        if (month == 0) {
          year = year - 1
          month = 12
        }
        var dates = {
          years: year,
          months: month,
          days: day
        }
        return dates
      },
      //获取下一月的日期
      getNextDates(item) {
        var month = Number(item.months) + 1 >= 10 ? Number(item.months) + 1 : '0' + (Number(item.months) + 1)
        var year = item.years
        var day = item.days
        if (month == 12) {
          year = year + 1
          month = 1
        }
        var dates = {
          years: year,
          months: month,
          days: day
        }
        return dates
      },
    // 后台有数据的情况下 点击去填报还是详情
      goInputState(ifWrite,id,date){
        var data = {
          ifWrite:ifWrite,
          id:id,
          date:date
        }
        this.$emit('goInputState',data)
      },


    }
  }
</script>

<style scoped lang="scss">
  .childbox {
    width: 100%;
    height: 100%;
    .wap {
      width: 300%;
      height: 100%;
      display: flex;
      justify-content: space-around;
      .prevMonth {
        width: 33.33333%;
        height: 100%;
        background: #FFFFFF;
        .calendarTit {
          width: 100%;
          height: 9%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18px !important;
          color: #73798A;
        }
        .dateListWap {
          width: 100%;
          height: 91%;
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          .dayList {
            width: 12%;
            height: 14%;
            margin-left: 2%;
            -webkit-border-radius: 6px;
            -moz-border-radius: 6px;
            border-radius: 6px;
            .dates {
              width: 100%;
              height: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 12px;
              color: #FFFFFF;
            }
            .state {
              idth: 100%;
              height: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 12px !important;
              color: #FFFFFF;
            }

          }
          .remaindayList {
            width: 12%;
            height: 14%;
            margin-left: 2%;
            -webkit-border-radius: 6px;
            -moz-border-radius: 6px;
            border-radius: 6px;
            font-size: 16px !important;
            font-weight: bold;
            background: rgb(255, 100, 100);
            display: flex;
            justify-content: center;
            align-items: center;
            color: #B6B9C4;
          }
        }
      }
      .nowMonth {
        width: 33.33333%;
        height: 100%;
        background: #FFFFFF;
        .calendarTit {
          width: 100%;
          height: 9%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18px !important;
          color: #73798A;
        }
        .dateListWap {
          width: 100%;
          height: 91%;
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          .dayList {
            width: 12%;
            height: 14%;
            margin-left: 2%;
            -webkit-border-radius: 6px;
            -moz-border-radius: 6px;
            border-radius: 6px;
            font-weight: bold;
            .dates {
              width: 100%;
              height: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 12px;
              color: #FFFFFF;
            }
            .state {
              idth: 100%;
              height: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 12px !important;
              color: #FFFFFF;
            }

          }
          .remaindayList {
            width: 12%;
            height: 14%;
            margin-left: 2%;
            -webkit-border-radius: 6px;
            -moz-border-radius: 6px;
            border-radius: 6px;
            font-weight: bold;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #B6B9C4;
          }
        }

      }
      .nextMonth {
        width: 33.33333%;
        height: 100%;
        background: #FFFFFF;
        .calendarTit {
          width: 100%;
          height: 9%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18px !important;
          color: #73798A;
        }
        .dateListWap {
          width: 100%;
          height: 91%;
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          .dayList {
            width: 12%;
            height: 14%;
            margin-left: 2%;
            -webkit-border-radius: 6px;
            -moz-border-radius: 6px;
            border-radius: 6px;
            .dates {
              width: 100%;
              height: 40%;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 12px;
              color: #FFFFFF;
            }
            .state {
              idth: 100%;
              height: 60%;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 12px !important;
              color: #FFFFFF;
            }

          }
          .remaindayList {
            width: 12%;
            height: 14%;
            margin-left: 2%;
            -webkit-border-radius: 6px;
            -moz-border-radius: 6px;
            border-radius: 6px;
            color: #B6B9C4;
            font-weight: bold;
            background: rgb(255, 100, 100);
            display: flex;
            justify-content: center;
            align-items: center;
            color: #B6B9C4;
          }
        }
      }
    }
  }

</style>
