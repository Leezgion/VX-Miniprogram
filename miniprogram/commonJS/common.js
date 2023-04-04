var common = {
    //随机组合唯一id
    chaos: function () {
        return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36)
    },
    //获取图片后缀名
    getSuffix(filename) {
        var dotIndex = filename.lastIndexOf(".")
        return filename.substring(dotIndex)
    },
}
module.exports = common