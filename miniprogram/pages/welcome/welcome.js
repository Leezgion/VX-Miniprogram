// pages/welcome/welcome.js
const app = getApp()
Page({
    //点击 按钮 进入小程序


    /**
     * 页面的初始数据
     */
    data: {
    },

    accredit(res) {
        console.log(res)
        if (res.detail.userInfo) {
            app.globalData.userInfo = res.detail.userInfo
            wx.showToast({
              title: '授权成功',
              icon:"success"
            })
            wx.setStorageSync('key', res.detail.userInfo)
            // setTimeout(function() {
            //   wx.reLaunch({
            //     url: '../main/main',
            //   })
            // })
        }
        //当前登录用户的信息
        // console.log(res.detail.userInfo)

        // console.log(res)
    },
    bindGetUserInfo(res) {
        wx.showModal({
            title: '授权',
            success: res => {
                console.log(res)
                if (res.confirm) {
                    wx.getUserProfile({
                        desc: 'desc',
                        success: res => {
                            wx.reLaunch({
                                url: '../main/main',
                            })
                        },
                        fail: err => {
                            console.log(err)
                        }
                    })
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.getStorage({
            key: 'key',
            success (res) {
            //   console.log(res.data)
              if(res.data){
                wx.reLaunch({
                    url: '../main/main',
                })
              }
            },
            fail(err){
                console.log(err)
            }
          })
        //   console.log(app.globalData.storage)
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
            backgroundColor: '#FFE4B5',
            frontColor: '#ffffff',
            animation: {
                duration: 2000,
                timingFunc: 'easeInOut'
            }
        }),
            wx.setNavigationBarTitle({
                title: '哪呢',
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