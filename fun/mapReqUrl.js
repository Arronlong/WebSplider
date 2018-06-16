const async = require('async');
const fetchResult = require("./fetchResult");

//num抓取深度
//content输出数据格式
function mapReqUrl(result, tags, num, content, tag_num) {
    return new Promise(function(resolve, reject) {
        async.mapLimit(result, 10, function(ourl, callback) {
            fetchResult(ourl, tags, num, content, tag_num, callback);
        }, function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = mapReqUrl;