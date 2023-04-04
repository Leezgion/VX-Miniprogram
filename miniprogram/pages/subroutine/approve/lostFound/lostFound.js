// pages/subroutine/approve/lostFound/lostFound.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        show: false,
        lost_found: [],
        btn: true,//退回原因发送按钮
        reasonSection: false,//退回原因弹出层是否显示
        reason: "",//输入的退回原因内容
    },
    //审核信息展开
    onChange(event) {
        this.setData({
            //0,1,2...
            activeName: event.detail,
        });
    },
    //退回申请
    return(res) {
        var attribution = res.currentTarget.dataset.attribution//该条信息的归属模块
        var userId = res.currentTarget.dataset.id //该条信息发布人的openid
        var index = res.currentTarget.dataset.index
        var title = res.currentTarget.dataset.title//该条信息的物品类型
        // console.log(res.currentTarget.dataset)
        this.setData({
            reasonSection: true,
            attribution: attribution,
            userId: userId,
            title: title,
        });
        //上传审核结果
    },
    //监测输入表单内容
    input(res) {
        // console.log(res.detail)  文字内容
        if (res.detail) {
            this.setData({
                btn: false,
                reason: res.detail
            })
        } else {
            this.setData({
                btn: true,
            })
        }
    },
    //发送退回原因
    sendBack() {
        if (this.data.btn) {
            return;
        }
        wx.showLoading({
            mask: true
        })
        var reason = this.data.reason
        var user = app.globalData.userInfo
        var attribution = this.data.attribution
        var userId = this.data.userId
        var title = this.data.title
        wx.cloud.callFunction({
            name: 'uploadReturnReason',
            data: {
                reason: reason,
                attribution: attribution,
                user: user,
                userId: userId,
                title: title,
            },
            success: res => {
                console.log(res)
                wx.hideLoading()
                this.onClose()
                wx.showToast({
                    title: '发送原因成功',
                })
            },
            fail: err => {
                console.log(err)
            }
        })
    },
    //弹出层关闭
    onClose() {
        this.setData({ reasonSection: false });
    },
    //删除此条记录
    remove(e) {
        var id = e.currentTarget.dataset.id
        var index = e.currentTarget.dataset.index
        wx.showModal({
            title: '是否要删除本条消息',
            success: res => {
                if (res.confirm) {
                    wx.showLoading({
                        mask: true
                    })
                    wx.cloud.callFunction({
                        name: 'removeLostFoundDB',
                        data: {
                            id
                        },
                        success: res => {
                            var _lost_found = this.data.lost_found
                            _lost_found.splice(index, 1)
                            this.setData({
                                lost_found: _lost_found
                            })
                            wx.hideLoading({
                                success: res => {
                                    wx.showToast({
                                        title: '删除成功',
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })
    },
    //通过申请
    approved(e) {
        var item = this.data.lost_found[e.currentTarget.dataset.index]
        var index = e.currentTarget.dataset.index
        this.setData({
            id: e.currentTarget.dataset.id
        })
        wx.showModal({
            title: '确定通过审核吗',
            success: res => {
                // console.log(res)
                if (res.confirm) {
                    wx.cloud.callFunction({
                        name: "uploadLostFoundDB",
                        data: {
                            itemTitle: item.title,
                            itemDesc: item.descr,
                            itemType: item.itemType,
                            itemDate: item.date,
                            itemLoc: item.locale,
                            itemDB: item.itemDB,
                            contact: item.contact,
                            user: item.user,
                            openid: item.openid,
                            pass: true
                        },
                        success: res => {
                            console.log(res)
                            wx.showToast({
                                title: '审核通过',
                            })
                            var _fileList = this.data.lost_found
                            _fileList[index].btnColor = '#90EE90'
                            this.setData({
                                lost_found: _fileList,
                            })
                        }
                    })
                }
            }
        })
    },

    getLAF() {
        wx.cloud.callFunction({
            name: "queryLostFoundDB",
            data: {
                approved: false
            },
            success: res => {
                // console.log(res.result)
                this.setData({
                    lost_found: res.result.data
                })
                wx.stopPullDownRefresh({
                    success: (res) => {
                        wx.showToast({
                            title: '刷新成功',
                            icon: 'none'
                        })
                    },
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
        this.getLAF()
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
            backgroundColor: '#48D1CC',
            frontColor: '#ffffff',
            animation: {
                duration: 2000,
                timingFunc: 'easeInOut'
            }
        }),
            wx.setNavigationBarTitle({
                title: '过吗',
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
        this.setData({
            lost_found: []
        }),
            this.getLAF()
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