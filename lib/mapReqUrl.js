const async = require('async');
const fetchResult = require("./fetchResult");

//num抓取深度
//content输出数据格式
//tag_num标签下标
//mycharset页面编码
//fetchTime抓取的延迟时间(默认30毫秒以内,抓取太快,会被目标网站发现，太慢，响应时间太长)
function mapReqUrl(links, tags, num, content, tag_num, mycharset, proxys, fetchTime = 50) {
    //随机获取一个代理
    const proxy = proxys[Math.floor(Math.random() * proxys.length + 1) - 1]
    return new Promise(function(resolve, reject) {
        async.mapLimit(links, 5, function(ourl, fn) {
            setTimeout(function() {
                fetchResult(ourl, tags, num, content, tag_num, mycharset, proxy, fn);
            }, Math.ceil(Math.random() * fetchTime));
        }, function(err, res) {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}



module.exports = mapReqUrl;