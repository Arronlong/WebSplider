const fs = require("fs");
const Koa = require("koa");
const serve = require("koa-static"); //静态文件夹
const session = require("koa-session"); //存储session
const User = require("./model/UserInfo");
const UserSpliderConf = require("./model/UserSpliderConf");
const Result = require("./model/UserSpliderResult");
const splider = require("./lib/splider");
const getProxy = require("./lib/proxy");
const itime = require("./lib/time");
const formatResult = require("./lib/formatResult");
const autoUpdate = require("./lib/setInterval");
const CONFIG = require("./conf/session_conf");
const HOSTNAME = require("./conf/conf").HOSTNAME;
const app = new Koa();

//设置静态目录
app.use(serve(__dirname + "/public"));

//session加密用的
app.keys = ["I Love You"];
app.use(session(CONFIG, app));


//配置根目录
app.use(async function(ctx, next) {
    if (ctx.request.path === "/" && ctx.request.method === "GET") {
        ctx.response.type = 'html';
        ctx.response.body = await fs.ReadStream(__dirname + '/public/html/index.html');
    } else {
        await next();
    }
});

//抓取预览
app.use(async function(ctx, next) {
    if (ctx.request.path === "/result" && ctx.request.method === "GET") {
        const body = ctx.request.query;
        //响应状态
        let state = true;
        //返回用户结果
        let resResult = null;

        //“输出格式”中时间涉及到自动定时任务，所以不用格式化后的时间itime
        //这里这个时间可以用格式化后的时间itime，因为这部分是预览功能，不涉及到数据库保存数据与定时更新数据，
        //但为了保持预览数据与生成数据接口中的数据的一致性，选择不使用格式化时间itime
        const time = new Date();
        time.setHours(time.getHours() + 8);

        if (!body.targetUrl || !body.targetTags || !body.icontent) {
            state = false;
            resResult = {
                "state": state,
                "time": time,
                "data": "输入不完整"
            };
        } else {
            try {
                const targetTags = body.targetTags.split(',');
                const icontent = JSON.parse(body.icontent);
                let spliderResult = '';

                try {
                    spliderResult = await splider(body.targetUrl, targetTags, body.classNum, icontent, body.mycharset, body.mode, body.startPage, body.endPage, await getProxy(body));

                    resResult = {
                        "state": state,
                        "time": time,
                        "data": formatResult(spliderResult)
                    };

                } catch (e) {
                    state = false;
                    resResult = {
                        "state": state,
                        "time": time,
                        "data": e.toString()
                    }
                    console.error(`${itime()} Web部分 爬虫结果获取失败，失败详情:${e}`);
                }

            } catch (e) {
                state = false;
                resResult = {
                    "state": state,
                    "time": time,
                    "data": e.toString()
                };
                console.error(`${itime()} Web部分 JSON解析失败，失败详情:${e}`);
            }
        }
        ctx.response.body = resResult;

    } else {
        await next();
    }
});

//登录相关
app.use(async function(ctx, next) {
    if (ctx.request.path === "/login" && ctx.request.method === "GET") {
        const body = ctx.request.query;
        if (body.login_user && body.login_password) {
            const user = await User.get(body.login_user, true);
            if (user.length > 0 && (body.login_password === user[0].password)) {
                ctx.session.user = body.login_user;
                ctx.response.body = "success";
            } else {
                ctx.response.body = "验证失败";
            }
        } else {
            ctx.response.body = "输入不完整";
        }
    } else {
        await next();
    }
})

//注册相关
app.use(async function(ctx, next) {
    if (ctx.request.path === "/register" && ctx.request.method === "GET") {
        const body = ctx.request.query;
        if (body.register_user && body.register_password && body.register_repeat_password && (body.register_password === body.register_repeat_password)) {
            const user = await User.get(body.register_user, false);
            if (user.length > 0) {
                ctx.response.body = "用户名已存在"
            } else {
                const user = {
                    name: body.register_user,
                    password: body.register_password,
                    userid: Date.now().toString()
                }
                const iuser = new User(user);
                await iuser.save();
                ctx.session.user = user.name;
                ctx.response.body = "success";
            }
        } else {
            ctx.response.body = "输入有误";
        }
    } else {
        await next();
    }
})

