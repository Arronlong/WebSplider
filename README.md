[WebSplider](http://splider.docmobile.cn)
===============

基于NodeJS的在线爬虫系统。支持提供在线数据API。

1、当你想在自己的网站添加一个小的新闻模块时，你可以利用WebSplider爬虫爬取指定网站的数据，然后在后端或者前端请求数据接口，再将获得的数据构造到你的网页上。

2、当你想知道自己追的剧，小说等更新没有，你可以抓取指定网站的数据(比如说视频级数)，然后在后台请求数据接口，将数据保存到你的数据库中，设置一个定时器，定时请求数据接口，将获得的数据与数据库数据对比即可。然后弄个邮件发送，监控到数据变化时，给你发送邮件。

...

基于此，WebSplider诞生了。

## 特性

> * 简单、方便。只要掌握简单的网页知识，即可利用WebSplider在线爬虫系统，进行简单的配置之后，可进行数据抓取预览。

> * 功能强大。支持抓取预览，定制输出，生成API，API管理，查看分享，登录注册等功能。

> * 响应速度快。抓取结果保存在数据库中，每天定时更新数据，数据接口响应数据库内容。


## 本地测试
1、安装Nodejs，安装MongoDB数据库，搭建环境

2、运行代码
```
git clone https://github.com/LuckyHH/WebSplider.git
npm install
npm start
```

3，打开浏览器
```
http://localhost:3000
```

## 核心代码
```
const Koa = require("koa");
const superagent = require("superagent");
const cheerio = require("cheerio");
const app = new Koa();

app.get('/', function (req, res, next) {
    superagent.get('https://cnodejs.org/')
        .end(function (err, sres) {
            if (err) {
                return next(err);
            }
            var $ = cheerio.load(sres.text);

            $('.topic_title').each(function (idx, element) {
                var $element = $(element);
                items.push({
                    title: $element.attr('title'),
                    url : $element.attr('href')
                });
            })
           res.send(items);
        })
})

app.listen(3000);
```


## 使用

### 1.爬取深度

爬取深度指的是从初始网址经过几层到达数据所在网址。最大支持的爬取深度为3，推荐使用的最大爬取深度为2  

### 2.网页编码

目标网页的编码格式，默认为UTF-8

### 3.抓取模式

普通模式与分页模式


### 4.页码范围

在分页模式下，抓取的起止页码

### 5.目标网址

目标网址即要爬取的目标网站的网址。

普通模式下只需填写要抓取的网址即可。

分页模式下:

网址填写时，将网址中的页码改为*即可

例如:

CNode的分页网址

```https://cnodejs.org/?tab=good&page=10```

改为

```https://cnodejs.org/?tab=good&page=*```


### 6.选择器

选择器用来筛选数据。填写需要用户具有基本的前端知识。

当抓取深度为1，则只需填写1级选择器，填写数据所在标签即可

当抓取深度为2，则一级选择器中填写到达第二层页面的a标签选择器，二级选择器填写数据所在标签即可。

当抓取深度为3，则一级选择器中填写到达第二层页面的a标签选择器，二级选择器中填写到达第三层页面的a标签选择器，三级选择器填写数据所在标签即可。

例如:

```$(".topic_title a")```

指的是目标页面中所有类名为topic_title的元素中的a元素


```$(".topic_title").find('.content')```

指的是目标页面中类名为topic_title的元素下的类名为content的子孙元素


更多选择器填写规则，参考[cheerio](https://www.npmjs.com/package/cheerio)。

### 7.输出结果定制。 

输出结果定制指的是输出哪些结果

这里需要写成JSON格式，参考写法如下：

```
{
    "name":"$element.find('.c-9 .ml-20 a').text()",
    "age":"$element.children('.c-9').next().text()"
}
```

其中，键为name的值，筛选出的元素下的类名为c-9的元素下的类名ml-20下的a元素中的文本

键为age的值，筛选出的元素下的类名为c-9的元素下一个元素的文本内容


键随意指定，值中写法需要参考cheerio的属性部分。$element代表的是选择器选择出的元素。


### 8.代理模式

即抓取数据是否需要使用HTTP代理。有3中模式，无代理，西刺代理与自定义代理模式。

无代理模式使用自己的IP向目标服务器发出请求。

西刺代理模式使用[西刺代理](http://www.xicidaili.com/)可用的代理地址发出请求。[HttpProxy](http://httpproxy.docmobile.cn)提供API支持

自定义代理模式需要用户自己填写可用代理。
输入格式如下:
```['http://111.111.111.111:1111','http://111.111.111.111:1111']```

注:自定义代理地址填写有误的话，系统默认使用无代理模式


### 9.结果预览

返回结果中，time值为数据最后一次的更新时间。data值为抓取结果。

### 10.生成数据接口

数据接口只在用户登录情况下生成。

## 数据接口调用示例

### 1.后端调用示例:
```

Node.js后端
const express = require('express');
const axios = require("axios");
const router = express.Router();

router.get('/douban/movie', function(req, res, next) {
    axios.get("http://splider.docmobile.cn/interface?name=luckyhh&cid=1529046160624").then(ires => {
        res.render('douban', { title: 'douban', content: ires.data.data });
    }).catch(err => {
        console.log(err);
    });
});

ejs模板页面
<ul>
        <%
                for(let i = 0 ; i < content.length ; i++){
                    for(let j = 0 ; j < content[i].length ; j++){
        %>
            <li>
                <h3>
                    <%=content[i][j].name%>
                </h3>
                <img src="<%=content[i][j].image_src%>" alt="<%=content[i][j].name%>"><br>
                <span>导演:
                    <%=content[i][j].director%>
                </span>
                <br>
                <span>编剧:
                    <%=content[i][j].screenwriter%>
                </span>
                <br>
                <span>主演:
                    <%=content[i][j].starring%>
                </span>
                <br>
                <span>
                    得分:<%=content[i][j].score%>
                </span>
                <br>
                <p>简介:
                    <%=content[i][j].brief%>
                </p>
            </li>
        <%
                    }
                }
        %>
    </ul>
```

### 2.前端调用示例

由于跨域问题，所以系统为用户提供了JSONP的调用方式
```
调用示例
<script>
    function callback(obj) {
        console.log(obj);
    }
</script>
<script src="http://localhost:3000/interface?name=luckyhh&cid=1531671500898&cb=callback"></script>
```
调用时，只需要在数据接口后添加 cb = 函数名 即可。

## 接口调用DEMO
[WebSplider DEMO](http://demo.docmobile.cn)


## 示例配置参考

> * [WebSplider参考配置](https://docmobile.cn/artical_detiail/luckyhh/1528369921460)

> * [基于WebSplider的在线新闻模块开发](https://www.docmobile.cn/artical_detiail/luckyhh/1528989508215)


## 更新日志

[WebSplider更新日志](https://www.docmobile.cn/artical_detiail/luckyhh/1530767352093)


## TODO
- [x] 对GBK网页格式的抓取支持
- [x] 支持模式选择，可抓取分页列表
- [x] 定义请求头
- [x] 添加HTTP代理
- [x] JSONP调用支持
- [ ] 优化管理界面
- [ ] 添加更详细的使用说明
  

## 协议

MIT


