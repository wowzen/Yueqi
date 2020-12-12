const utils = require('../../utils/util')
// pages/show/show.js
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

  // onReady: function () {
  //   this.setProgress()
  // },

  getEvent: function (id) {
    let page = this
    let Events = new wx.BaaS.TableObject("events")
    Events.expand(["creator_id"]).get(id).then (res => {
      let today = new Date()
      let deadlinePassed = today > new Date(Date.parse(res.data.response_deadline))

      let event = res.data
      let { response_deadline, confirmed_date } = event

      response_deadline = utils.parseStringDate(response_deadline)
      response_deadline = utils.formatDateTime(response_deadline)

      confirmed_date = utils.parseStringDate(confirmed_date)
      confirmed_date = utils.formatDateTime(confirmed_date)

      event.response_deadline = response_deadline
      event.confirmed_date = confirmed_date

      page.setData({ event: event, deadlinePassed: deadlinePassed })
      page.createInvitation(page.data.currentUser.id, res.data)
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

  chooseDate: function (e) {
    let chosenSlotId = e.detail.value
    let chosenSlot = this.data.slots.find(item => {
      return item.id == chosenSlotId})
    this.setData({chosenSlot: chosenSlot, dateSelected: true})
    wx.pageScrollTo({
      scrollTop: 1000,
      duration: 300
    })
  },

  // chooseMultiDate: function (e) {
  //   let chosenSlotIds = e.detail.value
  //   this.setData({chosenSlotIds: chosenSlotIds})
  // },

  // submitResponse: function () {
  //   Promise.all([
  //     ...this.submitAvailability(),
  //     this.countResponses(),
  //   ]).then(values => {
  //     console.log('values', values)
  //     this.setProgress()
  //   })
  // },

  // submitResponse: function () {
  //     this.submitAvailability(),
  //     this.countResponses()
  //   },

  // submitAvailability: function () {
  //   let page = this
  //   let chosenSlotIds = page.data.chosenSlotIds
  //   let EventSlotResponses = new wx.BaaS.TableObject("event_slot_responses")
  //   let Slots = new wx.BaaS.TableObject("event_slots")

  //   return chosenSlotIds.map(item => {
  //     return EventSlotResponses.create().set({event_slot_id: item, invitee_id: page.data.currentUser.id, invitee_response: "yes"}).save().then(res => {
  //       let Slot = Slots.getWithoutData(item)
  //       return Slot.incrementBy('response_yes', 1).update().then(res => {
  //         page.setData({availabilitySubmitted: true, updateResponse: false})
  //         console.log('finish submit availability', res)
  //         page.setProgress()
  //         return res
  //       })
  //     })
  //   })
  // },

  // removeAvailability: function () {
  //   let page = this
  //   let eventId = page.data.event.id
  //   let EventSlots = new wx.BaaS.TableObject("event_slots")
  //   let EventSlotResponses = new wx.BaaS.TableObject("event_slot_responses")
  //   let eventSlotQuery = new wx.BaaS.Query()
  //   let currentUserId = page.data.currentUser.id
  //   eventSlotQuery.compare('event_id', '=', eventId)
  //   return EventSlots.setQuery(eventSlotQuery).find().then(res => {
  //     let eventSlots = res.data.objects

  //     return eventSlots.map(eventSlot => {
  //       let query = new wx.BaaS.Query()
  //       query.compare('invitee_id', '=', currentUserId)
  //       query.compare('event_slot_id', '=', eventSlot.id)

  //       return EventSlotResponses.setQuery(query).find().then(res => { 
  //         console.log(res)
  //         let eventSlotResponses = res.data.objects
  //         return eventSlotResponses.map(esr => {
  //           console.log(esr)
  //           let Slot = EventSlots.getWithoutData(esr.event_slot_id.id)
  //           return EventSlotResponses.delete(esr.id).then(res => {
  //             console.log('remove yes', res)
  //             return Slot.incrementBy('response_yes', -1).update().then(res => {
  //               page.setData({availabilitySubmitted: false, updateResponse: true})
  //               console.log('finish remove availability')
  //               page.setProgress()
  //               return res
  //             }) 
  //           })
  //         })
  //       })
  //     })
  //   })
  // },

  // countResponses: function () {
  //   let page = this
  //   let AllSlots = new wx.BaaS.TableObject("event_slots")
  //   let eventId = page.data.event.id
  //   let query = new wx.BaaS.Query()
  //   query.compare('event_id', '=', eventId)

  //   return AllSlots.setQuery(query).find().then(res => {
  //     let Slot = res.data.objects
  //     return Slot.map(item => {
  //       return AllSlots.getWithoutData(item.id).incrementBy('response_total', 1).update().then(res => {
  //         console.log('finish count responses')
  //         page.setProgress()
  //         return res
  //       })
  //     })
  //   })
  // },

  // removeResponses: function () {
  //   let page = this
  //   let AllSlots = new wx.BaaS.TableObject("event_slots")
  //   let eventId = page.data.event.id
  //   let query = new wx.BaaS.Query()
  //   query.compare('event_id', '=', eventId)
  //   return AllSlots.setQuery(query).find().then(res => {
  //     let Slot = res.data.objects
  //     return Slot.map(item => {
  //       return AllSlots.getWithoutData(item.id).incrementBy('response_total', -1).update().then(res => {
  //         console.log('test', res)
  //         page.setProgress()
  //       })
  //     })
  //   })
  // },

  // updateResponse: function () {
  //   let page = this
  //   wx.showModal({
  //     title: 'Warning',
  //     content: 'Are you sure you want to update your availability?',
  //     success (res) {
  //       if (res.confirm) {
  //         console.log('user confirmed')

  //         Promise.all(
  //           [page.removeResponses(), page.removeAvailability()]).then(e => {
  //           page.setProgress()
  //           // page.setData({updateResponse: true, availabilitySubmitted: false})
  //         })

  //         // page.removeResponses()
  //         // page.removeAvailability()
  //         // page.setData({updateResponse: true, availabilitySubmitted: false})

  //       } else if (res.cancel) {
  //         console.log('user canceled')
  //       }
  //     }
  //   })
  // },

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

  setFinalDate: function () {
    wx.showModal({
      title: 'Reminder',
      content: `Please confirm you want the event to start on ${this.data.chosenSlot.start_date}`,
      success (res) {
        if (res.confirm) {
          let event = Events.getWithoutData(eventId)
          event.set({confirmed_date: chosenSlot.start_date}).update().then(res => {
            page.setData({event: res.data})
          })
          let eventSlot = EventSlots.getWithoutData(chosenSlot.id)
          eventSlot.set({slot_selected: true}).update().then(res => {
            page.setData({confirmedSlot: res.data, changeDate: false})
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
          let event = Events.getWithoutData(eventId)
          event.set({confirmed_date: chosenSlot.start_date}).update().then(res => {
            page.setData({event: res.data})
          })
          let eventSlot = EventSlots.getWithoutData(chosenSlot.id)
          eventSlot.set({slot_selected: true}).update().then(res => {
            page.setData({confirmedSlot: res.data, changeDate: false})
          })

        } else if (res.cancel) {
          console.log('user clicked cancel')
        }
      }
    })
  },

  changeFinalDate: function () {
    let page = this
    let Events = new wx.BaaS.TableObject("events")
    let eventId = this.data.event.id
    wx.showModal({
      title: 'Warning',
      content: 'Your participants have already been informed about your event date. Are you sure you want to change the date?',
      success (res) {
        if (res.confirm) {
          console.log('user confirmed')
          let event = Events.getWithoutData(eventId)
          event.set({confirmed_date: ''}).update().then(res => {
            page.setData({event: res.data, changeDate: true, dateSelected: false, confirmedSlot: false})
          })

        } else if (res.cancel) {
          console.log('user canceled')
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
  },

  goToLanding: function() {
    wx.reLaunch({
      url: '/pages/landing/landing',
    })
  },
})
