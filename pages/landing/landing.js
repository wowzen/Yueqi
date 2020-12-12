// pages/landing/landing.js
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3500,
    duration: 500,
    circular: true,
    imgUrls: ['https://cloud-minapp-38171.cloud.ifanrusercontent.com/1knMU56iKv0awum3.png', 'https://cloud-minapp-38171.cloud.ifanrusercontent.com/1knMU5ZzokuJE2y0.png', 'https://cloud-minapp-38171.cloud.ifanrusercontent.com/1knMU5BvEnZqBJF9.png', 'https://cloud-minapp-38171.cloud.ifanrusercontent.com/1knMU5NJ8p3kQC5c.png']
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  getStarted: function (e) {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  createEvent: function () {
    wx.navigateTo({
      url: '../create/create',
    })
  },

  viewEvents: function () {
    wx.navigateTo({
      url: '../userevents/userevents',
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
