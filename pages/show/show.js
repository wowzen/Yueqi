// pages/show/show.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  onLoad: function (options) {
    let Events = new wx.BaaS.TableObject("events")
     Events.get("5fc64bf31ec30f00a4f3804c").then (res =>
      {
        console.log(res)
        this.setData({event: res.data})

      })

    let Slots = new wx.BaaS.TableObject("event_slots")
    let query = new wx.BaaS.Query()
    query.compare('event_id', '=', "5fc64bf31ec30f00a4f3804c")
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