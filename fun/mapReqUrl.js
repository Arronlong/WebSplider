const async = require('async');
const fetchResult = require("./fetchResult");

//num抓取深度
//content输出数据格式
function mapReqUrl(links, tags, num, content, tag_num, mycharset) {
    return new Promise(function(resolve, reject) {
        async.mapLimit(links, 5, function(ourl, fn) {
            setTimeout(function() {
                fetchResult(ourl, tags, num, content, tag_num, mycharset, fn);
            }, Math.ceil(Math.random() * 50));
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