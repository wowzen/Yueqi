// pages/userevents/userevents.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let currentUser = wx.getStorageSync('user')
    this.setData({currentUser: currentUser})
    let EventType = new wx.BaaS.TableObject("event_types")
    EventType.find().then(res => {
      let occasions = res.data.objects[0].event_occasions_objects.map(item => Object.keys(item)[0])
      let activities = res.data.objects[0].event_activities
      this.setData({event_types: res.data.objects, occasions: occasions, activities: activities})
      console.log("activities", res)
    }, err => {
      // err
    })
    this.getMyEvents()
    this.getInvitedEvents()
  },

  getMyEvents: function () {
    let currentUser = this.data.currentUser;
    let event = new wx.BaaS.TableObject("events");
    let query = new wx.BaaS.Query()
    
    query.compare('creator_id', "=", currentUser.id)
    event.setQuery(query).find().then(res => {
      let myEvents = res.data.objects.sort((a, b) => b.updated_at - a.updated_at);
      this.setData({myEvents: myEvents});
    })
  },

  // getOtherUserEvents: function () {
  //   let currentUser = this.data.currentUser;
  //   let event = new wx.BaaS.TableObject("events");
  //   let query = new wx.BaaS.Query()
    
  //   query.compare('creator_id', "!=", currentUser.id)
  //   event.setQuery(query).find().then(res => {
  //     let otherUserEvents = res.data.objects
  //     this.setData({otherUserEvents: otherUserEvents});
  //   })
  // },

  getInvitedEvents: function () {
    let currentUser = this.data.currentUser;
    let event = new wx.BaaS.TableObject("event_invitations");
    let query = new wx.BaaS.Query()
    
    query.compare('creator_id', "!=", currentUser.id)
    query.compare('invitee_id', "=", currentUser.id)
    event.setQuery(query).expand(["event_id", "creator_id"]).find().then(res => {
      let invitedEvents = res.data.objects.sort((a, b) => b.updated_at - a.updated_at);
      this.setData({invitedEvents: invitedEvents});
      console.log(invitedEvents)
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
    let event = new wx.BaaS.TableObject("events")
    event.find().then(res => {
      console.log("res", res)
      this.setData({events: res.data.objects})
    }, err => {
      // err
    })
  },

  goToEvent: function (e) {
    
    console.log('goToEvent', e)
    let id = e.currentTarget.dataset.eventid
    wx.navigateTo({
      url: `/pages/show/show?id=${id}`,
    })
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