//用户登录状态查询
app.use(async function(ctx, next) {
    if (ctx.request.path === "/userstatus" && ctx.request.method === "GET") {
        //如果用户登录了，可以查看登录状态
        //这个接口用于维持客户端登录状态
        if (ctx.session.user) {
            ctx.response.body = ctx.session.user;
        } else {
            ctx.response.body = false;
        }
    } else {
        await next();
    }
})

//根据数据库中存的参数返回json
app.use(async function(ctx, next) {
    if (ctx.request.path === "/save" && ctx.request.method === "GET") {
        if (ctx.session.user) {
            const body = ctx.request.query;

            if (!body.targetUrl || !body.targetTags || !body.icontent) {
                ctx.response.body = "保存失败,输入不完整";
            } else {
                const targetTags = body.targetTags.split(',');
                try {
                    const icontent = JSON.parse(body.icontent);
                    const cid = Date.now().toString();
                    const userconf = {
                        user: ctx.session.user,
                        targetUrl: body.targetUrl,
                        targetTags: targetTags,
                        icontent: icontent,
                        classNum: body.classNum,
                        msg: '',
                        time: itime(),
                        cid,
                        public: '2',
                        url: `${HOSTNAME}/interface?name=${ctx.session.user}&cid=${cid}`,
                        mycharset: body.mycharset,
                        mode: body.mode,
                        startPage: body.startPage,
                        endPage: body.endPage,
                        proxymode: body.proxymode,
                        inputproxy: body.inputproxy
                    };
                    const conf = new UserSpliderConf(userconf);

                    try {
                        const saved = await conf.save();
                        ctx.response.body = saved[0].url;
                    } catch (e) {
                        ctx.response.body = "配置保存错误\n" + e;
                    }


                } catch (e) {
                    ctx.response.body = "JSON解析错误\n" + e;
                }
            }
        } else {
            ctx.response.body = "用户未登录";
        }
    } else {
        await next();
    }
});

//数据接口生成
//逻辑:根据URL中的昵称与id判断是否合法,根据数据库中是否有记录判断是否第一次请求，第一次请求使用爬虫，接下来的使用数据库存的数据
// 用户请求数据接口，第一次请求时，直接调用爬虫，将结果返回给用户，并且将结果存到数据库，同时，启动自动更新函数。
// 第二次请求时，请求数据接口的时间比数据库中存储的数据更新的时间大24小时，说明自动更新函数没有运行，则调用爬虫函数与自动更新函数。
// 当请求数据接口的时间比数据库中存储的数据更新的时间小24小时，说明自动更新函数在运行，此时直接返回数据库中保存的数据
app.use(async function(ctx, next) {
    if (ctx.request.path === "/interface" && ctx.request.method === "GET") {
        const body = ctx.request.query;
        let state = true;
        let resResult = null;
        const time = new Date();
        time.setHours(time.getHours() + 8);

        if (body.name && body.cid) {
            const confInfo = await UserSpliderConf.get(body.name, body.cid, false);

            //判断找到该用户
            if (confInfo.length < 1) {
                state = false;
                resResult = {
                    "state": state,
                    "time": time,
                    "data": "参数错误,未找到配置"
                }
            } else {
                const resultInfo = await Result.get({ cid: body.cid });
                let result = null;

                try {
                    //判断是不是第一次请求
                    //数据库中保存数据更新时间，避免程序意外重启之后，定时任务失效
                    //数据每天更新一次，请求时的时间比数据库中时间大24个小时，说明数据没有更新

                    //长度小于1，说明是在生成数据接口
                    if (resultInfo.length < 1) {
                        result = formatResult(await splider(confInfo[0].targetUrl, confInfo[0].targetTags, confInfo[0].classNum, confInfo[0].icontent, confInfo[0].mycharset, confInfo[0].mode, confInfo[0].startPage, confInfo[0].endPage, await getProxy(confInfo[0])));
                        const item = new Result({ cid: body.cid, result, time });
                        const myresult = await item.save();

                        //设置自动更新
                        autoUpdate(body.cid, confInfo[0]);

                        resResult = {
                            "state": state,
                            "time": time,
                            "data": myresult.result
                        };


                    } else if (Math.floor(((time.getTime() - resultInfo[0].time.getTime()) / (1000 * 60 * 60 * 24))) >= 1) {
                        //如果当前时间大于存储时间超过12个小时，则说明应用重启了，此时更新一波数据
                        result = formatResult(await splider(confInfo[0].targetUrl, confInfo[0].targetTags, confInfo[0].classNum, confInfo[0].icontent, confInfo[0].mycharset, confInfo[0].mode, confInfo[0].startPage, confInfo[0].endPage, await getProxy(confInfo[0])));

                        Result.update({ cid: body.cid }, { result, time });

                        //设置自动更新
                        autoUpdate(body.cid, confInfo[0]);

                        resResult = {
                            "state": state,
                            "time": time,
                            "data": result
                        };

                    } else {
                        //说明不是在生成数据接口，且数据更新时间小于12小时,且定时任务正确执行
                        resResult = {
                            "state": state,
                            "time": resultInfo[0].time,
                            "data": resultInfo[0].result
                        }
                    }
                } catch (e) {
                    state = false;
                    resResult = {
                        "state": state,
                        "time": time,
                        "data": `爬虫获取数据失败，失败详情:${e}`
                    }
                }
            }
        } else {
            state = false;
            resResult = {
                "state": state,
                "time": time,
                "data": `参数错误`
            }
        }

        //JSONP支持
        if (body.cb) {
            resResult = `${body.cb}(${JSON.stringify(resResult)})`;
        }

        ctx.response.body = resResult;
    } else {
        await next();
    }
});

