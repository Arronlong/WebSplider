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

// 请求头字段
const UserAgent = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36(KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36(KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
    'Opera/9.80 (Windows NT 5.1; U; zh-cn) Presto/2.6.31 Version/10.70',
    'Mozilla/5.0 (Windows NT 5.1; U; zh-cn; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6 Opera 10.70',
    'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; zh-cn) Opera 10.70',
    'Mozilla/5.0 (Windows NT 5.1; U; zh-cn; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6',
    'Mozilla/5.0 (Windows; U; Windows NT 5.2) Gecko/2008070208 Firefox/3.0.1',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.1 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063',
    'Mozilla/5.0 (iPad; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
    'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)',
    'Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)',
    'Sogou web spider/4.0(+http://www.sogou.com/docs/help/webmasters.htm#07)'
]
const reqHeader = {
    'Accept': 'text/html, application/xhtml+xml,application/xml; q=0.9, image/webp,image/apng, */*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7,ja;q=0.6',
    'User-Agent': UserAgent[Math.floor(Math.random() * UserAgent.length) - 1]
}

function fetchResult(ourl, tags, num, content, tag_num, mycharset, fn) {
    superagent.get(ourl).set(reqHeader).charset(mycharset).end(function(err, res) {
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