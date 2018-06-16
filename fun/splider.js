const superagent = require('superagent');
const cheerio = require('cheerio');
const durl = require('url');
const mapReqUrl = require('./mapReqUrl');
const fetchResult = require("./fetchResult");


//爬虫一级直接可以定制数据
//第二级需要第一级传来的链接才能继续爬，定制返回数据
//第三级需要第二级传来的链接才能继续爬，定制返回数据


//iurl指出初始抓取的网址
//tags指出抓取当前页面的目标
//num指出抓取深度
//content指出抓取目标页内容
function splider(iurl, tags, num, content) {
    return new Promise(function(resolve, reject) {
        superagent.get(iurl, tags).end(function(err, res) {
            if (err) {
                reject(err);
            } else {
                let result = [];
                let $ = cheerio.load(res.text);
                let target;

                //tags输入有误
                try {
                    target = eval(tags[0]); //难点，将接收到的字符串转化为$对象，当然，这里要进行一些输入判断
                    target.each(function(idx, element) {
                        let $element = $(element);
                        if (num == 1) {
                            let i_result = {};
                            let i_key = Object.keys(content);
                            let i_value = Object.values(content);
                            i_key.forEach(function(key, idx) {
                                try {
                                    i_result[key] = eval(i_value[idx]);
                                } catch (e) {
                                    i_result[key] = "您输入的选择器有误。报错代码:" + e;
                                }
                            })
                            result.push(i_result);
                        } else {
                            let i_result = durl.resolve(iurl, $element.attr('href')); //这里补全网址是为了下面的抓取
                            result.push(i_result);
                        }
                    });
                    resolve(result);
                } catch (e) {
                    reject(e);
                }
            }
        })
    }).then((result) => {
        if (num > 1) {
            //返回新的promise实例
            return mapReqUrl(result, tags, 2, content, 1);
        } else {
            return result;
        }
    }, (err) => {
        return new Promise((resolve, reject) => reject(err));
    }).then((result) => {
        if (num > 2) {
            return mapReqUrl(result, tags, 3, content, 2);
        } else {
            return result;
        }
    }, (err) => {
        return new Promise((resolve, reject) => reject(err));
    })
}

module.exports = splider;