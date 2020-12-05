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
    chosenSlots: [],
    slotsAdded: false
    },

  onLoad: function (options) {
    let event_id = options.id 
    this.setData({event_id: event_id})
    let currentUser = wx.getStorageSync('user')
    this.setData({currentUser: currentUser})
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
   //let lotStartTime = "ChangeDay" + "start_time"
   //console.log(lotsStartTime)
  },

  bindEndTimeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      end_time: e.detail.value
    })
    },

  addSlot:function(e){
    console.log(e)
    let Slot = new wx.BaaS.TableObject('event_slots')
    let data = {
      event_id: this.data.event_id,
      start_date: this.data.chosenDate + ' ' + this.data.start_time,
      end_date:this.data.chosenDate + ' ' + this.data.end_time,
    }
    let chosenSlots = this.data.chosenSlots
    Slot.create().set(data).save().then(res => {
      console.log(res)
      chosenSlots.push(data)
      let changeDay = 'dayStyle[1].day';
      let changeBg = 'dayStyle[1].background';
      this.setData({
        chosenSlots: chosenSlots,
        [changeDay]: null,
        [changeBg]: '#84e7d0',
        slotsAdded: true
      })
      wx.pageScrollTo({
        duration: 300,
        scrollTop:1000
      })
    })
  },

  toShowPage: function () {
    wx.navigateTo({
      url: `/pages/show/show?id=${this.data.event_id}`,
    })
  },


  onReady: function () {

  },


})