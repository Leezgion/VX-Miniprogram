// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    var openid = event.openid
    var user=event.user
    var uploadTime = new Date().getTime()
    return await db.collection("Admin").add({
        data: {
            owner: openid,
            level: 1,
            power:true,
            user:user,
            uploadTime:uploadTime
        }
    })
}