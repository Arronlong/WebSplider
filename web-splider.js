const fs = require('fs');
const Koa = require('koa');
const path = require('path');
const koaBody = require('koa-body'); //koa本身无法解析post请求
const serve = require("koa-static"); //静态文件夹
const session = require('koa-session'); //存储session
const User = require("./model/user");
const UserSpliderConf = require("./model/splider");
const splider = require("./fun/splider");
const itime = require("./fun/time");
const CONFIG = require("./conf/session_conf");
const HOSTNAME = require("./conf/conf").HOSTNAME;
const app = new Koa();

//设置静态目录
app.use(serve(__dirname + "/public"));

//解析post提交(后来全改成get提交了，所以这个没有用到)
app.use(koaBody());

//应该是session加密用的
app.keys = ["I Love You"];
app.use(session(CONFIG, app));


//配置根目录
app.use(async function(ctx, next) {
    if (ctx.request.path === "/" && ctx.request.method === "GET") {
        ctx.response.type = 'html';
        ctx.response.body = await fs.ReadStream(__dirname + '/public/html/idx.html');
    } else {
        await next();
    }
});

//抓取预览
app.use(async function(ctx, next) {
    if (ctx.request.path === "/result" && ctx.request.method === "GET") {
        const body = ctx.request.query;
        //使用axios进行get数据传输。传输数组，返回的键值是下面这个
        const targetTags = body['targetTags[]'];
        if (!body.targetUrl || !targetTags || !body.icontent) {
            ctx.response.body = "输入不完整";
        } else {
            const targetTagsAry = typeof targetTags === "string" ? [targetTags] : targetTags;
            try {
                const icontent = JSON.parse(body.icontent);
                ctx.response.type = 'json';
                ctx.response.body = await splider(body.targetUrl, targetTagsAry, body.classNum, icontent);
            } catch (e) {
                ctx.response.body = "Something was wrong\n" + e;
            }
        }
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
            if (user && (body.login_password === user[0].password)) {
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
            const targetTags = body['targetTags[]'];
            if (!body.targetUrl || !targetTags || !body.icontent) {
                ctx.response.body = "保存失败,输入不完整";
            } else {
                const targetTagsAry = typeof targetTags === "string" ? [targetTags] : targetTags;
                try {
                    const icontent = JSON.parse(body.icontent);
                    const time = itime();
                    const cid = Date.now().toString();
                    const userconf = {
                        user: ctx.session.user,
                        targetUrl: body.targetUrl,
                        targetTags: targetTagsAry,
                        icontent: icontent,
                        classNum: body.classNum,
                        msg: '',
                        time: `${time.year}-${time.month}-${time.date}  ${time.hour}:${time.minute}:${time.second}`,
                        cid,
                        public: '2',
                        url: `${HOSTNAME}/interface?name=${ctx.session.user}&cid=${cid}`
                    };
                    const conf = new UserSpliderConf(userconf);
                    await conf.save();
                    ctx.response.body = userconf.url;
                } catch (e) {
                    ctx.response.body = "出现错误\n" + e;
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
app.use(async function(ctx, next) {
    if (ctx.request.path === "/interface" && ctx.request.method === "GET") {
        const body = ctx.request.query;
        if (body.name && body.cid) {
            const confInfo = await UserSpliderConf.get(body.name, body.cid, false);

            //判断找到该用户没有
            if (confInfo.length < 1) {
                ctx.response.body = "参数错误";
            } else {
                ctx.response.type = 'json';
                ctx.response.body = await splider(confInfo[0].targetUrl, confInfo[0].targetTags, confInfo[0].classNum, confInfo[0].icontent);
            }
        } else {
            ctx.response.body = "参数错误";
        }
    } else {
        await next();
    }
});

//用户公布的数据接口
app.use(async function(ctx, next) {
    if (ctx.request.path === "/interface/public" && ctx.request.method === "GET") {
        ctx.response.body = await UserSpliderConf.get(null, null, '1');
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
            ctx.response.body = await fs.ReadStream(__dirname + "/public/html/userdatamanage.html")
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