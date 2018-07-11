const mapReqUrl = require('./mapReqUrl');

function concatAry(myary) {
    let arys = [];
    myary.forEach(function(ary) {
        arys = arys.concat(ary);
    });
    return arys;
}


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

async function splider(iurl, tags, num, content, mycharset, page, startPage, endPage, proxys) {
    let mylinks = [];

    if (!startPage) {
        startPage = 0;
    }
    // 分页模式下,链接构建
    if (page === 'pagination' && endPage && /[http|https]:\/\/.+\*/g.test(iurl)) {
        for (let i = startPage; endPage >= i; i++) {
            mylinks.push(iurl.replace('*', i));
        }
    } else {
        mylinks.push(iurl);
    }

    return mapReqUrl(mylinks, tags, num, content, 0, mycharset, proxys)
        .then((result) => {
            return bound(result, tags, num, content, 1, mycharset, proxys);
        }).then((result) => {
            return bound(result, tags, num, content, 2, mycharset, proxys);
        }).catch(err => {
            return err;
        })
};

function bound(result, tags, num, content, tagnum, mycharset, proxys) {
    if (num > tagnum) {
        result = concatAry(result);
        return mapReqUrl(result, tags, num, content, tagnum, mycharset, proxys);
    } else {
        return result;
    }
}

module.exports = splider;