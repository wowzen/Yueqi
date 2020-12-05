// pages/show/show.js
Page({

  /**
   * Page initial data
   */
  data: {
    testImage: "https://tse4-mm.cn.bing.net/th/id/OIP.HJdtsb6yf2Q0DRkpVVrL6wAAAA?pid=Api&rs=1",
    dateSelected: false,
    availabilitySubmitted: false
  },

  onLoad: function (options) {
    const id = options.id;
    const currentUser = wx.getStorageSync('user');
    console.log(options)
    this.setData({currentUser});
    this.getEvent(id)
    this.getSlots(id)
  },

  getEvent: function (id) {
    let page = this
    let Events = new wx.BaaS.TableObject("events")
     Events.expand(["creator_id"]).get(id).then (res => {
        console.log(res)
        let today = new Date()
        let deadlinePassed = today > new Date(Date.parse(res.data.response_deadline))
        page.setData({event: res.data, deadlinePassed: deadlinePassed})
        page.createInvitation(page.data.currentUser.id, res.data)
      })
  },

  getSlots: function (id) {
    let page = this
    let Slots = new wx.BaaS.TableObject("event_slots")
    let query = new wx.BaaS.Query()
    query.compare('event_id', '=', id)
    Slots.setQuery(query).find().then(res => {
      console.log(res)
      let confirmedSlot = res.data.objects.find(item => {
        return item.slot_selected
      })
      this.setData({slots: res.data.objects, confirmedSlot: confirmedSlot})
      let slotIds = res.data.objects.map(e => {
        return e.id
      })
      page.fetchSlotResponses(page.data.currentUser.id, slotIds)
    })
  },

  chooseDate: function (e) {
    console.log('radio', e)
    let chosenSlotId = e.detail.value
    let chosenSlot = this.data.slots.find(item => {
      return item.id == chosenSlotId})
    this.setData({chosenSlot: chosenSlot, dateSelected: true})
    console.log('chosenSlot', chosenSlot)
    wx.pageScrollTo({
      scrollTop: 1000,
      duration: 300
    })
  },

  chooseMultiDate: function (e) {
    console.log('checkbox', e)
    let chosenSlotIds = e.detail.value
    this.setData({chosenSlotIds: chosenSlotIds})
  },

  submitAvailability: function () {
    let page = this
    let chosenSlotIds = page.data.chosenSlotIds
    let EventSlotResponses = new wx.BaaS.TableObject("event_slot_responses")
    chosenSlotIds.forEach(item => {
      EventSlotResponses.create().set({event_slot_id: item, invitee_id: page.data.currentUser.id, invitee_response: "yes"}).save().then(res => {
        console.log('submitavailability', res)
        page.setData({availabilitySubmitted: true})
      })
    })
  },

  fetchSlotResponses: function (invitee_id, slot_ids) {
    let EventSlotResponses = new wx.BaaS.TableObject("event_slot_responses")
    let query = new wx.BaaS.Query()
    query.compare('invitee_id', '=', invitee_id)
    query.in('event_slot_id', slot_ids)
    EventSlotResponses.setQuery(query).find().then(res => {
      console.log(res)
      this.setData({responseSlots: res.data.objects, availabilitySubmitted: res.data.objects.length > 0})
    })
  },

  setFinalDate: function () {
    wx.showModal({
      title: 'Reminder',
      content: `Please confirm you want the event to start on ${this.data.chosenSlot.start_date}`,
      success (res) {
        if (res.confirm) {
          console.log('user clicked confirm')
          let event = Events.getWithoutData(eventId)
          event.set({confirmed_date: chosenSlot.start_date}).update().then(res => {
            page.setData({event: res.data})
          })
          let eventSlot = EventSlots.getWithoutData(chosenSlot.id)
          eventSlot.set({slot_selected: true}).update().then(res => {
            console.log(res)
            page.setData({confirmedSlot: res.data})
          })

        } else if (res.cancel) {
          console.log('user clicked cancel')
        }
      }
    })
  },

  setFinalDateEarly: function () {
    let page = this
    let chosenSlot = this.data.chosenSlot
    let EventSlots = new wx.BaaS.TableObject("event_slots")
    let Events = new wx.BaaS.TableObject("events")
    let eventId = this.data.event.id
    wx.showModal({
      title: 'Reminder',
      content: `You are trying to confirm the final event date before the response deadline. Some users may still want to provide their availability. Please confirm you want the event to start on ${this.data.chosenSlot.start_date}`,
      success (res) {
        if (res.confirm) {
          console.log('user clicked confirm')
          let event = Events.getWithoutData(eventId)
          event.set({confirmed_date: chosenSlot.start_date}).update().then(res => {
            page.setData({event: res.data})
          })
          let eventSlot = EventSlots.getWithoutData(chosenSlot.id)
          eventSlot.set({slot_selected: true}).update().then(res => {
            console.log(res)
            page.setData({confirmedSlot: res.data})
          })

        } else if (res.cancel) {
          console.log('user clicked cancel')
        }
      }
    })
  },

  inviteFriends: function () {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    })
  },

  createInvitation: function(invitee_id, event) {
    let Invitation = new wx.BaaS.TableObject("event_invitations")
    let query = new wx.BaaS.Query()
    query.compare('event_id', '=', event.id)
    query.compare('invitee_id', '=', invitee_id)
    query.compare('creator_id', '!=', invitee_id)
    Invitation.setQuery(query).find().then(res => {
      if (res.data.objects.length == 0) {
        console.log(event, invitee_id)
        Invitation.create().set({event_id: event.id, invitee_id: invitee_id, creator_id: event.creator_id.id}).save().then(res => {
          console.log(res)
        })
      }
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
  onShareAppMessage: function () {
    return {
      title: `You are invited for: ${this.date.event.occasion}`,
      path: `pages/show/show?id=${this.date.event.id}`
    }
  }
})