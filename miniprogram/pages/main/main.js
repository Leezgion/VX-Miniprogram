// pages/main/main/main.js

Page({

    /**
     * 页面的初始数据
     */
    data: {
        pages: [
            {
                text: '失物招领',
                icon: 'newspaper-o',
                url: 'lost-found/lost-found'
            },
            {
                text: '二手交易',
                icon: 'shopping-cart-o',
                url: 'secondHandDeal/secondHandDeal'
            },
            {
                text: '跑腿任务',
                icon: 'notes-o',
                url: 'substitute/substitute'
            },
            {
                text: '社区交流',
                icon: 'friends-o',
                url: 'informationExchange/communication/communication'
            },
        ],
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        week: new Date().getDay(),
        today: new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate(),
        index: 0,
        word_index: 0,
        words: [],

    },
    //触屏开始
    touchstart(e) {
        var starX = e.touches[0].pageX
        this.setData({
            starX: starX
        })
    },
    //触屏
    touchmove(e) {
        var movedX = e.touches[0].pageX
        this.setData({
            movedX: movedX
        })
    },
    //触屏结束
    touchend(e) {
        var index = this.data.index
        var length = this.data.sentences.length
        if (this.data.starX < this.data.movedX - 40) {
            console.log('右滑')
            setTimeout(() => {
                this.setData({
                    index: index - 1
                })
                if (index - 1 < 0) {
                    this.setData({
                        index: 0
                    })
                    wx.showToast({
                        title: '已经是最新一条哦~',
                        icon: 'none'
                    })
                }
            }, 500)

        } else if (this.data.starX > this.data.movedX + 40) {
            console.log('左滑')
            setTimeout(() => {
                this.setData({
                    index: index + 1
                })
                if (index + 1 >= length) {
                    this.setData({
                        index: 0
                    })
                }
            }, 500)
        }
    },
    //词语触屏开始
    wordtouchstart(e) {
        var word_starX = e.touches[0].pageX
        this.setData({
            word_starX: word_starX
        })
        // console.log(word_starX)
    },
    //词语触屏
    wordtouchmove(e) {
        var word_movedX = e.touches[0].pageX
        this.setData({
            word_movedX: word_movedX
        })
        // console.log(word_movedX)
    },
    //词语触屏结束
    wordtouchend(e) {
        var word_index = this.data.word_index
        var length = this.data.wordsList.length
        if (this.data.word_starX < this.data.word_movedX - 40) {
            console.log('右滑')
            setTimeout(() => {
                this.setData({
                    word_index: word_index - 1
                })
                if (word_index - 1 < 0) {
                    this.setData({
                        word_index: 0
                    })
                    wx.showToast({
                        title: '已经是最新一条哦~',
                        icon: 'none'
                    })
                }
            },)

        } else if (this.data.word_starX > this.data.word_movedX + 40) {
            console.log('左滑')
            setTimeout(() => {
                this.setData({
                    word_index: word_index + 1
                })
                if (word_index + 1 >= length) {
                    this.setData({
                        word_index: 0
                    })
                }
            }, 500)
        }
    },
    //获取每日照片
    getDailyImg() {
        wx.cloud.callFunction({
            name: 'queryDailyImg',
            success: res => {
                this.setData({
                    imgList: res.result.data
                })
                this.setData({
                    img_index: Math.floor(Math.random() * this.data.imgList.length)
                })
                wx.stopPullDownRefresh({
                  success: (res) => {
                    wx.showToast({
                        title: '刷新成功',
                        icon:'none'
                      })
                  },
                })
                // console.log(this.data.imgList)
            }
        })
    },
    clickImg(res) {
        var dataArray = [];
        for (var i = 0; i < this.data.imgList.length;i++){
            dataArray[i] = this.data.imgList[i].url;
          }
        wx.previewImage({
            urls:dataArray,
            current: res.currentTarget.dataset.current,
            success:res=>{
                console.log(res)
            },
            fail:err=>{
                console.log(err)
            }
        })
        
    },
    //获取每日一句
    getDailySentence() {
        wx.cloud.callFunction({
            name: 'queryDailySentence',
            success: res => {
                // console.log(res.result.data)
                this.setData({
                    sentences: res.result.data
                })
            }
        })
    },
    //获取每日词语
    getDailyWords() {
        wx.cloud.callFunction({
            name: 'queryDailyWords',
            success: res => {
                // console.log(res.result.data)
                this.setData({
                    wordsList: res.result.data
                })
                // var sepll = this.data.wordsList[0].spell
                // var words = this.data.wordsList[0].words
                // for (var i = 0; i < words.length; i++) {
                //     var subWord = words.substr(i, 1)
                //     // var final= subWord.concat(subWord)
                //     this.setData({
                //         words: this.data.words.concat(subWord)
                //     })
                // }
                // var spells = sepll.split('.')
                // this.setData({
                //     spells: spells
                // })
                // var spells=sepll.replace(/\./g,'')
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getDailyImg()
        this.getDailySentence()
        this.getDailyWords()

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
        this.getDailyImg()
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
