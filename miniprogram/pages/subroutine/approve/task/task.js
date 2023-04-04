const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        show: false,
        fileList: []
    },
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
                        name: 'removeTaskDB',
                        data: {
                            id
                        },
                        success: res => {
                            var _fileList = this.data.fileList
                            _fileList.splice(index, 1)
                            this.setData({
                                fileList: _fileList
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
        var item = this.data.fileList[e.currentTarget.dataset.index]
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
                        name: "uploadTaskDB",
                        data: {
                            itemTitle: item.title,
                            itemDB: item.itemDB,
                            itemDesc: item.descr,
                            itemPrice: item.price,
                            itemType: item.type,
                            itemLoc: item.destn,
                            itemDate: item.deadline,
                            contact: item.contact,
                            user: item.user,
                            openid: item.openid,
                            pass: true
                        },
                        success: res => {
                            wx.showToast({
                                title: '审核通过',
                            })
                            var _fileList = this.data.fileList
                            _fileList[index].btnColor = '#90EE90'
                            this.setData({
                                fileList: _fileList,
                            })
                        }
                    })
                }
            }
        })
    },
    getTask() {
        wx.cloud.callFunction({
            name: "queryTaskDB",
            data: {
                approved: false
            },
            success: res => {
                // console.log(res.result.data)
                this.setData({
                    fileList: res.result.data
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
            fail:err=>{
                console.log(err)
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getTask()
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
            fileList:[]
        })
        this.getTask()
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