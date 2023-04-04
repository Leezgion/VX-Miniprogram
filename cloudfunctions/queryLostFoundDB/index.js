// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
   const openid = cloud.getWXContext().OPENID
   var approved = event.approved
   var lostFoundTempDB = await db.collection("lostFoundTempDB").orderBy("uploadTime", "desc").get()
   //如果已经通过审核
   if (approved) {
      var num = event.num
      var interval = event.interval
      var lostFoundOfficialDB = await db.collection("lostFoundOfficialDB").orderBy("uploadTime", "desc").skip(interval).limit(num).get()
      var data = lostFoundOfficialDB.data
      if (data.length > 0) {
         for (var i = 0; i < data.length; i++) {
            if (openid == data[i].openid) {
               data[i].visible = true
            } else {
               data[i].visible = false
            }
         }
      }
      return lostFoundOfficialDB
   } else {
      return lostFoundTempDB
   }
}