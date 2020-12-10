Page({

  data: {
    testImage: "https://tse4-mm.cn.bing.net/th/id/OIP.HJdtsb6yf2Q0DRkpVVrL6wAAAA?pid=Api&rs=1",
    dateSelected: false,
    availabilitySubmitted: false,
    changeDate: false,
    updateResponse: false
  },

  onLoad: function (options) {
    const id = options.id;
    const currentUser = wx.getStorageSync('user');
    this.setData({currentUser});
    this.getEvent(id)
    this.getSlots(id)
  },

  getEvent: function (id) {
    let page = this
    let Events = new wx.BaaS.TableObject("events")
    Events.expand(["creator_id"]).get(id).then (res => {
      let today = new Date()
      let deadlinePassed = today > new Date(Date.parse(res.data.response_deadline))
      console.log(res.data, typeof(response_deadline))
      let event = res.data
      const { response_deadline, confirmed_date } = event

      const deadline = response_deadline && (new Date(response_deadline.substring(0, 10))).toDateString()
      const confirmed = confirmed_date &&  (new Date(confirmed_date.substring(0, 10))).toDateString()

      event.response_deadline = deadline
      event.confirmed_date = confirmed

      page.setData({ event: event, deadlinePassed: deadlinePassed })
      page.createInvitation(page.data.currentUser.id, res.data)
    })
  },

  gotoResults: function () {
    let id = this.data.event.id
    wx.navigateTo({
      url: `/pages/results/results?id=${id}`,
    })
  },

  getSlots: function (id) {
    let page = this
    let Slots = new wx.BaaS.TableObject("event_slots")
    let query = new wx.BaaS.Query()
    query.compare('event_id', '=', id)
    Slots.setQuery(query).find().then(res => {
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

  chooseMultiDate: function (e) {
    let chosenSlotIds = e.detail.value
    this.setData({chosenSlotIds: chosenSlotIds})
  },

  submitResponse: function () {
    Promise.all([
      ...this.submitAvailability(),
      this.countResponses(),
    ]).then(values => {
      page.setData({availabilitySubmitted: true, updateResponse: false})
      console.log('values', values)
    })
  },

  // submitResponse: function () {
  //     this.submitAvailability(),
  //     this.countResponses()
  //   },

  submitAvailability: function () {
    let page = this
    let chosenSlotIds = page.data.chosenSlotIds
    let EventSlotResponses = new wx.BaaS.TableObject("event_slot_responses")
    let Slots = new wx.BaaS.TableObject("event_slots")

    return chosenSlotIds.map(item => {
      return EventSlotResponses.create().set({event_slot_id: item, invitee_id: page.data.currentUser.id, invitee_response: "yes"}).save().then(res => {
        let Slot = Slots.getWithoutData(item)
        return Slot.incrementBy('response_yes', 1).update().then(res => {
          // page.setData({availabilitySubmitted: true, updateResponse: false})
          console.log('finish submit availability', res)
          page.setProgress()
          return res
        })
      })
    })
  },

  removeAvailability: function () {
    let page = this
    let eventId = page.data.event.id
    let EventSlots = new wx.BaaS.TableObject("event_slots")
    let EventSlotResponses = new wx.BaaS.TableObject("event_slot_responses")
    let eventSlotQuery = new wx.BaaS.Query()
    let currentUserId = page.data.currentUser.id
    eventSlotQuery.compare('event_id', '=', eventId)
    return EventSlots.setQuery(eventSlotQuery).find().then(res => {
      let eventSlots = res.data.objects

      return eventSlots.map(eventSlot => {
        let query = new wx.BaaS.Query()
        query.compare('invitee_id', '=', currentUserId)
        query.compare('event_slot_id', '=', eventSlot.id)

        return EventSlotResponses.setQuery(query).find().then(res => { 
          console.log(res)
          let eventSlotResponses = res.data.objects
          return eventSlotResponses.map(esr => {
            console.log(esr)
            let Slot = EventSlots.getWithoutData(esr.event_slot_id.id)
            return EventSlotResponses.delete(esr.id).then(res => {
              console.log('remove yes', res)
              return Slot.incrementBy('response_yes', -1).update().then(res => {
              
                console.log('finish remove availability')
                page.setProgress()
                return res
              }) 
            })
          })
        })
      })
    })
  },

  countResponses: function () {
    let page = this
    let AllSlots = new wx.BaaS.TableObject("event_slots")
    let eventId = page.data.event.id
    let query = new wx.BaaS.Query()
    query.compare('event_id', '=', eventId)

    return AllSlots.setQuery(query).find().then(res => {
      let Slot = res.data.objects
      return Slot.map(item => {
        return AllSlots.getWithoutData(item.id).incrementBy('response_total', 1).update().then(res => {
          console.log('finish count responses')
          page.setProgress()
          return res
        })
      })
    })
  },

  removeResponses: function () {
    let page = this
    let AllSlots = new wx.BaaS.TableObject("event_slots")
    let eventId = page.data.event.id
    let query = new wx.BaaS.Query()
    query.compare('event_id', '=', eventId)
    return AllSlots.setQuery(query).find().then(res => {
      let Slot = res.data.objects
      return Slot.map(item => {
        return AllSlots.getWithoutData(item.id).incrementBy('response_total', -1).update().then(res => {
          console.log('test', res)
          page.setProgress()
        })
      })
    })
  },

  updateResponse: function () {
    let page = this
    wx.showModal({
      title: 'Warning',
      content: 'Are you sure you want to update your availability?',
      success (res) {
        if (res.confirm) {
          console.log('user confirmed')

          Promise.all(
            [page.removeResponses(), page.removeAvailability()]).then(e => {
            // page.setProgress()
            page.setData({updateResponse: true, availabilitySubmitted: false})
          })

          // page.removeResponses()
          // page.removeAvailability()
          // page.setData({updateResponse: true, availabilitySubmitted: false})

        } else if (res.cancel) {
          console.log('user canceled')
        }
      }
    })
  },

  setProgress: function () {
    let page = this
    let AllSlots = new wx.BaaS.TableObject("event_slots")
    let eventId = page.data.event.id
    let query = new wx.BaaS.Query()
    query.compare('event_id', '=', eventId)
    AllSlots.setQuery(query).find().then(res =>{
      let Slot = res.data.objects
      Slot.forEach(item => {
        console.log(item)
        let responseTotal = item.response_total
        let responseYes = item.response_yes
        let progressPercent= parseInt((responseYes/responseTotal) * 100)
        item.progressPercent = progressPercent
    
        AllSlots.getWithoutData(item.id).set({response_progress: progressPercent}).update().then(res => {
          console.log('setProgress', res)
        })
      })
      page.setData({
        slots: Slot
      })
    })
  },

  fetchSlotResponses: function (invitee_id, slot_ids) {
    let EventSlotResponses = new wx.BaaS.TableObject("event_slot_responses")
    let query = new wx.BaaS.Query()
    query.compare('invitee_id', '=', invitee_id)
    query.in('event_slot_id', slot_ids)
    EventSlotResponses.setQuery(query).find().then(res => {
      this.setData({responseSlots: res.data.objects, availabilitySubmitted: res.data.objects.length > 0})
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
        Invitation.create().set({event_id: event.id, invitee_id: invitee_id, creator_id: event.creator_id.id}).save().then(res => {
          console.log(res)
        })
      }
    })
  },

  onShareAppMessage: function () {
    return {
      title: `You are invited for: ${this.date.event.occasion}`,
      path: `pages/show/show?id=${this.date.event.id}`
    }
  }
})
