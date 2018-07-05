WebSplider
===============

基于NodeJS的在线爬虫系统。

当你想搭建一个新闻网站、视频网站等站点，又苦于自己没有资源的时候，你可能会写个爬虫去爬取别的网站的数据。

自己写爬虫的话，会耗费大量的时间，并且如果开发者没有相关爬虫知识的话，还需要翻阅资料再进行开发。

基于此，WebSplider诞生了。

## 特性

> * 简单、方便。只要掌握简单的网页知识，即可利用WebSplider在线爬虫系统，进行简单的配置之后，可进行数据抓取预览。

> * 登录注册后，支持生成数据接口，开发者在后台请求数据接口，将返回数据构造到模板上即可。

> * 支持接口权限管理，可选择将接口开放到WebSplider首页，供他人使用。

> * 用户生成数据接口时，保存的配置，系统自动每3小时更新一波数据，并将结果保存到数据库。保证了数据接口响应速度，兼顾了时效性。



## 界面
![WebSplider](https://docmobile.cn/upload/image/plain/1007976278856437760.jpg )


## 本地测试

1，克隆项目到本地
```
git clone https://github.com/LuckyHH/WebSplider.git
```

2，安装Nodejs，安装MongoDB数据库，搭建环境

3，安装依赖

```
npm install
```

4，启动项目
```
npm start
```

5，打开浏览器
```
http://localhost:3000
```

## 使用

+ 爬取深度

爬取深度指的是经过几次抓取才能得到最终数据。最大支持的爬取深度为3，推荐使用的最大爬取深度为2（因为时间问题，深度越大，时间越长）  

+ 网页编码

目标网页的编码格式，默认为UTF-8

+ 抓取模式

普通模式与分页模式

分页模式下:

网址填写时，将页码改为*即可

例如:

CNode的分页网址

```https://cnodejs.org/?tab=good&page=10```

改为

```https://cnodejs.org/?tab=good&page=*```

+ 页码范围

在分页模式下，抓取的起止页码

+ 目标网址

目标网址即要爬取的目标网站的网址。


+ 选择器。

选择器用来筛选数据。填写需要用户具有一定的前端知识。选择器填写规则，参考[cheerio](https://www.npmjs.com/package/cheerio)。


+ 输出结果定制。 

输出结果定制指的是输出哪些结果

这里需要写成JSON格式，参考写法如下：

```{ "name":"$element.attr('title')" }```


键随意指定，值中写法需要参考cheerio的属性部分。$element代表的是选择器选择出的元素。



## 选择器参考写法如下

```$(".topic_title")```

指的是选择目标页面中所有类名为topic_title的元素。


```$(".topic_title a")```

指的是选择目标页面中所有类名为topic_title的元素中的a标签元素



```$(".topic_title").children('h3').children('a')```

指的是类名为topic_title的元素的子元素h3的子元素a元素



```$(".topic_title").find('.content')```


指的是类名为topic_title的元素下的类名为content的子孙元素


## 值参考写法如下

```$element.children('.c-9').children('.ml-20').children('a').text()```

筛选出的元素下的类名为c-9的元素下的类名ml-20下的a元素中的文本



```$element.children('.c-9').next().text()```

筛选出的元素下的类名为c-9的元素下一个元素的文本内容



## 更多使用示例配置参考

> * [WebSplider参考配置](https://docmobile.cn/artical_detiail/luckyhh/1528369921460)

> * [基于WebSplider的在线新闻模块开发](https://www.docmobile.cn/artical_detiail/luckyhh/1528989508215)


## 更新日志

[WebSplider更新日志](https://www.docmobile.cn/artical_detiail/luckyhh/1530767352093)

## 其他

关于HTTP代理。我做了个小项目[HttpProxy](http://httpproxy.docmobile.cn)，用来查询西刺代理中可用的代理，结果发现没几个能用的。于是，WebSplider项目中没有使用代理，作为替代，我选择将爬取结果存到数据库，由系统自动更新数据，而不是由用户。这样可以保证抓取数据不会被对方发现。

## TODO
- [x] 对GBK网页格式的抓取支持
- [x] 支持模式选择，可抓取分页列表
- [x] 定义请求头


## 协议

MIT


