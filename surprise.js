const fs = require('fs');
const superagent = require('superagent');
const isplider = require("./fun/splider");
const async = require('async');



const config = {
    targetUrl: "http://meizitu.com/a/more_*.html",
    tags: ['$(".pic a")', '$("#picture p img")'],
    classNum: 2,
    icontent: {
        "title": "$element.attr('alt')",
        "imgSrc": "$element.attr('src')"
    },
    charset: 'gbk',
    mode: 'pagination',
    startPage: 1,
    endPage: 20
}


function concatAry(myary) {
    let arys = [];
    myary.forEach(function(ary) {
        arys = arys.concat(ary);
    });
    return arys;
}

let i = 0;

async function result() {
    let res = await isplider(config.targetUrl, config.tags, config.classNum, config.icontent, config.charset, config.mode, config.startPage, config.endPage)
    let links = concatAry(res);
    async.mapLimit(links, 5, function(ourl, fn) {
        setTimeout(() => {
            fetchResult(ourl.imgSrc, ourl, fn);
        }, Math.ceil(Math.random() * 100))
    }, function(err, res) {
        if (err) {
            fs.writeFile("./log/err.log", err, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        } else {
            console.log("成功");
        }
    });
}

function fetchResult(url, obj, fn) {
    superagent.get(url).end((err, res) => {
        if (err) {
            fn(err);
        } else {
            fs.writeFile("/home/caddy/www/file/pub/images/" + obj.title + ".jpg", res.body, (err) => {
                console.log("当前写入第" + ++i + "张图片");
                if (err) {
                    console.log(err);
                }
            });
            fn(null, null);
        }
    });
}

result();