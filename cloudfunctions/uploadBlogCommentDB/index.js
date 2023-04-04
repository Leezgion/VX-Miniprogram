// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const openid = cloud.getWXContext().OPENID
    var data = event
    data.openid = openid
    var uploadTime = new Date().getTime()
    data.uploadTime = uploadTime

    return await db.collection("comment_DB").add({
        data:data
    })
}