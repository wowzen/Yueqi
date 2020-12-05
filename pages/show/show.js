// pages/show/show.js
Page({

  /**
   * Page initial data
   */
  data: {
    testImage: "https://tse4-mm.cn.bing.net/th/id/OIP.HJdtsb6yf2Q0DRkpVVrL6wAAAA?pid=Api&rs=1",
    dateSelected: false,
    availabilityProvided: false
  },

  onLoad: function (options) {
    const id = options.id;
    const currentUser = wx.getStorageSync('user');
    this.setData({currentUser});
    this.getEvent(id)
    this.getSlots(id)
  },

  getEvent: function (id) {
    let Events = new wx.BaaS.TableObject("events")
     Events.expand(["creator_id"]).get(id).then (res => {
        console.log(res)
        let today = new Date()
        let deadlinePassed = today > new Date(Date.parse(res.data.response_deadline))
        this.setData({event: res.data, deadlinePassed: deadlinePassed})
      })
  },

  getSlots: function (id) {
    let Slots = new wx.BaaS.TableObject("event_slots")
    let query = new wx.BaaS.Query()
    query.compare('event_id', '=', id)
    Slots.setQuery(query).find().then(res => {
      console.log(res)
      let confirmedSlot = res.data.objects.find(item => {
        return item.slot_selected
      })
      this.setData({slots: res.data.objects, confirmedSlot: confirmedSlot})
    })
  },

  chooseDate: function (e) {
    console.log('radio', e)
    let chosenSlotId = e.detail.value
    let chosenSlot = this.data.slots.find(item => {
      return item.id == chosenSlotId})
    this.setData({chosenSlot: chosenSlot, dateSelected: true})
    console.log('chosenSlot', chosenSlot)
    wx.pageScrollTo({
      scrollTop: 1000,
      duration: 300
    })
  },

  setFinalDate: function () {
    wx.showModal({
      title: 'Reminder',
      content: `Please confirm you want the event to start on ${this.data.chosenSlot.start_date}`,
      success (res) {
        if (res.confirm) {
          chosenSlot.create({}).then(res =>{
            console.log(res)

          })


        } else if (res.cancel) {
          console.log('user clicked cancel', res)
        }
      }
    })
  },

  setFinalDateEarly: function () {
    let page = this
    let chosenSlot = this.data.chosenSlot
    let EventSlots = new wx.BaaS.TableObject("event_slots")
    let Events = new wx.BaaS.TableObject("events")
    let eventId = this.data.event.id
    wx.showModal({
      title: 'Reminder',
      content: `You are trying to confirm the final event date before the response deadline. Some users may still want to provide their availability. Please confirm you want the event to start on ${this.data.chosenSlot.start_date}`,
      success (res) {
        if (res.confirm) {
          console.log('user clicked confirm')
          let event = Events.getWithoutData(eventId)
          event.set({confirmed_date: chosenSlot.start_date}).update().then()
          let eventSlot = EventSlots.getWithoutData(chosenSlot.id)
          eventSlot.set({slot_selected: true}).update().then(res => {
            console.log(res)
            page.setData({confirmedSlot: res.data})
          })

        } else if (res.cancel) {
          console.log('user clicked cancel')
        }
      }
    })
  },

  inviteFriends: function () {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
    

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },
  onShareAppMessage: function () {
    return {
      title: `You are invited for: ${this.date.event.occasion}`,
      path: `pages/show/show?id=${this.date.event.id}`
    }
  }
})