const superagent = require('superagent');
const cheerio = require('cheerio');
const durl = require('url');
const mapReqUrl = require('./mapReqUrl');
const splider = require("./splider");
require('superagent-charset')(superagent);

//该函数使用superagent爬取页面
//content指定输出数据格式
// num指深度
//tag_num指选择器数组中的哪一项

function fetchResult(ourl, tags, num, content, tag_num, mycharset, fn) {
    superagent.get(ourl).charset(mycharset).end(function(err, res) {
        if (err) {
            fn(err);
        } else {
            let myresult = [];
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
                        });
                        myresult.push(i_result);
                    } else {
                        let i_result = durl.resolve(ourl, $element.attr('href'));
                        myresult.push(i_result);
                    }
                });
                fn(null, myresult);

            } catch (e) {
                fn(e);
            }
        }
    })
}

module.exports = fetchResult;