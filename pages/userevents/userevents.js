Page({

  data: {
    testImage: `https://tse4-mm.cn.bing.net/th/id/OIP.HJdtsb6yf2Q0DRkpVVrL6wAAAA?pid=Api&rs=1`

  },

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
      myEvents = myEvents.map(event => (
        {
          ...event,
          response_deadline: event.response_deadline && (new Date(event.response_deadline)).toDateString(),
          confirmed_date: event.confirmed_date &&  (new Date(event.confirmed_date)).toDateString(),
        }
      ))
      this.setData({myEvents: myEvents});
    })
  },

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
  }
})
