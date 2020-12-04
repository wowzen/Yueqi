// pages/show/show.js
Page({

  /**
   * Page initial data
   */
  data: {

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
     Events.get(id).then (res =>
      {
        console.log(res)
        this.setData({event: res.data})
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