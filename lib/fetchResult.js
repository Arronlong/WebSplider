const superagent = require('superagent');
const cheerio = require('cheerio');
const durl = require('url');
const time = require('./time');
require('superagent-charset')(superagent);
require('superagent-proxy')(superagent);

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
    'User-Agent': UserAgent[Math.floor(Math.random() * UserAgent.length + 1) - 1]
}



async function fetchResult(ourl, tags, num, content, tag_num, mycharset, proxys, fn) {
    superagent.get(ourl).set(reqHeader).proxy(proxys).charset(mycharset).end(function(err, res) {
        if (err) {
            console.error(`${time()} 链接${ourl}请求出错，错误详情:${err}`);
            fn(err);
        } else {
            //保存抓取结果
            let myresult = [];

            //解析网页
            let $ = cheerio.load(res.text);

            //标签选择器
            let target = null;

            //"输出结果"格式中属性选择器解析状态
            let state = true;
            let errmsg = '';

            try {
                //将用户输入的标签选择器整合到上下文
                //在koa路由那里已经验证过用户输入
                target = eval(tags[tag_num]);

                target.each(function(idx, element) {
                    var $element = $(element);

                    //num是爬取深度,tag_num是标签选择器数组下标
                    //当爬取深度等于标签选择器数组下标值，说明此时已经到达目标页面
                    //否则此时还在中间页面，需要继续解析a标签选择器获得下一级的URL
                    if (num == tag_num + 1) {
                        let i_result = {};

                        //将"输出结果"中的键和值分别保存到数组
                        let i_key = Object.keys(content);
                        let i_value = Object.values(content);

                        //解析数据
                        i_key.forEach(function(key, idx) {
                            try {
                                i_result[key] = eval(i_value[idx]);
                            } catch (e) {
                                state = false;
                                errmsg = e.toString();

                                console.error(`${time()} 属性选择器解析失败，失败详情 ${e}`)
                            }
                        });

                        myresult.push(i_result);
                    } else {
                        try {
                            //通过a标签选择器获取中间页面的URL
                            let i_result = durl.resolve(ourl, $element.attr('href'));
                            myresult.push(i_result);
                        } catch (e) {
                            state = false;
                            errmsg = `中间级的标签选择器应为a标签选择器，以使得程序顺利解析到下一级页面。`;

                            console.error(`${time()} 中间页面的a标签选择器解析失败 ， 错误详情:${e}`)
                        }


                    }
                });

                state ? fn(null, myresult) : fn(errmsg);

            } catch (e) {
                console.error(`${time()} 标签选择器解析出错，错误详情:${e}`);
                fn(e);
            }
        }
    })
}

module.exports = fetchResult;