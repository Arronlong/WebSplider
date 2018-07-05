const schedule = require("node-schedule");

//更新数据用
const Result = require("../model/UserSpliderResult");

//爬虫
const splider = require("./splider");

module.exports = function(cid, obj) {
    const rule2 = new schedule.RecurrenceRule();

    //每三小时更新一次数据
    schedule.scheduleJob('* * /3 * * *', async function() {
        const result = await splider(obj.targetUrl, obj.targetTags, obj.classNum, obj.icontent, obj.mycharset, obj.mode, obj.startPage, obj.endPage);
        Result.update({ cid }, { result })
        console.log(result);
    });
};