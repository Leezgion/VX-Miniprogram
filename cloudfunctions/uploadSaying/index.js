// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const openid = cloud.getWXContext().OPENID
    var index = event.index
    var saying = event.saying
    var author = event.author
    var words = event.words
    var spell = event.spell
    var explanation = event.explanation
    var uploadTime = new Date().getTime()
    if (index == 0) {
        return await db.collection('dailySentence').add({
            data: {
                openid: openid,
                saying: saying,
                author: author,
                uploadTime:uploadTime,
            }
        })
    } else if (index == 1) {
        return await db.collection('dailyWords').add({
            data: {
                openid: openid,
                words: words,
                spell: spell,
                explanation: explanation,
                uploadTime:uploadTime,
            }
        })
    }
}