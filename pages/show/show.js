// pages/show/show.js
Page({

  /**
   * Page initial data
   */
  data: {
    testImage: "https://tse4-mm.cn.bing.net/th/id/OIP.HJdtsb6yf2Q0DRkpVVrL6wAAAA?pid=Api&rs=1"

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
        this.setData({slots: res.data.objects})
        })
  },

  chooseDate: function (e) {
    console.log('radio', e)
    let chosenSlotId = e.detail.value
    let chosenSlot = this.data.slots.find(item => {
      return item.id == chosenSlotId})
    this.setData({chosenSlot: chosenSlot})
    console.log('chosenSlot', chosenSlot)
  },

  setFinalDate: function () {
    wx.showModal({
      title: 'Reminder',
      content: `Please confirm you want the event to start on ${this.data.chosenSlot.start_date}`,
      success (res) {
        if (res.confirm) {
          console.log('user clicked confirm')

        } else if (res.cancel) {
          console.log('user clicked cancel')
        }
      }
    })
  },

  setFinalDateEarly: function () {
    wx.showModal({
      title: 'Reminder',
      content: `You are trying to confirm the final event date before the response deadline. Some users may still want to provide their availability. Please confirm you want the event to start on ${this.data.chosenSlot.start_date}`,
      success (res) {
        if (res.confirm) {
          console.log('user clicked confirm')
        } else if (res.cancel) {
          console.log('user clicked cancel')
        }
      }
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

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})