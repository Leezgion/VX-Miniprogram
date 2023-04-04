// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    var lostTempCount = await db.collection("lostFoundTempDB").count()
    var dealTempCount = await db.collection("dealTempDB").count()
    var taskTempCount = await db.collection("taskTempDB").count()
    var blogCount = await db.collection("blogTempDB").count()
    losts = lostTempCount.total
    deals = dealTempCount.total
    tasks = taskTempCount.total
    blogs = blogCount.total
    var lostOfficialCount = await db.collection("lostFoundOfficialDB").count()
    var dealOfficialCount = await db.collection("dealOfficialDB").count()
    var taskOfficialCount = await db.collection("taskOfficialDB").count()
    lostOfficialCount=lostOfficialCount.total
    dealOfficialCount=dealOfficialCount.total
    taskOfficialCount=taskOfficialCount.total
    return {
        losts,
        deals, 
        tasks, 
        blogs,
        lostOfficialCount,
        dealOfficialCount,
        taskOfficialCount
    }
}