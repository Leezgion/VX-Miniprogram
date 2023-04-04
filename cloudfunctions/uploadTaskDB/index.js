// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const openid = cloud.getWXContext().OPENID
    var item = event
    var uploadTime = new Date().getTime()
    item.uploadTime = uploadTime
    var itemType = event.itemType
    var itemDate = event.itemDate
    var itemLoc = event.itemLoc
    var itemPrice = event.itemPrice
    var itemDesc = event.itemDesc
    var itemDB = event.itemDB
    var contact = event.contact
    var itemTitle = event.itemTitle
    var user = event.user
    var pass = event.pass
    if (pass) {
        var _openid = event.openid
        return await db.collection("taskOfficialDB").add({
            data: {
                title: itemTitle,
                price: itemPrice,
                contact: contact,
                descr: itemDesc,
                destn: itemLoc,
                type: itemType,
                deadline: itemDate,
                uploadTime: uploadTime,
                itemDB: itemDB,
                user: user,
                pass: pass,
                openid: _openid
            }
        })
    } else {
        return await db.collection("taskTempDB").add({
            data: {
                title: itemTitle,
                price: itemPrice,
                contact: contact,
                descr: itemDesc,
                destn: itemLoc,
                type: itemType,
                deadline: itemDate,
                uploadTime: uploadTime,
                itemDB: itemDB,
                user: user,
                pass: pass,
                openid: openid
            }
        })

    }

}