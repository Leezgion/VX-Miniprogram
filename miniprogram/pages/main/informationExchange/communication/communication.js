// pages/main/informationExchange/communication/communication.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        deviceWidth: "",//当前设备宽度
        fileList: [],//页面渲染的数组
        commentSection: false,
        comment: "",
        btn: true,
        commentList: "",
        commentLoading: false,
        isLoading: true,
        mine:false
    },
    //获取用户设备宽度
    getDeviceWidth() {
        var deviceWidth = wx.getSystemInfoSync().screenWidth
        this.setData({
            deviceWidth: deviceWidth
        })
    },
    //查看当前用户blog
    screening() {
        wx.showLoading()
        var mine = true
        wx.cloud.callFunction({
            name: "queryBlogDB",
            data: {
                mine
            },
            success: res => {
                this.setData({
                    fileList: res.result,
                    mine:true,
                    isLoading:false
                })
                wx.hideLoading()
            },
            fail: err => {
                console.log(err)
            }
        })
    },
    //获取全部blog
    getAll() {
        this.setData({
            fileList:[],
            mine:false,
            isLoading:true
        })
        this.getBlog()
    },
    //发布按钮跳转页面
    redirect() {
        if (app.globalData.userInfo) {
            wx.showActionSheet({
                itemList: ["文字", "图片"],
                success: res => {
                    //   console.log(res.tapIndex)
                    wx.navigateTo({
                        url: './uploadBlog/uploadBlog?index=' + res.tapIndex,
                    })
                }
            })
        }
    },
    //获取数据库中的blog信息
    getBlog(interval = 0, num = 5) {
        wx.cloud.callFunction({
            name: "queryBlogDB",
            data: {
                interval: interval,
                num: num,
            },
            success: res => {
                // console.log(res)
                if (res.result.length == 0) {
                    this.setData({
                        isLoading: false
                    })
                }
                var newFileList = [...this.data.fileList, ...res.result]
                this.setData({
                    fileList: newFileList
                })
            }
        })
    },
    //点击图片查看详略图
    clickImg(res) {
        wx.previewImage({
            urls: res.currentTarget.dataset.urls,
            current: res.currentTarget.dataset.current,
            success:res=>{
                console.log(res)
            },
            fail:err=>{
                console.log(err)
            }
        })
    },
    //点赞
    like(res) {
        wx.showLoading({
            mask: true
        })
        //数据绑定wxml获取id
        var id = res.currentTarget.dataset.id
        var index = res.currentTarget.dataset.index
        wx.cloud.callFunction({
            name: 'like',
            data: {
                id: id
            },
            success: res => {
                // console.log(res)
                var _fileList = this.data.fileList
                _fileList[index].isLike = !_fileList[index].isLike
                var isLike = this.data.fileList[index].isLike
                var likes = this.data.fileList[index].likes
                if (isLike) {
                    likes--
                    _fileList[index].likes = likes
                } else {
                    likes++
                    _fileList[index].likes = likes
                }
                this.setData({
                    fileList: _fileList
                })
                wx.hideLoading()
            }
        })
    },
    //打开评论
    discuss(res) {
        var id = res ? res.currentTarget.dataset.id : this.data.blogId
        var index = res ? res.currentTarget.dataset.index : this.data.index
        this.setData({
            commentSection: true,
            blogId: id,
            index: index,
            commentList: "",
            commentLoading: false
        })
        //获取数据库评论信息
        wx.cloud.callFunction({
            name: 'queryBlogCommentDB',
            data: {
                blogId: id
            },
            success: res => {
                this.setData({
                    commentList: res.result.data,
                    commentLoading: true
                })
            }
        })
    },
    //监听输入内容
    input(res) {
        // console.log(res.detail)
        if (res.detail) {
            this.setData({
                btn: false,
                comment: res.detail
            })
        } else {
            this.setData({
                btn: true,
            })
        }
    },
    //失去焦点后触发事件
    // blur(res) {
    //     this.setData({
    //         comment: res.detail.value
    //     })
    // },
    //发表评论
    uploadComment() {
        if (this.data.btn) {
            return;
        }
        wx.showLoading({
            mask: true
        })
        var comment = this.data.comment
        var user = app.globalData.userInfo
        var blogId = this.data.blogId
        wx.cloud.callFunction({
            name: 'uploadBlogCommentDB',
            data: {
                comment,
                user,
                blogId
            },
            success: res => {
                var _fileList = this.data.fileList
                var index = this.data.index
                var comments = _fileList[index].comments
                comments++
                _fileList[index].comments = comments
                this.setData({
                    comment: "",
                    fileList: _fileList,
                    btn: true
                })
                this.discuss()
                wx.hideLoading()
            }
        })
    },
    //关闭评论
    onClose() {
        this.setData({
            commentSection: false
        })
    },
    //当前用户发布的博客才可本人删除
    deleteBlog(e) {
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
                        name: 'removeBlogDB',
                        data: {
                            id
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getDeviceWidth()
        this.getBlog()
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
            backgroundColor: '#7B68EE',
            frontColor: '#ffffff',
            animation: {
                duration: 2000,
                timingFunc: 'easeInOut'
            }
        }),
            wx.setNavigationBarTitle({/*  */
                title: '社区交流',
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
        this.getBlog()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if(!this.data.mine){
            var length = this.data.fileList.length
            this.getBlog(length)
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})