// pages/subroutine/history/history.js
import Dialog from "../../../miniprogram_npm/@vant/weapp/dialog/dialog"
Page({

    /**
     * 页面的初始数据
     */
    data: {
    },
    onClose(event) {
        var index = event.currentTarget.dataset.index
        var id = event.currentTarget.dataset.id
        var item = event.currentTarget.dataset.item
        // console.log(id)
        const { position, instance } = event.detail;
        switch (position) {
            case 'left':
            case 'cell':
                instance.close();
                break;
            case 'right':
                Dialog.confirm({
                    message: '确定删除吗？',
                }).then(() => {
                    wx.showLoading({
                        mask: true
                    })
                    this.deleteRecord(item, id, index)
                });
                break;
        }
    },
    deleteRecord(item, id, index) {
        if (item == '失物招领') {
            wx.cloud.callFunction({
                name: 'remove',
                data: {
                    id
                }, success: res => {
                    var _failLists = this.data._own
                    _failLists.splice(index, 1)
                    this.setData({
                        _own: _failLists
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
        } else if (item == '二手交易') {

        }
    },
    queryHistory() {
        wx.cloud.callFunction({
            name: 'queryHistory',
            success: res => {
                // console.log(res)
                var deal = res.result.deal.data
                var lostFound = res.result.lostFound.data
                var task = res.result.task.data
                var _deal = res.result._deal.data
                var _lostFound = res.result._lostFound.data
                var _task = res.result._task.data
                var own = deal.concat(lostFound, task)
                var _own = _deal.concat(_lostFound, _task)
                this.setData({
                    own: own,
                    _own: _own
                })
                // console.log(own)
                // console.log(_own)
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
        this.queryHistory()
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
            backgroundColor: '#C0C0C0',
            frontColor: '#ffffff',
            animation: {
                duration: 2000,
                timingFunc: 'easeInOut'
            }
        }),
            wx.setNavigationBarTitle({
                title: '全吗',
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
            own: [],
            _own: []
        })
        this.queryHistory()
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