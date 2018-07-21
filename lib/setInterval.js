const schedule = require("node-schedule");
const getProxy = require("./proxy");

//更新数据用
const Result = require("../model/UserSpliderResult");

//爬虫
const splider = require("./splider");


//设置爬虫定时任务
//从生成数据接口开始，每隔1天进行数据请求
module.exports = function(cid, obj) {
    let time = new Date();


    function getTime() {
        return new Date(time.getFullYear(), time.getMonth(), time.getDate() + 1, time.getHours(), time.getMinutes() + parseInt(Math.random() * 60), time.getSeconds() + parseInt(Math.random() * 60))
    }

    function setTask() {
        schedule.scheduleJob(getTime(), async function() {
            time = new Date();

            const time2 = new Date();
            time2.setHours(time2.getHours() + 8);

            const result = await splider(obj.targetUrl, obj.targetTags, obj.classNum, obj.icontent, obj.mycharset, obj.mode, obj.startPage, obj.endPage, await getProxy(obj));
            Result.update({ cid }, { result, time: time2 });
            setTask();
        });
    }
    setTask();
};