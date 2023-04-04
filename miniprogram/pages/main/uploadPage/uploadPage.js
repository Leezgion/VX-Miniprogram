// pages/main/uploadPage/uploadPage.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        options: [
            { text: '失物招领', value: 0 },
            { text: '二手交易', value: 1 },
            { text: '跑腿任务', value: 2 },
            { text: '选择想发布的模块', value: 3 },
        ],
        value: 3,
        btn: true
    },
    select(e) {
        // console.log(e)
        this.setData({
            item: this.data.options[e.detail].text
        })
    },
    //物品简介
    descChange(e) {
        this.setData({
            itemDesc: e.detail
        })
    },
    //物品类型
    typeChange(e) {
        this.setData({
            itemType: e.detail
        })
    },
    //时间
    dateChange(e) {
        this.setData({
            itemDate: e.detail
        })
    },
    //地点
    locChange(e) {
        this.setData({
            itemLoc: e.detail
        })
    },
    //物品名称
    titleChange(e) {
        this.setData({
            itemTitle: e.detail
        })
    },
    //崭新程度
    wChange(e) {
        this.setData({
            wornItem: e.detail
        })
    },
    //物品价格
    priceChange(e) {
        this.setData({
            itemPrice: e.detail
        })
    },
    //物品价格
    numChange(e) {
        this.setData({
            itemNum: e.detail
        })
    },
    //物品价格
    vxChange(e) {
        var val = e.detail
        if (val.length > 0) {
            this.setData({
                btn: false
            })
        } else {
            this.setData({
                btn: true
            })
        }
        this.setData({
            contact: e.detail
        })
    },



    publish(e) {
        if(this.data.item==='选择想发布的模块'){
            wx.showToast({
              title: '请选择模块',
              icon:'error'
            })
            return
        }
        wx.showLoading({
            title: '正在发布中...',
            mask: true
        })
        var user = app.globalData.userInfo
        if (this.data.item == '失物招领') {
            wx.cloud.callFunction({
                name: "uploadLostFoundDB",
                data: {
                    itemTitle: this.data.itemTitle,
                    itemDesc: this.data.itemDesc,
                    itemType: this.data.itemType,
                    itemDate: this.data.itemDate,
                    itemLoc: this.data.itemLoc,
                    contact: this.data.contact,
                    itemDB: "失物招领",
                    user: user,
                    pass: false
                }
            }).then(res => {
                this.overBack()
            })
        } else if (this.data.item == '二手交易') {
            wx.cloud.callFunction({
                name: "uploadDealDB",
                data: {
                    itemTitle: this.data.itemTitle,
                    itemDesc: this.data.itemDesc,
                    wornItem: this.data.wornItem,
                    itemType: this.data.itemType,
                    itemPrice: this.data.itemPrice,
                    itemNum: this.data.itemNum,
                    contact: this.data.contact,
                    itemDB: "二手交易",
                    user: user,
                    pass: false
                }
            }).then(res => {
                this.overBack()
            })
        } else if (this.data.item == "跑腿任务") {
            wx.cloud.callFunction({
                name: "uploadTaskDB",
                data: {
                    itemTitle: this.data.itemTitle,
                    itemType: this.data.itemType,
                    itemDate: this.data.itemDate,
                    itemLoc: this.data.itemLoc,
                    itemPrice: this.data.itemPrice,
                    itemDesc: this.data.itemDesc,
                    contact: this.data.contact,
                    itemDB: "跑腿任务",
                    user: user,
                    pass: false
                }
            }).then(res => {
                this.overBack()
            })
        }
    },
    //提示发布成功返回上一页
    overBack() {
        wx.hideLoading({
            success: (res) => {
                wx.showToast({
                    title: '发布成功~',
                    duration: 1000
                }),
                    setTimeout(() => {
                        wx.navigateBack()
                    }, 1000)
            },
        })
    },
    uploadToCloud() {
        wx.cloud.init();
        const { fileList } = this.data;
        if (!fileList.length) {
            wx.showToast({ title: '请选择图片', icon: 'none' });
        } else {
            const uploadTasks = fileList.map((file, index) => this.uploadFilePromise(`my-photo${index}.png`, file));
            Promise.all(uploadTasks)
                .then(data => {
                    wx.showToast({ title: '上传成功', icon: 'none' });
                    const newFileList = data.map(item => ({ url: item.fileID }));
                    this.setData({ cloudPath: data, fileList: newFileList });
                })
                .catch(e => {
                    wx.showToast({ title: '上传失败', icon: 'none' });
                    console.log(e);
                });
        }
    },

    uploadFilePromise(fileName, chooseResult) {
        return wx.cloud.uploadFile({
            cloudPath: fileName,
            filePath: chooseResult.url
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
            backgroundColor: '#4bb0ff',
            frontColor: '#ffffff',
            animation: {
                duration: 2000,
                timingFunc: 'easeInOut'
            }
        }),
            wx.setNavigationBarTitle({
                title: '发吗',
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