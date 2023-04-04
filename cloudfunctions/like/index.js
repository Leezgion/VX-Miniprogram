// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const openid = cloud.getWXContext().OPENID
    var blogId = event.id
    var uploadTime = new Date().getTime()
    var count = await db.collection("like_DB").where({
        openid,
        blogId
    }).count()
    if (count.total) {
        return await db.collection("like_DB").where({
            openid,
            blogId
        }).remove()

    } else {
        return await db.collection("like_DB").add({
            data: {
                blogId,
                openid,
                uploadTime
            }
        })
    }

}