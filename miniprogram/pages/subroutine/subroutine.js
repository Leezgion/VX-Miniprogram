// pages/subroutine/subroutine.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    //显示模态窗口
    showModal: function (title, content, callback) {
        wx.showModal({
            title: title,
            content: content,
            confirmColor: '#1F4BA5',
            cancelColor: '#7F8389',
            success: function (res) {
                if (res.confirm) {
                    callback && callback();
                }
            }
        })
    },
    clearCache: function () {
        this.showModal('缓存清理', '确定要清除本地缓存吗？', function () {
            wx.clearStorage({
                success: function (msg) {
                    wx.showToast({
                        title: "缓存清理成功",
                        duration: 1000,
                        mask: true,
                        icon: "success"
                    })
                },
                fail: function (e) {
                    console.log(e)
                }
            })
        });
    },
    //申请管理员
    empower: function (params) {
        var user = app.globalData.userInfo
        this.showModal('申请管理员', '您要申请成为信息审核员吗', function () {
            wx.cloud.callFunction({
                name: 'apply',
                data: {
                    user
                },
                success: res => {
                    wx.showToast({
                        title: '申请成功',
                    })
                    // console.log(res)
                }
            })
        });
    },
    //查询当前用户是否拥有管理员权限
    powerQuery() {
        wx.cloud.callFunction({
            name: 'powerQuery',
            success: res => {
                // console.log(res.result)
                this.setData({
                    isAdmin: res.result
                })
            }
        })
    },
    getStor() {
        let that = this
        wx.getStorage({
            key: 'key',
            success(res) {
                var user = res.data
                console.log(user)
                that.setData({
                    user: user
                })
            },
            fail(err) {
                console.log(err)
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       
        this.getStor()
        this.powerQuery()
        console.log(app.globalData)
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
        if(!app.globalData.storage){
            this.setData({
                user:app.globalData.userInfo
            })
        }
        console.log(this.data.user)
        console.log(app.globalData)
        wx.setNavigationBarColor({
            backgroundColor: '#00BFFF',
            frontColor: '#ffffff',
            animation: {
                duration: 2000,
                timingFunc: 'easeInOut'
            }
        }),
            wx.setNavigationBarTitle({
                title: '什吗',
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