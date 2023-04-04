// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const openid = cloud.getWXContext().OPENID
    var user = event.user
    var event = event
    event.openid = openid
    var uploadTime = new Date().getTime()
    return await db.collection("applyDB").add({
        data: {
            user: user,
            openid: openid,
            uploadTime:uploadTime
        }
    })
}