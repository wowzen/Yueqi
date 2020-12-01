const config = require('key')
App({
  onLaunch: function() {
    wx.BaaS = requirePlugin('sdkPlugin');
    //让插件帮助完成登录、支付等功能
    wx.BaaS.wxExtend(wx.login, wx.getUserInfo)

    let clientID = config.clientID  // 
    wx.BaaS.init(clientID);
    // wx.BaaS.auth.loginWithWechat().then(user => {
    //   console.log(user)
    //   wx.setStorageSync('user', user);
    // })
  }
})