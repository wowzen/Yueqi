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

  login: function (e) {
    console.log(e)
    let page = this
    wx.BaaS.auth.loginWithWechat(e).then(res => {
      console.log(res)
      wx.setStorageSync('user', res)
      this.setData({currentUser: res})
      page.createEvent()
      })
  },

})
