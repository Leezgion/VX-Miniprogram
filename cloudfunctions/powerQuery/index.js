// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const openid = cloud.getWXContext().OPENID
    var data= await db.collection("Admin").where({
        owner: openid
    }).get()
    if(data.data.length>0){
        return data.data
    }else{
        return false
    }
}