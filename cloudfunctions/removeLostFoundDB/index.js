// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    var id = event.id
    var isDelete=event.isDelete
    if(isDelete){
        return await db.collection("lostFoundOfficialDB").doc(id).remove()
    }else{
        return await db.collection("lostFoundTempDB").doc(id).remove()
    }
}