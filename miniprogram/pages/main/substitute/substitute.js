// pages/main/substitute/substitute.js
import Dialog from "../../../miniprogram_npm/@vant/weapp/dialog/dialog"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    option1: [
      { text: '全部类型', value: 0 },
      { text: '代领文件', value: 1 },
      { text: '代领外卖', value: 2 },
      { text: '代领快递', value: 3 },
    ],
    value: 0,
    time: 24 * 60 * 60 * 1000,
    timeData: {},
    isLoading: true,
    fileList: []
  },
  //复制联系方式至剪贴板
  setClipboardData(res) {
    var contact = res.currentTarget.dataset.contact
    console.log(res)
    wx.setClipboardData({
      data: contact,
      success(res) {
        // console.log(res)
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
  //显示详情介绍弹窗
  viewDetails: function (e) {
    var detail = this.data.fileList[e.currentTarget.dataset.index].descr
    Dialog.alert({
      message: `${detail}`,
    }).then(() => {
      // on close
    });
  },
  delete(e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    wx.showModal({
      title: '是否要删除你发布的任务',
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            mask: true
          })
          wx.cloud.callFunction({
            name: 'removeTaskDB',
            data: {
              id: id,
              isDelete: true
            },
            success: res => {
              var _fileList = this.data.fileList
              _fileList.splice(index, 1)
              this.setData({
                fileList: _fileList
              })
              wx.hideLoading()
            }
          })
        }
      }
    })
  },
  //发布按钮跳转页面
  redirect() {
    wx.navigateTo({
      url: '../uploadPage/uploadPage',
    })
  },
  getTask(interval = 0, num = 5) {
    wx.cloud.callFunction({
      name: "queryTaskDB",
      data: {
        approved: true,
        interval: interval,
        num: num,
      },
      success: res => {
        // console.log(res.result.data)
        if (res.result.data.length < 5) {
          this.setData({
            isLoading: false
          })
        }
        if (res.result.data.length == 0) {
          this.setData({
            isLoading: false
          })
        }
        var newFileList = [...this.data.fileList, ...res.result.data]
        this.setData({
          fileList: newFileList,
          // dropMenu: list
        })
        wx.stopPullDownRefresh({
          success: (res) => {
            wx.showToast({
                title: '刷新成功',
                icon:'none'
              })
          },
        })
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
      backgroundColor: '#F5DEB3',
      frontColor: '#ffffff',
      animation: {
        duration: 2000,
        timingFunc: 'easeInOut'
      }
    }),
      wx.setNavigationBarTitle({
        title: '行吗',
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
      fileList: []
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