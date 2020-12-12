Page({
  data: {
    dayStyle: [
        { month:'current', day:new Date().getDate(),color:'green' },
        { month:'current', day:new Date().getDate(),color:'green'}
      ],
    chosenSlots: [],
    slotsAdded: false,
    addDateButton: 'Add your first Date',
    activeButton: 'add-slot' // ['add-slot', 'view-invitation']
    },

  onLoad: function (options) {
    let event_id = options.id
    this.setData({event_id: event_id})
    let currentUser = wx.getStorageSync('user')
    this.setData({currentUser: currentUser})
    this.fetchSlots(event_id)
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
  },

  bindEndTimeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      end_time: e.detail.value
    })
  },

  addSlot:function(e){
    let page = this
    console.log(e)
    let chosenDate = this.data.chosenDate
    console.log(chosenDate)
    let start_date = chosenDate + ' ' + this.data.start_time
    let end_date = chosenDate + ' ' + this.data.end_time
    if (chosenDate == undefined || chosenDate == '' || this.data.start_time == undefined || this.data.start_time == '' || this.data.end_time == undefined || this.data.end_time == '') {
      wx.showModal({
        title: 'Reminder',
        content: `Please choose date and time`,
        success (res) {
          if (res.confirm) {
          } else if (res.cancel) {
            console.log('user clicked cancel')
          }
        }
      })
      return
    }
    let data = {
      event_id: this.data.event_id,
      start_date: start_date,
      end_date: end_date,
    }
    console.log(data)
    let chosenSlots = page.data.chosenSlots
    let Slot = new wx.BaaS.TableObject('event_slots')
    Slot.create().set(data).save().then(res => {
      console.log(res)
      // replace - in date to / for iOS, 2012-12-12 to 2012/12/12, still store 2012-12-12 to BaaS
      let reg = /-/g;
      let theDate = page.data.chosenDate
      theDate = new Date(theDate.replace(reg,'/'))
      data.start_date = theDate.toDateString().slice(4,10) + ' ' + page.data.start_time
      data.end_date   = theDate.toDateString().slice(4,10) + ' ' + page.data.end_time
      data.id = res.data.id
      chosenSlots.push(data)
      console.log('chosenSlots')
      console.log(chosenSlots)
      let changeDay = 'dayStyle[1].day';
      let changeBg = 'dayStyle[1].background';
      this.setData({
        chosenSlots: chosenSlots,
        [changeDay]: null,
        [changeBg]: '#84e7d0',
        slotsAdded: true,
        chosenDate: '',
        addDateButton: 'Add another Date',
        activeButton: 'view-invitation'
      })
      wx.pageScrollTo({
        duration: 300,
        scrollTop:1000
      })
    })
  },

  removeSlot: function(e) {
    let page = this
    console.log(e)
    let slotId = e.currentTarget.dataset.id
    let slotIndex = e.currentTarget.dataset.index
    let chosenSlots = page.data.chosenSlots
    let Slot = new wx.BaaS.TableObject('event_slots')
    Slot.delete(slotId).then(res => {
      console.log(res)
      chosenSlots.splice(slotIndex, 1)
      if (chosenSlots.length == 0) {
        page.setData({
          addDateButton: 'Add your first Date',
          slotsAdded: false,
          activeButton: 'add-slot'
        })
      }
      page.setData({chosenSlots: chosenSlots})
    })
  },
  fetchSlots: function(event_id) {
    let page = this
    let Slot = new wx.BaaS.TableObject('event_slots')
    let query = new wx.BaaS.Query()
    query.compare('event_id', '=', event_id)
    console.log(event_id)
    Slot.setQuery(query).find().then(res => {
      console.log(res)
      let chosenSlots = res.data.objects
      let reg = /-/g;
      chosenSlots.forEach(item => {
        let start_date = new Date(item.start_date.split(' ')[0].replace(reg,'/'))
        let start_time = item.start_date.split(' ')[1]
        let end_time = item.end_date.split(' ')[1]
        let end_date = new Date(item.start_date.split(' ')[0].replace(reg,'/'))
        item.start_date = start_date.toDateString().slice(4,10) + ' ' + start_time
        item.end_date = end_date.toDateString().slice(4,10) + ' ' + end_time
      })
      if (chosenSlots.length > 0) {
        page.setData({
          addDateButton: 'Add another Date',
          slotsAdded: true,
          chosenSlots: chosenSlots,
          activeButton: 'view-invitation'
        })
      }
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
