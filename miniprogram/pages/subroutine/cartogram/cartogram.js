// pages/subroutine/cartogram/cartogram.js
var wxCharts = require('./chart/wxcharts.js');
Page({


    /**
     * 页面的初始数据
     */
    data: {
        deviceWidth: '',
        losts: '',
        deals: '',
        tasks: '',
        blogs: '',
        pie: [
            { 'name': '失物招领', 'num': 2000 },
            { 'name': '二手交易', 'num': 1000 },
            { 'name': '跑腿任务', 'num': 500 },
            { 'name': '社区交流', 'num': 5000 },
        ],
        line: [
            { 'name': '失物招领', 'num': 2000 },
            { 'name': '二手交易', 'num': 1000 },
            { 'name': '跑腿任务', 'num': 500 },
            { 'name': '社区交流', 'num': 5000 },
        ]
    },
    //获取用户设备宽度
    getDeviceWidth() {
        var deviceWidth = wx.getSystemInfoSync().screenWidth
        this.setData({
            deviceWidth: deviceWidth
        })
    },
    //饼状图展示各个模块发布的数量
    getPie() {
        new wxCharts({
            canvasId: 'pie',
            type: 'pie',
            series: [
                { name: "失物招领", data: this.data.lostOfficialCount },
                { name: "二手交易", data: this.data.dealOfficialCount },
                { name: "跑腿任务", data: this.data.taskOfficialCount },
                { name: "社区消息", data: this.data.blogs }],
            width: `${this.data.deviceWidth}`,
            height: 400,
            dataLabel: true,
            dataPointShape: true,
        });
    },
    //柱状图展示各个模块审核通过数
    getColumn() {
        var losts = this.data.losts
        var deals = this.data.deals
        var tasks = this.data.tasks
        var blogs = this.data.blogs
        var lostOfficialCount = this.data.lostOfficialCount
        var dealOfficialCount = this.data.dealOfficialCount
        var taskOfficialCount = this.data.taskOfficialCount
        new wxCharts({
            canvasId: 'histogram',
            dataPointShape: false,
            type: 'column',
            categories: ['失物招领', '二手交易', '跑腿任务',],
            series: [
                // {
                //     name: '未审核数',
                //     data: [
                //         losts - lostOfficialCount,
                //         deals - dealOfficialCount,
                //         tasks - taskOfficialCount,
                //         0,
                //     ],
                //     color: "rgba(0,0,0,0.3)"//支持rgba，但不支持渐变色
                // },
                {
                    name: '已审核信息',
                    data: [
                        lostOfficialCount,
                        dealOfficialCount,
                        taskOfficialCount,
                    ]
                }, {
                    name: '待审核信息',
                    data: [
                        losts,
                        deals,
                        tasks,
                    ]
                }
            ],
            yAxis: {
                min: 0,
                title: '信息数(条)',
                format: function (val) {
                    return val;
                }
            },
            xAxis: {
                disableGrid: true,
            },
            width: `${this.data.deviceWidth}`,
            height: 400,
            dataLabel: true,
            extra: {
                column: {
                    width: 40 //柱的宽度
                }
            }
        });
    },
    onLoad: function (options) {
        this.getDeviceWidth()
        wx.cloud.callFunction({
            name: 'dataCount',
            success: res => {
                // console.log(res)
                var losts = res.result.losts
                var deals = res.result.deals
                var tasks = res.result.tasks
                var blogs = res.result.blogs
                var lostOfficialCount = res.result.lostOfficialCount
                var dealOfficialCount = res.result.dealOfficialCount
                var taskOfficialCount = res.result.taskOfficialCount
                this.setData({
                    losts: losts,
                    deals: deals,
                    tasks: tasks,
                    blogs: blogs,
                    lostOfficialCount: lostOfficialCount,
                    dealOfficialCount: dealOfficialCount,
                    taskOfficialCount: taskOfficialCount,
                })
                this.getPie()
                this.getColumn()
            }
        })
    },
    onReady: function () {
        
    },
    onShow: function () {
        wx.setNavigationBarColor({
            backgroundColor: '#FFD700',
            frontColor: '#ffffff',
            animation: {
                duration: 2000,
                timingFunc: 'easeInOut'
            }
        }),
            wx.setNavigationBarTitle({
                title: '统计图',
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