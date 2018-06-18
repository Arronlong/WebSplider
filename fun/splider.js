const superagent = require('superagent');
const cheerio = require('cheerio');
const durl = require('url');
const mapReqUrl = require('./mapReqUrl');
const fetchResult = require("./fetchResult");
require('superagent-charset')(superagent);


//爬虫一级直接可以定制数据
//第二级需要第一级传来的链接才能继续爬，定制返回数据
//第三级需要第二级传来的链接才能继续爬，定制返回数据


//iurl指出初始抓取的网址
//tags指出抓取当前页面的目标
//num指出抓取深度
//content指出抓取目标页内容

//page是分页模式标志位
//startPage是分页起始页码
//endPage是尾页码

function splider(iurl, tags, num, content, mycharset, page, startPage, endPage) {
    let mylinks = [];
    if (page === 'pagination' && startPage && endPage && /.*\*/g.test(iurl)) {
        for (let i = startPage; endPage >= i; i++) {
            mylinks.push(iurl.replace('*', i));
        }
    } else {
        mylinks.push(iurl);
    }

    return mapReqUrl(mylinks, tags, num, content, 0, mycharset)
        .then((result) => {
            if (num > 1) {
                return mapReqUrl(result[0], tags, num, content, 1, mycharset);
            } else {
                return result;
            }
        }, (err) => {
            return new Promise((resolve, reject) => reject(err));
        }).then((result) => {
            if (num > 2) {
                return mapReqUrl(result[0], tags, num, content, 2, mycharset);
            } else {
                return result;
            }
        }, (err) => {
            return new Promise((resolve, reject) => reject(err));
        })
};

module.exports = splider;