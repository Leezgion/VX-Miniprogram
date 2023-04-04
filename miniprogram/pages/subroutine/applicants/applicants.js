// pages/subroutine/applicants/applicants.js
import Dialog from "../../../miniprogram_npm/@vant/weapp/dialog/dialog"
Page({

    /**
     * 页面的初始数据
     */
    data: {
    },
    applyPass(e) {
        var index = e.currentTarget.dataset.index
        var openid = e.currentTarget.dataset.id
        var user = e.currentTarget.dataset.user
        console.log(openid)
        wx.showModal({
            title: '是否通过',
            success: res => {
                // console.log(res)
                if (res.confirm) {
                    wx.cloud.callFunction({
                        name: 'applyPass',
                        data: {
                            openid: openid,
                            user: user
                        },
                        success: res => {
                            wx.showToast({
                                title: '已通过'
                            })
                            var _applicants = this.data.applicants
                            _applicants[index].passed = true
                            this.setData({
                                applicants: _applicants
                            })
                            console.log(_applicants)
                        }
                    })
                }
            }
        })
    },
    onClose(event) {
        var index = event.currentTarget.dataset.index
        var id = event.currentTarget.dataset.id
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
              instance.close();
              wx.showLoading({
                mask: true
              })
              wx.cloud.callFunction({
                name: 'removeApply',
                data: {
                  id
                },
                success: res => {
                  var _applicants = this.data.applicants
                  _applicants.splice(index, 1)
                  this.setData({
                    applicants: _applicants
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
            });
            break;
        }
      },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.cloud.callFunction({
            name: 'applyQuery',
            success: res => {
                // console.log(res)
                this.setData({
                    applicants: res.result.data
                })
            }
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
        wx.setNavigationBarColor({
            backgroundColor: '#000000',
            frontColor: '#ffffff',
            animation: {
                duration: 2000,
                timingFunc: 'easeInOut'
            }
        }),
            wx.setNavigationBarTitle({
                title: '哈哈',
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