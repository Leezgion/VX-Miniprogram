// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db=cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const openid = cloud.getWXContext().OPENID
    var lostFound= await db.collection('lostFoundTempDB').where({
        openid:openid
    }).get()
    var deal= await db.collection('dealTempDB').where({
        openid:openid
    }).get()
    var task= await db.collection('taskTempDB').where({
        openid:openid
    }).get()
    var _lostFound= await db.collection('lostFoundOfficialDB').where({
        openid:openid
    }).get()
    var _deal= await db.collection('dealOfficialDB').where({
        openid:openid
    }).get()
    var _task= await db.collection('taskOfficialDB').where({
        openid:openid
    }).get()

    return {lostFound,deal,task,_lostFound,_deal,_task}
}