//第二部分创建Vue实例
//爬虫抓取设置面板与预览面板
//classData保存诶个标签的数据。选择器这里需要根据用户选择的爬取深度来动态显示标签输入框的个数。使用v-for指令很好解决
//Vue监听输入框的数据。使用v-model指令很好解决
//但是v-for与v-model会造成每个条目绑定同一个数据，不符合要求
//这里我们将v-model绑定到数组项中,可以很好解决问题
//但是，新问题是当我选择了深度为2，同时标签1、2都输入数据之后，又选择深度为1，此时数组中数据却不能动态变化
//解决方法是:监听用户选择，删除数组中某一项
//我们这里由于业务逻辑的关系，可以直接控制数组长度即可。

const main = new Vue({
    el: "#main",
    store,
    data: {
        classNum: [1, 2, 3], //爬虫深度
        charSet: ['utf-8', 'gbk'], //编码类别
        charset: 'utf-8', //默认的网页编码
        modeSet: ['plain', 'pagination'], //抓取模式:普通与分页
        modeset: 'plain', //默认模式
        startPage: "", //分页模式起始页
        endPage: "", //分页模式尾页
        classData: [], //保存每个输入标签的数据
        classnum: 1, //用户选择的爬取深度,默认为1
        idx: 1, //深度默认选择1
        proxymodes: ['无代理', '西刺代理', '国外代理', '自定义代理'],
        proxymode: '无代理',
        inputproxy: '',
        targetUrl: '',
        targetTags: '',
        icontent: '',
        getdata: '',
        state: true
    },
    methods: {
        show() {
            let that = this;
            if (that.state) {
                that.state = false;
                that.getdata = "数据获取中,请等待...";
                //解决数组数据绑定失效问题
                that.classData.length = that.classnum;
                axios.get('/result', {
                        params: {
                            targetUrl: that.targetUrl,
                            targetTags: '' + that.classData,
                            icontent: that.icontent,
                            classNum: that.classnum,
                            mycharset: that.charset,
                            mode: that.modeset,
                            startPage: that.startPage,
                            endPage: that.endPage,
                            proxymode: that.proxymode,
                            inputproxy: that.inputproxy
                        }
                    })
                    .then(function(response) {
                        that.getdata = response.data;
                        that.state = true;
                    })
                    .catch(function(error) {
                        that.getdata = error;
                        that.state = true;
                    });
            } else {
                that.getdata = "不要着急，请耐心等待...";
            }

        },
        createInterface() {
            let that = this;
            axios.get('/save', {
                    params: {
                        targetUrl: that.targetUrl,
                        targetTags: '' + that.classData,
                        icontent: that.icontent,
                        classNum: that.classnum,
                        mycharset: that.charset,
                        mode: that.modeset,
                        startPage: that.startPage,
                        endPage: that.endPage,
                        proxymode: that.proxymode,
                        inputproxy: that.inputproxy
                    }
                })
                .then(function(response) {
                    try {
                        if (response.data.state) {
                            const page = window.open(response.data.data, '_blank');
                            if (page.closed) {
                                alert("接口地址为\n" + response.data.data);
                            }
                        } else {
                            alert(response.data.data);
                        }
                    } catch (e) {
                        alert("接口地址为\n" + response.data.data);
                    }
                })
                .catch(function(error) {
                    console.log('接口响应错误', error);
                });
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    }
})