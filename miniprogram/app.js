//app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      env: 'nane-development-3fczdhr2551eece',
      traceUser: true
    })
    //进入页面初始化 获取用户权限
    wx.getSetting({
      success: res => {
        //   console.log(res)
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: e => {
              this.globalData.userInfo = e.userInfo
            }
          })
          wx.getStorage({
            key: 'key',
            success:res=>{
                this.globalData.storage=res.data
            },
          })
        }
      }
    })
    this.globalData = {}
  }
})




// onLaunch: function () {
//   //调用API从本地缓存中获取数据
//   var logs = wx.getStorageSync('logs') || []
//   logs.unshift(Date.now())
//   wx.setStorageSync('logs', logs)
// },
// getUserInfo:function(cb){
//   var that = this;
//   if(this.globalData.userInfo){
//     typeof cb == "function" && cb(this.globalData.userInfo)
//   }else{
//     //调用登录接口
//     wx.login({
//       success: function () {
//         wx.getUserInfo({
//           success: function (res) {
//             that.globalData.userInfo = res.userInfo;
//             typeof cb == "function" && cb(that.globalData.userInfo)
//           }
//         })
//       }
//     });
//   }
// },
// globalData:{
//   userInfo:null
// }
 // onLaunch: function () {
  //   if (!wx.cloud) {
  //     console.error('请使用 2.2.3 或以上的基础库以使用云能力')
  //   } else {
  //     wx.cloud.init({
  //       // env 参数说明：
  //       //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
  //       //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
  //       //   如不填则使用默认环境（第一个创建的环境）
  //       // env: 'my-env-id',
  //       traceUser: true,
  //     })
  //   }

  //   this.globalData = {}
  // },
