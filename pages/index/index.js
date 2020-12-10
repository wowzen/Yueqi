const app = getApp()

Page({
  data: {
    
  },
  
  onLoad: function () {
    let currentUser = wx.getStorageSync('user')
    this.setData({currentUser: currentUser})
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

  goToIndex: function () {
    wx.navigateTo({
      url: '../index/index',
    })

  },

})
