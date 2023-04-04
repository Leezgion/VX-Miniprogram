// pages/subroutine/notice/notice.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        text: 123
    },
    setClipboardData(e) {
        var number=e.currentTarget.dataset.number
        console.log(number)
        wx.setClipboardData({
            data: number,
            success(res) {
              wx.getClipboardData({
                success(res) {
                  // console.log(res.data) // data
                },
                fail(err) {
                  console.log(err)
                }
              })
            },
            fail(err) {
              console.log(err)
              wx.showToast({
                title: '复制失败',
              })
            }
          })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        wx.setNavigationBarColor({
            backgroundColor: '#F08080',
            frontColor: '#ffffff',
            animation: {
                duration: 2000,
                timingFunc: 'easeInOut'
            }
        }),
            wx.setNavigationBarTitle({
                title: '做吗',
            })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})