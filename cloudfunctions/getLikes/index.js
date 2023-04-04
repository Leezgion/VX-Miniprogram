// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const openid = cloud.getWXContext().OPENID
    var blogsIds = event.blogsIds
    if (blogsIds) {
        for (var i = 0; i < blogsIds.length; i++) {
            var comment = await db.collection('comment_DB').where({
                blogId: blogsIds[i]
            }).get()
            var comments = comment.push(comment)
        }
        return comments
    }
    return await db.collection('blogTempDB').where({
        openid: openid
    }).get()
}