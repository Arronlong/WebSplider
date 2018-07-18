WebSplider
===============

基于NodeJS的在线爬虫系统。支持提供在线数据API。

1、当你想在自己的网站添加一个小的新闻模块时，你可以利用WebSplider爬虫爬取指定网站的数据，然后在后端或者前端请求数据接口，再将获得的数据构造到你的网页上。

2、当你想知道自己追的剧，小说等更新没有，你可以抓取指定网站的数据(比如说视频级数)，然后在后台请求数据接口，将数据保存到你的数据库中，设置一个定时器，定时请求数据接口，将获得的数据与数据库数据对比即可。然后弄个邮件发送，监控到数据变化时，给你发送邮件。

...

基于此，WebSplider诞生了。

## 特性

> * 简单、方便。只要掌握简单的网页知识，即可利用WebSplider在线爬虫系统，进行简单的配置之后，可进行数据抓取预览。

> * 登录注册后，支持生成数据接口，开发者在后台请求数据接口，将返回数据构造到模板上即可。

> * 支持接口权限管理。可选择删除、备注等操作

> * 支持查看别人公开的数据接口。

> * 用户生成数据接口时，保存的配置，系统自动每天更新一波数据，并将结果保存到数据库。保证了数据接口响应速度，兼顾了时效性。

> * 支持选择HTTP代理模式。



## 界面
![WebSplider](https://docmobile.cn/upload/image/plain/1007976278856437760.jpg )


## 本地测试
1、安装Nodejs，安装MongoDB数据库，搭建环境

2、
```
git clone https://github.com/LuckyHH/WebSplider.git
npm install
npm start
```

3，打开浏览器
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

+ 代理模式

即抓取数据是否需要使用HTTP代理。有3中模式，无代理，西刺代理与自定义代理模式。

无代理模式使用自己的IP向目标服务器发出请求。

西刺代理模式使用[西刺代理](http://www.xicidaili.com/)可用的代理地址发出请求。[HttpProxy](http://httpproxy.docmobile.cn)提供API支持

自定义代理模式需要用户自己填写可用代理。
输入格式如下:
```['http://111.111.111.111:1111','http://111.111.111.111:1111']```

注:代理地址有误的话，后台模式默认使用无代理模式


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


## TODO
- [x] 对GBK网页格式的抓取支持
- [x] 支持模式选择，可抓取分页列表
- [x] 定义请求头
- [x] 添加HTTP代理
- [ ] 优化管理界面
- [ ] 添加更详细的使用说明
  

## 协议

MIT


