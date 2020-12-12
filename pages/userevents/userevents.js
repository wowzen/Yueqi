Page({
  data: {
    currentUser: null,
    testImage: `https://tse4-mm.cn.bing.net/th/id/OIP.HJdtsb6yf2Q0DRkpVVrL6wAAAA?pid=Api&rs=1`,
    avatar: 'https://tse4-mm.cn.bing.net/th/id/OIP.HJdtsb6yf2Q0DRkpVVrL6wAAAA?pid=Api&rs=1',
    title: 'Welcome!',
    eventTab: 'myEvents'
  },

  onLoad: function (options) {
    let currentUser = wx.getStorageSync('user')

    if (currentUser) {
      this.setData({
        currentUser: currentUser,
        avatar: currentUser.avatar,
        title: `Welcome, ${currentUser.nickname}`,
      })
    }

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
      myEvents = myEvents.map(event => {
        const { response_deadline, confirmed_date } = event

        const deadline = response_deadline && (new Date(response_deadline.substring(0, 10))).toDateString()
        const confirmed = confirmed_date &&  (new Date(confirmed_date.substring(0, 10))).toDateString()

        return {
          ...event,
          response_deadline: deadline,
          confirmed_date: confirmed,
        }
      })

      this.setData({ myEvents: myEvents });
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

      invitedEvents = invitedEvents.map(invitedEvent => {
        const event = invitedEvent.event_id
        const { response_deadline, confirmed_date } = event

        const deadline = response_deadline && (new Date(response_deadline.substring(0, 10))).toDateString()
        const confirmed = confirmed_date &&  (new Date(confirmed_date.substring(0, 10))).toDateString()

        return {
          ...event,
          creator_id: invitedEvent.creator_id,
          response_deadline: deadline,
          confirmed_date: confirmed,
        }
      })

      this.setData({ invitedEvents: invitedEvents });
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
    let id = e.currentTarget.dataset.eventid
    wx.navigateTo({
      url: `/pages/show/show?id=${id}`,
    })
  },

  login: function (e) {
    let page = this
    wx.BaaS.auth.loginWithWechat(e).then(res => {
      wx.setStorageSync('user', res)
      page.setData({currentUser: res})
      page.getMyEvents()
      page.getInvitedEvents()
    })
  },
  changeTab: function() {
    if (this.data.eventTab =='myEvents') {
      this.setData({eventTab: 'invitedEvents'})
    } else {
      this.setData({eventTab: 'myEvents'})
    }
  }
})
