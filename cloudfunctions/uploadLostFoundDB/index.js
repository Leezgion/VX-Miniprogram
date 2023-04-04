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
    var itemDesc = event.itemDesc
    var itemDB = event.itemDB
    var itemType = event.itemType
    var itemDate = event.itemDate
    var itemLoc = event.itemLoc
    var contact = event.contact
    var itemTitle = event.itemTitle
    var user = event.user
    var pass = event.pass
    //如果通过审核存入正式数据库
    if (pass) {
        var _openid = event.openid
        return await db.collection("lostFoundOfficialDB").add({
            data: {
                title: itemTitle,
                date: itemDate,
                itemType: itemType,
                locale: itemLoc,
                descr: itemDesc,
                contact: contact,
                itemDB: itemDB,
                openid: _openid,
                uploadTime: uploadTime,
                user: user,
                pass: pass
            }
        })
    } else {
        return await db.collection("lostFoundTempDB").add({
            data: {
                title: itemTitle,
                date: itemDate,
                itemType: itemType,
                locale: itemLoc,
                descr: itemDesc,
                contact: contact,
                itemDB: itemDB,
                openid: openid,
                uploadTime: uploadTime,
                user: user,
                pass: pass
            }
        })
    }
}