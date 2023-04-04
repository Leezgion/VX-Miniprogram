// pages/main/informationExchange/communication/uploadBlog/uploadBlog.js
import common from "../../../../../commonJS/common.js"
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        btn: true,
        locName: '',
        fileList: [],
        index: 0
    },
    //提交表单
    onSubmit(res) {
        wx.showLoading({
            title: '正在发布中...',
            mask:true
        })
        var content = res.detail.value.content
        var loc = this.data.locName
        var model = wx.getSystemInfoSync().model
        var user = app.globalData.userInfo
        var data = {
            content,
            loc,
            model,
            user
        }
        var { fileList } = this.data
        var date = new Date()
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        month = month < 10 ? "0" + month : month + ""
        day = day < 10 ? "0" + day : day + ""
        var nowDate = year + month + day
        if (fileList.length > 0) {
            var uploadList = fileList.map((item, index) => {
                return this.uploadFilePromise("blogImg/" + nowDate + "/" + common.chaos() + common.getSuffix(item.url), item)
            })
            Promise.all(uploadList).then(res => {
                // console.log(res)
                var imgList = res.map(item => {
                    return item.fileID
                })
                data.imgUrl = imgList
                this.uploadCloudDB(data)
            })
            return;
        }
        this.uploadCloudDB(data)
    },
    //把图片上传至云存储
    uploadFilePromise(fileName, chooseResult) {
        return wx.cloud.uploadFile({
            cloudPath: fileName,
            filePath: chooseResult.url
        })
    },
    //调用云函数上传数据库
    uploadCloudDB(data) {
        wx.cloud.callFunction({
            name: "uploadBlogDB",
            data: data,
            success: res => {
                console.log(res)
                wx.hideLoading({
                    success: (res) => {
                        wx.showToast({
                            title: '发布成功~',
                            duration: 1000
                        })
                        setTimeout(() => {
                            var pages=getCurrentPages()
                            var index=pages.length
                            var blog=pages[index-2]
                            // console.log(blog)
                            blog.setData({
                                fileList:[]
                            })
                            blog.getBlog()
                            wx.navigateBack()
                        }, 1000)
                    },
                })
            }
        })
    },
    //输入框检测内容变化
    onChange(e) {
        var val = e.detail.value
        if (val.length > 0) {
            this.setData({
                btn: false
            })
        } else {
            this.setData({
                btn: true
            })
        }
    },
    //获取地理位置
    getLoc() {
        //获取用户已授权的信息
        wx.getSetting({
            success: res => {
                // console.log(res)
                if (res.authSetting['scope.userLocation']) {
                    this.openMap()
                } else {
                    //提示用户进行位置授权
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success: res => {
                            this.openMap()
                            // console.log(res)
                        },
                        fail: err => {
                            var loc = wx.getStorageSync('loc')
                            if (loc) {
                                //若用户不同意授权后可再次授权
                                this.getAgain()
                            }
                            wx.setStorageSync('loc', true)
                        }
                    })
                }
            }
        })

    },
    //调用地图API
    openMap() {
        wx.chooseLocation({
            success: res => {
                // console.log(res)
                this.setData({
                    locName: res.name
                })
            }
        })
    },
    //再次提示获取权限
    getAgain() {
        wx.getSetting({
            success: res => {
                if (!res.authSetting['scope.userLocation']) {
                    wx.showModal({
                        title: '是否获取你的地理位置信息',
                        content: '再次同意授权才可以获取地理位置信息',
                        success: res => {
                            if (res.confirm) {
                                wx.openSetting({
                                    success: res => {
                                        // console.log(res)
                                        if (res.authSetting['scope.userLocation']) {
                                            wx.showToast({
                                                title: '授权成功',
                                                icon: 'success'
                                            })
                                            setTimeout(() => {
                                                this.openMap()
                                            }, 1000)
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })
    },
    //处理上传后的图片
    afterReadImg(res) {
        // console.log(res)
        var oldList = this.data.fileList
        var newList = oldList.concat(res.detail.file)
        this.setData({
            fileList: newList
        })
    },
    //删除上传后的某张图片
    deleteImg(res) {
        var index = res.detail.index
        this.data.fileList.splice(index, 1)
        this.setData({
            fileList: this.data.fileList
        })
        console.log(res.detail.index)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(options)
        this.setData({
            index: options.index
        })
        // wx.getSystemInfo({
        //     //获取手机型号
        //     success: res => {
        //         console.log(res.model)
        //     },
        // })
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