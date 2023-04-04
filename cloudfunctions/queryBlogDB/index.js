// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const openid = cloud.getWXContext().OPENID
    var mine = event.mine
    if (mine) {
        var myList=await db.collection("blogTempDB").where({
            openid: openid
        }).orderBy("uploadTime", "desc").get()
        var data=myList.data
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                //当前用户已点赞的blog数
                var count = await db.collection("like_DB").where({
                    openid: openid,
                    blogId: data[i]._id
                }).count()
                if (count.total) {
                    data[i].isLike = false
                } else {
                    data[i].isLike = true
                }
                //单个blog的总点赞数
                var counts = await db.collection("like_DB").where({
                    blogId: data[i]._id
                }).count()
                data[i].likes = counts.total
                //单个blog的总评论数
                var comments = await db.collection("comment_DB").where({
                    blogId: data[i]._id
                }).count()
                data[i].comments = comments.total
                //根据用户判定blog的关闭按钮是否显示
                if (openid == data[i].openid) {
                    data[i].visible = true
                } else {
                    data[i].visible = false
                }
            }
        }
        return data
    } else {
        var num =event.num
        var interval =event.interval
        var dataList = await db.collection("blogTempDB").orderBy("uploadTime", "desc").skip(interval).limit(num).get()
        var data = dataList.data
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                //当前用户已点赞的blog数
                var count = await db.collection("like_DB").where({
                    openid: openid,
                    blogId: data[i]._id
                }).count()
                if (count.total) {
                    data[i].isLike = false
                } else {
                    data[i].isLike = true
                }
                //单个blog的总点赞数
                var counts = await db.collection("like_DB").where({
                    blogId: data[i]._id
                }).count()
                data[i].likes = counts.total
                //单个blog的总评论数
                var comments = await db.collection("comment_DB").where({
                    blogId: data[i]._id
                }).count()
                data[i].comments = comments.total
                //根据用户判定blog的关闭按钮是否显示
                if (openid == data[i].openid) {
                    data[i].visible = true
                } else {
                    data[i].visible = false
                }
            }
        }
        return data
    }
}