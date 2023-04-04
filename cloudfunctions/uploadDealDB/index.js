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
    var itemTitle = event.itemTitle
    var itemDesc = event.itemDesc
    var wornItem = event.wornItem
    var itemType = event.itemType
    var itemPrice = event.itemPrice
    var itemNum = event.itemNum
    var itemDB = event.itemDB
    var contact = event.contact
    var user = event.user
    var pass = event.pass
    //如果通过审核存入正式数据库
    if (pass) {
        var _openid = event.openid
        return await db.collection("dealOfficialDB").add({
            data: {
                descr:itemDesc,
                num:itemNum,
                price:itemPrice,
                tags:wornItem,
                title:itemTitle,
                type:itemType,
                contact:contact,
                uploadTime:uploadTime,
                itemDB:itemDB,
                pass:pass,
                openid:_openid,
                user:user
            }
        })
    }else{
        return await db.collection("dealTempDB").add({
            data: {
                descr:itemDesc,
                num:itemNum,
                price:itemPrice,
                tags:wornItem,
                title:itemTitle,
                type:itemType,
                contact:contact,
                uploadTime:uploadTime,
                itemDB:itemDB,
                pass:pass,
                openid:openid,
                user:user
            }
        })
    }
}