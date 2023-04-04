// pages/subroutine/saying/newlyUpload/newlyUpload.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        btn: true,
        index: 0//上传选项index值
    },
    onChange(e) {
        var val = e.detail.value
        if (val.length > 0) {
            this.setData({
                btn: false
            })
        } else {
            this.setData({
                btn: true
            })
        }
    },
    onSubmit(res) {
        // console.log(res)
        wx.showLoading({
            title: '正在上传中...',
            mask: true
        })
        var saying = res.detail.value.saying
        var author = res.detail.value.author
        var words = res.detail.value.words
        var spell = res.detail.value.spell
        var explanation = res.detail.value.explanation
        if (this.data.index == 0) {
            wx.cloud.callFunction({
                name: 'uploadSaying',
                data: {
                    index: 0,
                    saying: saying,
                    author: author
                },
                success: res => {
                    // console.log(res)
                    wx.hideLoading({
                        success: (res) => {
                            wx.showToast({
                                title: '上传成功~',
                                duration: 1000
                            })
                            setTimeout(() => {
                                //获取页面栈
                                var pages=getCurrentPages()
                                var index=pages.length
                                //上一页索引值
                                var saying=pages[index-2]
                                saying.queryDailySentence()
                                wx.navigateBack()
                            }, 1000)
                        },
                    })
                }
            })
        } else if (this.data.index == 1) {
            wx.cloud.callFunction({
                name: 'uploadSaying',
                data: {
                    index: 1,
                    words: words,
                    spell: spell,
                    explanation: explanation
                },
                success: res => {
                    // console.log(res)
                    wx.hideLoading({
                        success: (res) => {
                            wx.showToast({
                                title: '上传成功~',
                                duration: 1000
                            })
                            setTimeout(() => {
                                //获取页面栈
                                var pages=getCurrentPages()
                                var index=pages.length
                                //上一页索引值
                                var saying=pages[index-2]
                                saying.queryDailyWords()
                                wx.navigateBack()
                            }, 1000)
                        },
                    })
                }
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            index: options.index
        })
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