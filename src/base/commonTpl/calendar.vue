<template>
  <div id="calendar">
    <div class="date-title">
      <div>日</div>
      <div>一</div>
      <div>二</div>
      <div>三</div>
      <div>四</div>
      <div>五</div>
      <div>六</div>
    </div>
    <div class="calendar-container" style="height: 240px" v-on:scroll="scrollDebounce">
      <div class="date-container premonth">
        <div class="date-header">{{ `${preDivCalendar.year}年${preDivCalendar.month + 1}月` }}</div>
        <div class="date-board">
          <div v-for="i in new Date(preDivCalendar.year, preDivCalendar.month, 1).getDay()" :key="-i"></div>
          <div class="date-block"
               :class="{todayBlock: i === 1}"
               v-for="i in getMonthDayByMonthYear(preDivCalendar.month, preDivCalendar.year)"
               :key="i">
            <span>{{ i }}</span>
          </div>
        </div>
      </div>
      <div class="date-container middlemonth">
        <div class="date-header">{{`${middleDivCalendar.year}年${middleDivCalendar.month + 1}月`}}</div>
        <div class="date-board">
          <!--重点是这两句，实现日期按照星期排序-->
          <div v-for="i in new Date(middleDivCalendar.year, middleDivCalendar.month, 1).getDay()" :key="-i"></div>
          <div class="date-block" :class="{todayBlock: i === 1}"  v-for="i in getMonthDayByMonthYear(middleDivCalendar.month, middleDivCalendar.year)" :key="i">
            <span>{{i}}</span>
          </div>
        </div>
      </div>
      <div class="date-container nextmonth">
        <div class="date-header">{{ `${nextMiddleDivCalendar.year}年${nextMiddleDivCalendar.month + 1}月` }}</div>
        <div class="date-board">
          <div v-for="i in new Date(nextMiddleDivCalendar.year, nextMiddleDivCalendar.month, 1).getDay()"
               :key="-i"></div>
          <div class="date-block"
               :class="{todayBlock: i === 1}"
               v-for="i in getMonthDayByMonthYear (nextMiddleDivCalendar.month, nextMiddleDivCalendar.year)"
               :key="i">
            <span>{{ i }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        calendarContainerHeight: '0', // 日历的高度
        scrollTimer: null, // 滚动定时器，用于滚动事件防抖动
        preDivCalendar: {year: 2018, month: 1}, // 第一个div显示的日历
        middleDivCalendar: {year: 2018, month: 2}, // 中间div显示的日历
        nextMiddleDivCalendar: {year: 2018, month: 3}, // 最后一个div显示的日历
      }
    },
    mounted() {
      this.middleDivCalendar = {year: new Date().getFullYear(), month: new Date().getMonth()}
      // 当日历收起的时候，日历高度刚好只够显示一行日期
      this.$nextTick(function () {
        // DOM更新完成后
        const today = document.querySelector('.todayBlock')
        today.scrollIntoView()
      })
    },
    watch: {
      middleDivCalendar() { // 监听中间div日历的时间,根据中间div的日历获取上下div的日历
        this.preDivCalendar = this.getPrevMonth(this.middleDivCalendar.month, this.middleDivCalendar.year)
        this.nextMiddleDivCalendar = this.getNextMonth(this.middleDivCalendar.month, this.middleDivCalendar.year)
      }
    },
    methods: {
      getPrevMonth: function (m, y) {  // 获取上一个月
        let month = m || 11
        let year = y
        year -= m === 0
        month -= m !== 0
        return {year, month}
      },
      getNextMonth: function (m, y) {  // 获取下一个月
        let month = m
        let year = y
        year += m === 11
        month = (1 + month) % 12
        return {year, month}
      },
      // 获取某年某月的天数
      getMonthDayByMonthYear(month, year) {
        // 判断是否为闰年
        const isLeap = (year % 100 === 0) ? (year % 400 === 0 ? 1 : 0) : (year % 4 === 0) ? 1 : 0
        const monthDay = [31, 28 + isLeap, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] // 数组中的每一项代表每个月的天数
        return monthDay[month]
      },
      scrollDebounce(e) {
        clearTimeout(this.scrollTimer)
        let self = this
        // 设置定时器，防止scroll抖动
          if (e.target.scrollTop === 0) {
            self.middleDivCalendar = self.getPrevMonth(self.middleDivCalendar.month, self.middleDivCalendar.year)
            console.log(self.middleDivCalendar)
            self.$nextTick(function () {
              // DOM 更新了
              const premonth = document.querySelector('.premonth')
              e.target.scrollTop = premonth.offsetHeight
            })
          }
          if (e.target.scrollTop + e.target.clientHeight + 1 >= e.target.scrollHeight) {
            self.middleDivCalendar = self.getNextMonth(self.middleDivCalendar.month, self.middleDivCalendar.year)
            console.log(2)
            self.$nextTick(function () {
              // DOM 更新了
              const nextmonth = document.querySelector('.nextmonth')
              e.target.scrollTop = e.target.scrollHeight - e.target.clientHeight - nextmonth.offsetHeight
            })
          }

      },
    },
  }
</script>

<style lang="scss" scoped>
  .date-title {
    display: flex;
    padding: .10rem 0;
    text-align: center;
    border-bottom: .01rem solid #d1d1d1;
    div {
      flex: 1;
    }
  }
  .calendar-container {
    overflow-y: scroll;
    overflow-scrolling: touch;
    transition: height 0.5s ease;
    .date-container {
      .date-header {
        text-align: center;
        padding: .07rem 0;
        background-color: #F8F8F8;
      }
      .date-board {
        display: flex;
        display: -webkit-flex;
        flex-wrap: wrap;
        -webkit-flex-wrap: wrap;
        text-align: center;
        div {
          width: 14.28571%;
          padding: .10rem 0;
        }
        .todayBlock {
          span {
            color: red;
          }
        }
      }
    }
  }

</style>
