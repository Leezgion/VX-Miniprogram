// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    var lostOfficialCount = await db.collection("lostFoundOfficialDB").count()
    var dealOfficialCount = await db.collection("dealOfficialDB").count()
    var taskOfficialCount = await db.collection("taskOfficialDB").count()
    lostOfficialCount=lostOfficialCount.total
    dealOfficialCount=dealOfficialCount.total
    taskOfficialCount=taskOfficialCount.total
    return{
        lostOfficialCount,
        dealOfficialCount,
        taskOfficialCount
    }
}