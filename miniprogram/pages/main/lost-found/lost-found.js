// pages/main/lost-found/lost-found.js
import Dialog from "../../../miniprogram_npm/@vant/weapp/dialog/dialog"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    option1: [
      { text: '全部物品', value: 0 },
      { text: '书籍', value: 1 },
      { text: '数码设备', value: 2 },
    ],
    value: 0,
    isLoading: true,
    fileList: [],//页面渲染的数组
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
  delete(e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    wx.showModal({
      title: '是否要删除你发布的消息',
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            mask: true
          })
          wx.cloud.callFunction({
            name: 'removeLostFoundDB',
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
  //显示详情介绍弹窗
  viewDetails: function (e) {
    var detail = this.data.fileList[e.currentTarget.dataset.index].descr
    Dialog.alert({
      message: `${detail}`,
    }).then(() => {
      // on close
    });
  },
  //发布按钮跳转页面
  redirect() {
    wx.navigateTo({
      url: '../uploadPage/uploadPage',
    })
  },
  //获取正式数据库信息
  getLostFound(interval = 0, num = 5) {
    wx.cloud.callFunction({
      name: "queryLostFoundDB",
      data: {
        approved: true,
        interval: interval,
        num: num,
      },
      success: res => {
        // console.log(res.result.data)
        // console.log(res.result.types.data)
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
    this.getLostFound()
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
      backgroundColor: '#90EE90',
      frontColor: '#ffffff',
      animation: {
        duration: 2000,
        timingFunc: 'easeInOut'
      }
    }),
      wx.setNavigationBarTitle({
        title: '这呢',
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
      fileList:[],
    })
    this.getLostFound()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var length = this.data.fileList.length
    this.getLostFound(length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})