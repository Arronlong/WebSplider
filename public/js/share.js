const sharepanel = new Vue({
    el: "#sharepanel",
    data: {
        allShare: [],
        allPages: 0
    },
    methods: {
        getshare(page) {
            const that = this;
            axios.get("/interface/pub", {
                params: {
                    page
                }
            }).then(res => {
                that.allShare = res.data.data;
                that.allPages = res.data.allpage;

                //获取到所有数据后，将第一个配置显示
                that.getdetial(res.data.data[0]);

                //处理sharepanel的UI

            })
        },
        getdetial(obj) {
            const that = this;
            const innerHtml =
                `<table>
                <tbody>
                    <tr>
                        <td colspan="2"><h2>配置详情</h2></td>
                    </tr>
                    <tr>
                        <td>URL</td>
                        <td>${obj.url}</td>
                    </tr>
                    <tr>
                        <td>CID</td>
                        <td>${obj.cid}</td>
                    </tr>
                    <tr>
                        <td>深度</td>
                        <td>${obj.classNum}</td>
                    </tr>
                    <tr>
                        <td>网页编码</td>
                        <td>${obj.mycharset}</td>
                    </tr>
                    <tr>
                        <td>模式</td>
                        <td>${obj.mode}</td>
                    </tr>
                    <tr>
                        <td>页码</td>
                        <td>起始页码:${obj.startPage} 终止页码:${obj.endPage}</td>
                    </tr>
                    <tr>
                        <td>选择器</td>
                        <td>${obj.targetTags}</td>
                    </tr>
                    <tr>
                        <td>目标网址</td>
                        <td>${obj.targetUrl}</td>
                    </tr>
                    <tr>
                        <td>备注</td>
                        <td>${obj.msg}</td>
                    </tr>
                    <tr>
                        <td>创建时间</td>
                        <td>${obj.time}</td>
                    </tr>
                    <tr>
                        <td>作者</td>
                        <td>${obj.user}</td>
                    </tr>
                </tbody>
            </table>`
            const shareconfig = document.getElementById("shareconfig");
            shareconfig.innerHTML = innerHtml;
        },
    }
})