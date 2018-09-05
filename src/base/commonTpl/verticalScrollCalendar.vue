<template>
  <div class="calendar">
    <div class="calendar-header">
      <ul>
        <li v-for="week in weeks" class="week" :style="{'color': options.week_font_color}">{{week}}</li>
      </ul>
      <div class="calendar-info" :style="{'background-color': options.header_bg_color}">
        <transition name="fade">
          <p :style="{'color': options.header_font_color}">{{ nowDay }}</p>
        </transition>
      </div>
    </div>
    <div class="calendar-box">
      <div class="wrapper">
        <table cellpadding="5" class="last-month">
          <tbody>
          <tr v-for="(day,k1) in lastDays" :key="k1" style="{'animation-delay',(k1*30)+'ms'}">
            <td v-for="(child,k2) in day" :key="k2" :class="{'selected':child.selected,'disabled':child.disabled}"
                :style="{height: tdH + 'px'}">
              <span :style="dateStyle(child)">{{child.day}}</span>
              <span class="dot">{{inputState}}</span>
            </td>
          </tr>
          </tbody>
        </table>
        <table cellpadding="5" class="now-month nowDate">
          <tbody>
          <tr v-for="(day,k1) in days" style="{'animation-delay',(k1*30)+'ms'}">
            <td v-for="(child,k2) in day" ref="currentMonth"
                :class="{'selected':child.selected,'disabled':child.disabled}" :style="{height: tdH + 'px'}"
                :dates="findCurrentDate(child.day)"
                @click="select(child.day,$event)">
              <span :style="dateStyle(child)">{{child.day}}</span>
              <span class="dot">{{inputState}}</span>
            </td>
          </tr>
          </tbody>
        </table>
        <table cellpadding="5" class="now-month">
          <tbody>
          <tr v-for="(day,k1) in nextDays" :key="k1" style="{'animation-delay',(k1*30)+'ms'}">
            <td v-for="(child,k2) in day" :key="k2" :class="{'selected':child.selected,'disabled':child.disabled}"
                :style="{height: tdH + 'px'}">
              <span :style="dateStyle(child)">{{child.day}}</span>
              <span class="dot">{{inputState}}</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import {getIndexDatas} from '../../api/projectIndex'

  export default {
    props: {
      options: {
        type: Object,
        default: function () {
          return {
            header_bg_color: '#A8D976',
            header_font_color: '#6fa42a',
            week_font_color: '#86C632',
            selected_bg_color: '#1f1fc6',
            today_bg_color: '#D8E7C6',
            event_dot_color: '#86C632'
          }
        }
      },
      // 默认选择日期
      value: {
        type: Array,
        default: function () {
          return []
        }
      },
      // 开始选择日期
      begin: {
        type: Array,
        default: function () {
          return []
        }
      },
      // 结束选择日期
      end: {
        type: Array,
        default: function () {
          return []
        }
      },
      // 是否小于10补零
      zero: {
        type: Boolean,
        default: true
      },
      // 屏蔽的日期
      disabled: {
        type: Array,
        default: function () {
          return []
        }
      },
      // 是否显示农历
      lunar: {
        type: Boolean,
        default: false
      },

      // 自定义星期名称
      weeks: {
        type: Array,
        default: function () {
          return window.navigator.language.toLowerCase() == "zh-cn" ? ['日', '一', '二', '三', '四', '五', '六'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        }
      },
      // 自定义月份名称
      months: {
        type: Array,
        default: function () {
          return window.navigator.language.toLowerCase() == "zh-cn" ? ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'] : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        }
      },
      // 自定义事件
      events: {
        type: Array,
        default: function () {
          return []
        }
      },
    },
    data() {
      return {
        year: 0,
        month: 0,
        day: 0,
        days: [],
        lastDays: [],
        nextDays: [],
        selectedDate: [],
        festival: {
          lunar: {},
          gregorian: {},
        },
        startPos: {},
        endPos: {},
        isScrolling: 0,
        translateX: 0,
        calendarBox: null,
        wrapper: null,
        tdH: 46,
        inputState: '',
        getInputValue: []
      }
    },

    computed: {
      nowDay() {
        return this.year + '年' + this.zeroPad(parseInt(this.month) + 1) + '月'
      },
      formatDate() {
        return this.year + '-' + this.zeroPad(parseInt(this.month) + 1)
      }
    },
    watch: {
      events() {
        this.days = this.render(this.year, this.month, true)
      },
      value() {
        this.init();
      }
    },
    // created() {
    //   this._getIndexDatas()
    // },
    mounted() {
      this.calendarBox = document.getElementsByClassName('calendar-box')[0]
      this.wrapper = document.getElementsByClassName('wrapper')[0]
      this.init()
      this.tdH = Math.round(this.calendarBox.clientWidth / 7)
      this._getIndexDatas()
    },
    methods: {
      findCurrentDate(item) {
        return this.formatDate + '-' + (item >= 10 ? item : '0' + item)
      },
      init() {
        let now = new Date();
        this.year = now.getFullYear()
        this.month = now.getMonth()
        this.day = now.getDate()
        if (this.value.length > 0) {
          this.year = parseInt(this.value[0])
          this.month = parseInt(this.value[1]) - 1
          this.day = parseInt(this.value[2])
        }
        this.days = this.render(this.year, this.month, true)
        this.nextDays = this.next()
        this.lastDays = this.prev()

        this.$emit('monthChanged', this.year + '-' + this.zeroPad(this.month + 1))

        //  listener touch event
        this.wrapper.style.transform = 'translateX(' + -this.calendarBox.clientWidth + 'px' + ')'
        this.calendarBox.addEventListener('touchstart', e => {
          this.startPos = this.endPos = {x: 0, y: 0}
          let touch = e.targetTouches[0] //touches数组对象获得屏幕上所有的touch，取第一个touch
          this.startPos = {x: touch.pageX, y: touch.pageY, time: +new Date} //取第一个touch的坐标值
          const tranStr = this.wrapper.style.transform
          if (tranStr) {
            this.translateX = Number(tranStr.substring(11, tranStr.length - 3))
          } else {
            this.translateX = 0
          }
          this.calendarBox.addEventListener('touchmove', this.touchmove, false);
          this.calendarBox.addEventListener('touchend', this.touchend, false);
        }, false)
      },
      // 渲染日期
      render(y, m, isCurrentMonth = false) {
        let firstDayOfMonth = new Date(y, m, 1).getDay()         //当月第一天
        let lastDateOfMonth = new Date(y, m + 1, 0).getDate()    //当月最后一天
        let lastDayOfLastMonth = new Date(y, m, 0).getDate()     //最后一月的最后一天
        let i, line = 0, temp = [], nextMonthPushDays = 1
        for (i = 1; i <= lastDateOfMonth; i++) {
          let day = new Date(y, m, i).getDay() //返回星期几（0～6）
          let k
          // 第一行
          if (day == 0) {
            temp[line] = []
          } else if (i == 1) {
            temp[line] = []
            k = lastDayOfLastMonth - firstDayOfMonth + 1
            for (let j = 0; j < firstDayOfMonth; j++) {
              temp[line].push(Object.assign(
                {day: k, disabled: true},
                // this.getLunarInfo(this.computedPrevYear(),this.computedPrevMonth(true),k),
                isCurrentMonth ? this.getEvents(this.computedPrevYear(), this.computedPrevMonth(true), k) : {},
                this.isToday(this.computedNextYear(), this.computedNextMonth(true) + 1, k)
              ))
              k++;
            }
          }

          let chk = new Date()
          let chkY = chk.getFullYear()
          let chkM = chk.getMonth()
          let chkD = chk.getDate()
          // 匹配上次选中的日期
          if (this.selectedDate.length == 3 && y == this.selectedDate[0] && m == this.selectedDate[1] && i == this.selectedDate[2]) {
            temp[line].push(Object.assign(
              {day: i, selected: true},
              // this.getLunarInfo(y, m, i),
              isCurrentMonth ? this.getEvents(y, m, i) : {},
              this.isToday(y, m, i)
            ))
          } else if (this.selectedDate.length != 3 && chkY == this.year && chkM == this.month && i == this.day && this.value.length === 0) {    // 没有默认值的时候显示选中今天日期
            temp[line].push(Object.assign(
              {day: i, selected: true},
              // this.getLunarInfo(y, m, i),
              isCurrentMonth ? this.getEvents(y, m, i) : {},
              this.isToday(y, m, i)
            ))
            this.selectedDate = [this.year, this.month, this.day]
          } else {
            // 普通日期
            let options = Object.assign(
              {day: i, selected: false},
              // this.getLunarInfo(y, m, i),
              isCurrentMonth ? this.getEvents(y, m, i) : {},
              this.isToday(y, m, i)
            )
            if (this.begin.length > 0) {
              let beginTime = Number(new Date(parseInt(this.begin[0]), parseInt(this.begin[1]) - 1, parseInt(this.begin[2])))
              if (beginTime > Number(new Date(this.year, this.month, i))) options.disabled = true
            }
            if (this.end.length > 0) {
              let endTime = Number(new Date(parseInt(this.end[0]), parseInt(this.end[1]) - 1, parseInt(this.end[2])))
              if (endTime < Number(new Date(this.year, this.month, i))) options.disabled = true
            }
            if (this.disabled.length > 0) {
              if (this.disabled.filter(v => {
                return this.year === v[0] && this.month === v[1] - 1 && i === v[2]
              }).length > 0) {
                options.disabled = true
              }
            }
            temp[line].push(options)
          }
          // 到周六换行
          if (day == 6 && i < lastDateOfMonth) {
            line++
          } else if (i == lastDateOfMonth) {
            // line++
            let k = 1
            for (let d = day; d < 6; d++) {
              temp[line].push(Object.assign(
                {day: k, disabled: true},
                // this.getLunarInfo(this.computedNextYear(),this.computedNextMonth(true),k),
                isCurrentMonth ? this.getEvents(this.computedNextYear(), this.computedNextMonth(true), k) : {},
                this.isToday(this.computedNextYear(), this.computedNextMonth(true) + 1, d)
              ))
              k++
            }
            // 下个月除了补充的前几天开始的日期
            nextMonthPushDays = k
          }
        } //end for

        // 补充第六行让视觉稳定
        if (line <= 5 && nextMonthPushDays > 0) {
          for (let i = line + 1; i <= 5; i++) {
            temp[i] = []
            let start = nextMonthPushDays + (i - line - 1) * 7
            for (let d = start; d <= start + 6; d++) {
              temp[i].push(Object.assign(
                {day: d, disabled: true},
                // this.getLunarInfo(this.computedNextYear(),this.computedNextMonth(true),d),
                isCurrentMonth ? this.getEvents(this.computedNextYear(), this.computedNextMonth(true), d) : {},
                this.isToday(this.computedNextYear(), this.computedNextMonth(true) + 1, d)
              ))
            }
          }
        }
        return temp
      },
      touchmove(e) {

        //当屏幕有多个touch或者页面被缩放过，就不执行move操作
        if (e.targetTouches.length > 1 || e.scale && e.scale !== 1) return
        let touch = e.targetTouches[0]
        this.endPos = {x: touch.pageX - this.startPos.x, y: touch.pageY - this.startPos.y}
        this.isScrolling = Math.abs(this.endPos.x) < Math.abs(this.endPos.y) ? 1 : 0 //isScrolling为1时，表示纵向滑动，0为横向滑动
        if (this.isScrolling === 0) {
          e.preventDefault(); //阻止触摸事件的默认行为，即阻止滚屏
          const x = this.translateX + this.endPos.x
          this.wrapper.style.transform = 'translateX(' + x + 'px' + ')'
        }
      },
      touchend(e) {
        let duration = +new Date - this.startPos.time; //滑动的持续时间
        if (this.isScrolling === 0) { //当为水平滚动时
          if (Number(duration) < 300 && Math.abs(this.endPos.x) > 30) {     //  快速拖拽并松开
            if (this.endPos.x > 30) {
              this.wrapper.style.transition = 'all 300ms ease'
              this.wrapper.style.transform = 'translateX(' + 0 + 'px)'
              this.resetTransition('left')
            } else if (this.endPos.x < -30) {
              this.wrapper.style.transition = 'all 300ms ease'
              this.wrapper.style.transform = 'translateX(' + -this.calendarBox.clientWidth * 2 + 'px)'
              this.resetTransition('right')
              this._getIndexDatas()
            }
          } else if (Number(duration) >= 300) {    //  持续拖拽
            if (Math.abs(this.endPos.x) > this.calendarBox.clientWidth / 2) {
              if (this.endPos.x > 0) {
                this.wrapper.style.transition = 'all 300ms ease'
                this.wrapper.style.transform = 'translateX(' + 0 + 'px)'
                this.resetTransition('left')
                this._getIndexDatas()
              } else {
                this.wrapper.style.transition = 'all 300ms ease'
                this.wrapper.style.transform = 'translateX(' + -this.calendarBox.clientWidth * 2 + 'px)'
                this.resetTransition('right')
                this._getIndexDatas()
              }
            } else {
              this.wrapper.style.transition = 'all 300ms ease'
              this.wrapper.style.transform = 'translateX(' + -this.calendarBox.clientWidth + 'px)'
              this.resetTransition('none')
            }
          }
        }
        //解绑事件
        this.calendarBox.removeEventListener('touchmove', this.touchmove, false);
        this.calendarBox.removeEventListener('touchend', this.touchend, false);
      },
      resetTransition(dir) {
        window.setTimeout(() => {
          this.wrapper.style.transition = ''
          this.wrapper.style.transform = 'translateX(' + -this.calendarBox.clientWidth + 'px)'
          switch (dir) {
            case 'left':
              let ldays = this.days
              let lastDays = this.lastDays
              let lmonth, lyear
              if (this.month == 0) {
                lmonth = 11
                lyear = parseInt(this.year) - 1
              } else {
                lmonth = parseInt(this.month) - 1
                lyear = this.year
              }

              this.month = lmonth
              this.year = lyear
              // this.days = lastDays
              this.nextDays = ldays
              this.lastDays = this.prev()
              this.$emit('monthChanged', this.year + '-' + this.zeroPad(this.month + 1))
              break
            case 'right':
              let rdays = this.days
              let nextDays = this.nextDays
              let rmonth, ryear
              if (this.month == 11) {
                rmonth = 0
                ryear = parseInt(this.year) + 1
              } else {
                rmonth = parseInt(this.month) + 1
                ryear = this.year
              }
              this.month = rmonth
              this.year = ryear
              // this.days = nextDays
              this.lastDays = rdays
              this.nextDays = this.next()
              this.$emit('monthChanged', this.year + '-' + this.zeroPad(this.month + 1))
              break
            default:
              break
          }
          this.days = this.render(this.year, this.month, true)
        }, 310)
      },
      computedPrevYear() {
        let value = this.year
        if (this.month - 1 < 0) {
          value--
        }
        return value
      },
      computedPrevMonth(isString) {
        let value = this.month
        if (this.month - 1 < 0) {
          value = 11
        } else {
          value--
        }
        // 用于显示目的（一般月份是从0开始的）
        if (isString) {
          return value + 1
        }
        return value
      },
      computedNextYear() {
        let value = this.year
        if (this.month + 1 > 11) {
          value++
        }
        return value
      },
      computedNextMonth(isString) {
        let value = this.month
        if (this.month + 1 > 11) {
          value = 0
        } else {
          value++
        }
        // 用于显示目的（一般月份是从0开始的）
        if (isString) {
          return value + 1
        }
        return value
      },
      // 获取农历信息
      // getLunarInfo(y,m,d) {
      //   let lunarInfo=calendar.solar2lunar(y,m,d)
      //   let lunarValue=lunarInfo.IDayCn
      //   let isLunarFestival=false
      //   let isGregorianFestival=false
      //   if(this.festival.lunar[lunarInfo.lMonth+"-"+lunarInfo.lDay]!=undefined) {
      //     lunarValue=this.festival.lunar[lunarInfo.lMonth+"-"+lunarInfo.lDay]
      //     isLunarFestival=true
      //   }else if(this.festival.gregorian[m+"-"+d]!=undefined){
      //     lunarValue=this.festival.gregorian[m+"-"+d]
      //     isGregorianFestival=true
      //   }
      //   return {
      //     lunar:lunarValue,
      //     isLunarFestival:isLunarFestival,
      //     isGregorianFestival:isGregorianFestival,
      //   }
      // },
      isToday(y, m, d) {
        let now = new Date()
        if (now.getFullYear() == y && now.getMonth() == m && now.getDate() == d) {
          return {'isToday': true}
        } else {
          return {'isToday': false}
        }
      },
      // 获取自定义事件
      getEvents(y, m, d) {
        if (this.events.length === 0) return false
        let isContain = false
        this.events.forEach(item => {
          let days = item.split('-')
          if (days.length == 3 && days[0] == y && Number(days[1]) == (m + 1) && Number(days[2] == d)) {
            isContain = true
          }
        })
        let data = {}
        if (isContain) {
          data.eventName = isContain
        }
        return data
      },
      // 上月
      prev() {
        let month, year
        if (this.month == 0) {
          month = 11
          year = parseInt(this.year) - 1
        } else {
          month = parseInt(this.month) - 1
          year = this.year
        }
        return this.render(year, month, false)
      },
      //  下月
      next() {
        let nextMonth, nextYear
        if (this.month == 11) {
          nextMonth = 0
          nextYear = parseInt(this.year) + 1
        } else {
          nextMonth = parseInt(this.month) + 1
          nextYear = this.year
        }
        return this.render(nextYear, nextMonth, false)
      },
      // 选中日期
      select(date,e) {
        var params = {
          inputSatte:e.target.innerHTML,
          startTime:this.formatDateToParse(this.formatDate+'-'+date+' 00:00:00'),
          endTime:this.formatDateToParse(this.formatDate+'-'+date+' 23:59:59'),
          id:e.path[1].id,
          clickDate:this.nowDay+(Number(date)>=10?date:'0'+date)+'日'
        }
        if(e.target.innerHTML ==='未填报'){
          this.$emit('inputStateGoes',params)
        } else if(e.target.innerHTML ==='已填报'){
          this.$emit('inputStateGoes',params)
        }
        // if (e != undefined) e.stopPropagation()
        // // 取消上次选中
        // if (this.selectedDate.length > 0) {
        //   this.days.forEach(v => {
        //     v.forEach(vv => {
        //       vv.selected = false
        //     })
        //   })
        //   this.lastDays.forEach(v => {
        //     v.forEach(vv => {
        //       vv.selected = false
        //     })
        //   })
        //   this.nextDays.forEach(v => {
        //     v.forEach(vv => {
        //       vv.selected = false
        //     })
        //   })
        // }
        // // 设置当前选中天
        // this.days[k1][k2].selected = true
        // // this.day = this.days[k1][k2].day
        // this.selectedDate = [this.year, this.month, this.days[k1][k2].day]
        // this.$emit('select', [this.year, this.zero ? this.zeroPad(this.month + 1) : this.month + 1, this.zero ? this.zeroPad(this.days[k1][k2].day) : this.days[k1][k2].day])
      },
      // 日期补零
      zeroPad(n) {
        return String(n < 10 ? '0' + n : n)
      },
      // 监测每一项
      dateStyle(child) {
        // var days = this.formatDate+'-'+(child.day>=10?child.day:'0'+child.day)
        // for(var i=0;i<this.getInputValue.length;i++){
        //   var fromDates = this.fromatParseToDate(this.getInputValue[i].formDate)
        //   var dayDates = fromDates.years+'-'+fromDates.months+'-'+fromDates.days
        //   if(dayDates === days ){
        //     if(this.getInputValue[i].ifWrite ==='1'){
        //       this.inputState = '1'
        //     }else if(this.getInputValue[i].ifWrite ==='0'){
        //       this.inputState = '0'
        //     }
        //   }
        // }
        // if (child.selected) {
        //   return {
        //     'background-color': this.options.selected_bg_color,
        //     'color': '#fff'
        //   }
        // } else if (child.isToday) {
        //   return {
        //     'background-color': this.options.today_bg_color,
        //     'color': '#fff'
        //   }
        // } else {
        //   return {
        //     'background-color': '#fff',
        //     'color': '#333'
        //   }
        // }
      },
      //获取当月的填报情况
      _getIndexDatas() {
        var currentDate = this.fromatParseToDate(new Date().getTime())
        var date = {
          startTime: this.formatDateToParse(currentDate.years + '-' + currentDate.months + '-' + '01 00:00:00'),
          endTime: this.formatDateToParse(currentDate.years + '-' + currentDate.months + '-' + new Date(currentDate.years, currentDate.months, 0).getDate() + ' 23:59:59')
        }
        getIndexDatas(date).then(res => {
          if (res.data.data.code === "OK") {
          }
          this.getInputValue = res.data.data
          this.getInputState()
        })
      },
      //填报状态
      getInputState() {
        //节点初始化  先不让它显示
        for (var z = 0; z < this.$refs.currentMonth.length; z++) {
          this.$refs.currentMonth[z].childNodes[2].innerHTML = ''
          this.$refs.currentMonth[z].style.background = 'white'
        }
        //过滤节点
        console.log(this.$refs.currentMonth);
        var filterDoms = this.$refs.currentMonth.filter(res => {
          return res.getAttribute('class') !== 'disabled'
        })
        var inputDate = this.getInputValue
        for (var i = 0; i < inputDate.length; i++) {
          //后端返回的日期
          var dates = this.fromatParseToDate(inputDate[i].formDate).years + '-' + this.fromatParseToDate(inputDate[i].formDate).months + '-' + this.fromatParseToDate(inputDate[i].formDate).days
          for (var j = 0; j < filterDoms.length; j++) {
            //节点的日期
            var domDates = filterDoms[j].getAttribute('dates')
            if (dates === domDates) {
              if (inputDate[i].ifWrite === '1') {
                filterDoms[j].childNodes[2].innerHTML = '已填报'
                filterDoms[j].style.background = 'yellow'
                var id = inputDate[j].id
                filterDoms[j].setAttribute('id',id)
              } else if (inputDate[i].ifWrite === '0') {
                filterDoms[j].childNodes[2].innerHTML = '未填报'
                filterDoms[j].style.background = 'gray'
                var id = inputDate[j].id
                filterDoms[j].setAttribute('id',id)
              }
            }
          }
        }
        filterDoms=[]
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
    }
  }

</script>

<style scoped>
  .calendar {
    width: 100%;
    height: 100%;
    min-width: 300px;
    background: #fff;
    font-family: "PingFang SC", "Hiragino Sans GB", "STHeiti", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
    user-select: none;
  }

  .calendar-header {
    width: 100%;
    height: 15%;
  }

  .calendar-header > ul {
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 13px;
  }

  .calendar-info {
    width: 100%;
    height: 50%;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .calendar-info > p {
    margin: 0;
    font-size: 14px;
  }

  .calendar-info > div.month .month-inner > span {
    display: block;
    font-size: 14px;
    height: 20px;
    width: 100px;
    overflow: hidden;
    text-align: center;
  }

  .calendar > .calendar-box {
    width: 100%;
    height: 85%;
    overflow-x: scroll;
  }

  .calendar > .calendar-box > .wrapper {
    display: -webkit-box;
    width: 300%;
    height: 100%;
    -webkit-overflow-scrolling: touch;
  }

  .calendar table {
    clear: both;
    width: 33.333%;
    height: 100%;
    border-collapse: collapse;
    color: #444444;
  }

  .calendar td {
    width: 14.28571429%;
    font-size: 14px;
    cursor: pointer;
    position: relative;
    vertical-align: center;

    padding: 0;
    height: 40px;
    text-align: center;
  }

  .calendar td.week {
    font-size: 10px;
    pointer-events: none !important;
    cursor: default !important;
  }

  .calendar td.disabled, .calendar td.disabled > span {
    color: #ccc;
    pointer-events: none !important;
    cursor: default !important;
    opacity: 0;
  }

  .calendar td.disabled div {
    color: #ccc;
  }

  .calendar td > span:first-child {
    width: 70%;
    height: 40%;
    margin: auto;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #333;
    font-size: 12px !important;
  }

  .calendar td:not(.selected) span:not(.red):hover {
    background: #f3f8fa;
    color: #444;
  }

  .calendar td .dot {
    width: 70%;
    margin: auto;
    height: 60%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    color: #333;
    font-size: 10px !important;

    /*position: absolute;*/
    /*bottom: 0px;*/
    /*left: 50%;*/
    /*text-align: center;*/
    /*padding: 2px;*/
    /*font-size: 8px;*/
    /*line-height: 1.2;*/
    /*color: #444;*/
    /*width: 1px;*/
    /*height: 1px;*/
    /*background: #85c731;*/
    /*transform: translateX(-50%) scale(0.8);*/
    /*border-radius: 50%;*/
  }

  .calendar td .isGregorianFestival,
  .calendar td .isLunarFestival {
    color: #ea6151;
  }

  .calendar td.selected span.red {
    background-color: #ea6151;
    color: #fff;
  }

  .calendar td.selected span.red:hover {
    background-color: #ea6151;
    color: #fff;
  }

  .calendar thead td {
    text-transform: uppercase;
    height: 30px;
    vertical-align: middle;
  }

</style>
