// pages/create/create.js
Page({

  /**
   * Page initial data
   */
  data: {
    occasionSelected: false,
    occasionSpecSelected: true,
    goToSelectActivity: false,
    activitySelected: false,
    goToSelectDates: false,
  },

//   formSubmit: function (e) {

//     let occasion = e.detail.value.occasion;
//     let activity = e.detail.value.activity;
//     let event = {occasion: occasion, activity: activity};

//     this.sendData(event);
//   },

//   sendData: function (event) {

//     let url = "https://fml.shanghaiwogeng.com/api/v1/stories"

//     wx.request({
//       url: url,
//       method: 'POST',
//       data: story,
//       success: (res) => {
//         console.log(res);
//         wx.switchTab({
//           url: '../calendar/calendar',
//         })
//       }
//    })
// },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function () {
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
  },

  selectOccasion: function (e) {
    console.log(e)
    let mainOccasion = e.currentTarget.dataset.occa
    let occasionIndex = e.currentTarget.dataset.index
    let occasionObject = this.data.event_types[0].event_occasions_objects[occasionIndex]
    let occasionSpecs = occasionObject[mainOccasion]
    let occasionSelected = !this.data.occasionSelected
    this.setData({mainOccasion: mainOccasion, occasionIndex: occasionIndex, occasionObject: occasionObject, occasionSpecs: occasionSpecs, occasionSelected: occasionSelected})

  },

  selectOccasionSpec: function (e) {
    let occasionSpecSelected = !this.data.occasionSpecSelected
    let goToSelectActivity = !this.data.goToSelectActivity
    let finalOccasion = e.currentTarget.dataset.focca.title
    let occasionImage = e.currentTarget.dataset.focca.image
    this.setData({occasionSpecSelected: occasionSpecSelected, goToSelectActivity: goToSelectActivity, finalOccasion: finalOccasion, occasionImage: occasionImage})
    console.log(e)

  },

  selectActivity: function (e) {
    let activitySelected = !this.data.activitySelected
    let goToSelectActivity = !this.data.goToSelectActivity
    let goToSelectDates = !this.data.goToSelectDates
    let finalActivity = e.currentTarget.dataset.facti
    this.setData({activitySelected: activitySelected, goToSelectActivity: goToSelectActivity, goToSelectDates: goToSelectDates, finalActivity: finalActivity})
    this.setData({pickResponseDeadline: true})
  },

  startAgain: function (e) {
    let occasionSelected = false
    let occasionSpecSelected = true
    let goToSelectActivity = false
    let activitySelected = false
    let goToSelectDates = false
    let finalActivity = "Select again"
    let finalOccasion = "Select again"
    this.setData({occasionSelected: occasionSelected, occasionSpecSelected: occasionSpecSelected, goToSelectActivity: goToSelectActivity, activitySelected: activitySelected, goToSelectDates: goToSelectDates, finalActivity: finalActivity, finalOccasion: finalOccasion})
  },

  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      response_date: e.detail.value
    })
  },
  bindTimeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      response_time: e.detail.value
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

  submitNewEvent: function () {
    let page = this
    let activity = this.data.finalActivity
    let occasion = this.data.finalOccasion
    let image = this.data.occasionImage
    let creator_id = this.data.currentUser.id
    let data = {occasion: occasion, activity: activity, image: image, creator_id: creator_id}
    if (this.data.response_date && this.data.response_time) {
      data.response_deadline = this.data.response_date + ' ' + this.data.response_time
    }
    let Event = new wx.BaaS.TableObject("events")
    Event.create().set(data).save().then(res =>{
      console.log(res)
      page.navToSelectDates(res.data.id)
    })
  },

  navToSelectDates: function (id) {
    wx.navigateTo({
      url: `../calendar/calendar?id=${id}`})
  },

  login: function (e) {
    console.log(e)
    let page = this
    wx.BaaS.auth.loginWithWechat(e).then(res => {
      console.log(res)
      wx.setStorageSync('user', res)
      this.setData({currentUser: res})
      })
  },

})