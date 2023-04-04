// pages/main/informationExchange/informationExchange.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mainActiveIndex: 0,
        activeId: '',
        activeText: '',
        activeUrl: '',
        items: [{
            text: '数学',
            children: [
                {
                    text: '离散数学',
                    id: '1',
                    url: ''
                },
                {
                    text: '线性代数',
                    id: '2',
                    url: ''
                },
                {
                    text: '微积分',
                    id: '3',
                    url: ''
                },
            ],
        },
        {
            text: '英语',
            children: [
                {
                    text: '英语四到六级',
                    id: '1',
                    url: ''
                },
                {
                    text: '英语七级',
                    id: '2',
                    url: ''
                },
                {
                    text: '英语八级',
                    id: '3',
                    url: ''
                },
                {
                    text: '英语九级',
                    id: '4',
                    url: ''
                },
                {
                    text: '雅思',
                    id: '5',
                    url: ''
                },
                {
                    text: '托福',
                    id: '6',
                    url: ''
                },
            ],
        },
        {
            text: '文学',
            children: [
                {
                    text: '东方文学',
                    id: '1',
                    url: '',
                },
                {
                    text: '西方文学',
                    id: '2',
                    url: '',
                },
                {
                    text: '近代文学',
                    id: '3',
                    url: '',
                },
                {
                    text: '中国文学',
                    id: '4',
                    url: '',
                },
            ]
        },
        {
            text: '历史',
            children: [
                {
                    text: '东方历史',
                    id: '1',
                    url: '',
                },
                {
                    text: '西方历史',
                    id: '2',
                    url: '',
                },
                {
                    text: '近代历史',
                    id: '3',
                    url: '',
                },
                {
                    text: '中国历史',
                    id: '4',
                    url: '',
                },
            ]
        }
        ]
    },

    onClickNav({ detail = {} }) {
        this.setData({
            mainActiveIndex: detail.index || 0,
        });
    },

    onClickItem({ detail = {} }) {
        const activeId = this.data.activeId === detail.id ? null : detail.id;
        const activeText = this.data.activeText === detail.text ? '' : detail.text;
        const activeUrl = 'communication/communication';
        this.setData({ activeId, activeText, activeUrl });
        wx.navigateTo({
            url: `${activeUrl}`,
        })
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
            backgroundColor: '#AFEEEE',
            frontColor: '#ffffff',
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