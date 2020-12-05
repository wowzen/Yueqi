// pages/calendar/calendar.js
Page({

  /**
   * Page initial data
   */
  data: {
    dayStyle: [
        { month:'current', day:new Date().getDate(),color:'white', background: "#AAD4F5" },
        { month:'current', day:new Date().getDate(),color:'white',background:'#AAD4F5'}
      ],
    },

  onLoad: function (options) {
    let Slot = new wx.BaaS.TableObject('event_slots')
  },
  
  dayClick: function(event) {
    console.log(event)
    let clickDay = event.detail.day;
    let changeDay = 'dayStyle[1].day';
    let changeBg = 'dayStyle[1].background';
    let chosenDate = `${event.detail.year}-${event.detail.month}-${event.detail.day}`
    this.setData({
      [changeDay]:clickDay,
      [changeBg]:'#84e7d0',
      chosenDate: chosenDate
    })
  },
  bindStartTimeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      start_time: e.detail.value
    })
   // const lotStartTime: new Date (ChangeDay + start_time)
  },

  bindEndTimeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      end_time: e.detail.value
    })
    },

 




  onReady: function () {

  },


})