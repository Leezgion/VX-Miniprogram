import Notify from "../../miniprogram_npm/@vant/weapp/notify/notify"
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    failLists: [],
    blogsId: []
  },
  onClose(event) {
    var index = event.currentTarget.dataset.index
    var id = event.currentTarget.dataset.id
    // console.log(id)
    const { position, instance } = event.detail;
    switch (position) {
      case 'left':
        wx.navigateTo({
          url: '../main/uploadPage/uploadPage',
        })
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
            name: 'removeReturnReason',
            data: {
              id
            },
            success: res => {
              var _failLists = this.data.failLists
              _failLists.splice(index, 1)
              this.setData({
                failLists: _failLists
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
  //获取未审核通过的信息。
  getReturnReason() {
    wx.cloud.callFunction({
      name: 'queryReturnReason',
      success: res => {
        // console.log(res.result.data)
        this.setData({
          failLists: res.result.data,
          isLoading: false
        })
        wx.stopPullDownRefresh({
          success: (res) => {
            wx.showToast({
                title: '刷新成功',
                icon:'none'
              })
          },
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getBlogComment() {

  },
  // getLikes() {
  //   wx.cloud.callFunction({
  //     name: 'getLikes',
  //     success: res => {
  //       // console.log(res.result.data)
  //       this.setData({
  //         blogs:res.result.data
  //       })
  //       for(var i=0;i<this.data.blogs.length;i++){
  //         var blogsId=this.data.blogs[i]._id
  //         this.setData({
  //           blogsId:this.data.blogsId.concat(blogsId)
  //         })
  //       }
  //       // console.log(this.data.blogsId)
  //       var blogsIds=this.data.blogsId
  //       wx.cloud.callFunction({
  //         name:'getLikes',
  //         data:{
  //           blogsIds:blogsIds
  //         },
  //         success:res=>{
  //           console.log(res)
  //         },
  //         fail:err=>{
  //           console.log(err)
  //         }
  //       })
  //     },
  //     fail: err => {
  //       console.log(err)
  //     }
  //   })
  //   },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getReturnReason()
    // this.getLikes()
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
      backgroundColor: '#00FFFF',
      frontColor: '#ffffff',
      animation: {
        duration: 2000,
        timingFunc: 'easeInOut'
      }
    }),
      wx.setNavigationBarTitle({
        title: '成吗',
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
      failLists: []
    })
    this.getReturnReason()
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