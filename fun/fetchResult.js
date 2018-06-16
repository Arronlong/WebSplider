const superagent = require('superagent');
const cheerio = require('cheerio');
const durl = require('url');
const mapReqUrl = require('./mapReqUrl');
const splider = require("./splider");

//该函数使用superagent爬取页面
//content指定输出数据格式
function fetchResult(ourl, tags, num, content, tag_num, fn) {
    superagent.get(ourl).end(function(err, res) {
        if (err) {
            fn(null, err);
        } else {
            let result = [];
            let $ = cheerio.load(res.text);
            let target

            try {
                target = eval(tags[tag_num]);
                target.each(function(idx, element) {
                    var $element = $(element);
                    if (num == tag_num + 1) {
                        let i_result = {};
                        let i_key = Object.keys(content);
                        let i_value = Object.values(content);
                        i_key.forEach(function(key, idx) {
                            try {
                                i_result[key] = eval(i_value[idx]);
                            } catch (e) {
                                i_result[key] = "您输入的选择器有误。"
                            }
                        })
                        result.push(i_result);
                    } else {
                        let i_result = durl.resolve(ourl, $element.attr('href'));
                        result.push(i_result);
                    }
                });
                fn(null, result);
            } catch (e) {
                fn(null, e);
            }
        }
    })
}

module.exports = fetchResult;