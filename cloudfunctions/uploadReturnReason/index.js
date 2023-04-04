// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const openid = cloud.getWXContext().OPENID
    var reason = event.reason
    var attribution = event.attribution
    var user = event.user
    var userId = event.userId
    var title = event.title
    return await db.collection('returnReasonDB').add({
        data: {
            openid:openid,
            reason: reason,
            attribution: attribution,
            user: user,
            userId: userId,
            title: title,
        }
    })
}