//用户公布的数据接口
app.use(async function(ctx, next) {
    if (ctx.request.path === "/interface/public" && ctx.request.method === "GET") {
        ctx.response.body = (await UserSpliderConf.get(null, null, '1')).splice(0, 5);
    } else {
        await next();
    }
});

//所有分享的数据接口
app.use(async function(ctx, next) {
    if (ctx.request.path === "/interface/pub" && ctx.request.method === "GET") {
        let result = await UserSpliderConf.get(null, null, '1');

        ctx.response.body = {
            allpage: Math.ceil(result.length / 5),
            data: result.splice(parseInt(ctx.request.query.page) * 5, 5)
        };
    } else {
        await next();
    }
});

//用户数据链接管理
app.use(async function(ctx, next) {
    if (ctx.request.path === "/user" && ctx.request.method === "GET") {
        const body = ctx.request.query;
        //判断链接有无参数
        if (Object.keys(body).length > 0) {
            if (ctx.session.user === body.name) {
                ctx.response.body = await UserSpliderConf.get(ctx.session.user);
            }
        } else {
            ctx.response.type = "html";
            ctx.response.body = await fs.ReadStream(__dirname + "/public/html/UserDataManage.html")
        }
    } else {
        await next();
    }
});



//删除数据
app.use(async function(ctx, next) {
    if (ctx.request.path === "/todelete" && ctx.request.method === "GET") {
        const body = ctx.request.query;
        if (Object.keys(body).length > 0) {
            if (ctx.session.user === body.user) {
                ctx.response.body = await UserSpliderConf.delete({ cid: body.cid })
            }
        }
    } else {
        await next()
    }
})

//更新数据
app.use(async function(ctx, next) {
    if (ctx.request.path === "/toupdate" && ctx.request.method === "GET") {
        const body = ctx.request.query;
        if (Object.keys(body).length > 0) {
            if (ctx.session.user && body.cid) {
                const msg = {};
                if (body.msg) {
                    msg.msg = body.msg;
                }
                if (body.public) {
                    msg.public = body.public;
                }
                ctx.response.body = UserSpliderConf.update({ cid: body.cid }, msg)
            }
        }
    } else {
        await next();
    }
});

app.listen(process.env.PORT || 3000);