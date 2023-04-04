// pages/subroutine/saying/saying.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeName: '0'
    },
    onChange(event) {
        // console.log(event)
        this.setData({
            activeName: event.detail,
        });
    },
    redirect() {
        // if (app.globalData.userInfo) {
        // }
        wx.showActionSheet({
            itemList: ["金句", "趣词"],
            success: res => {
                //   console.log(res.tapIndex)
                wx.navigateTo({
                    url: './newlyUpload/newlyUpload?index=' + res.tapIndex,
                })
            }
        })
    },
    //查询金句
    queryDailySentence() {
        wx.cloud.callFunction({
            name: 'queryDailySentence',
            success: res => {
                // console.log(res)
                this.setData({
                    sentences: res.result.data
                })
            }
        })
    },
    //查询趣词
    queryDailyWords() {
        wx.cloud.callFunction({
            name: 'queryDailyWords',
            success: res => {
                // console.log(res)
                this.setData({
                    words: res.result.data
                })
            },
            fail: err => {
                console.log(err)
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.queryDailySentence()
        this.queryDailyWords()
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