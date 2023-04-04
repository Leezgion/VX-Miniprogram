// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
   var approved = event.approved
   const openid = cloud.getWXContext().OPENID
   //如果已经通过审核
   if (approved) {
      var num = event.num
      var interval = event.interval
      var dealOfficialDB = await db.collection("dealOfficialDB").orderBy("uploadTime", "desc").skip(interval).limit(num).get()
      var data = dealOfficialDB.data
      if (data.length > 0) {
         for (var i = 0; i < data.length; i++) {
            if (openid == data[i].openid) {
               data[i].visible = true
            } else {
               data[i].visible = false
            }
         }
      }
      return dealOfficialDB
   } else {
      return await db.collection("dealTempDB").orderBy("uploadTime", "desc").get()
   }
}