let config = require('key')
App({
  onLaunch: function() {
    wx.BaaS = requirePlugin('sdkPlugin')
    wx.BaaS.wxExtend(wx.login, wx.getUserInfo)

    let clientID = config.clientID  // 
    wx.BaaS.init(clientID);
    wx.BaaS.auth.loginWithWechat().then(user => {
      console.log(user)
      // wx.setStorageSync('user', user);
    })
  }
})