        //第一部分、用户公开的接口数据
        const show = new Vue({
            el: "#left",
            data: {
                linkdata: []
            },
            methods: {
                getPublicData() {
                    const that = this;
                    axios.get("/interface/public").then((res) => {
                        that.linkdata = res.data;
                    }).catch(err => console.log(err));
                }
            }

        })