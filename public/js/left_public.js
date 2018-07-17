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
                        for (let i = res.data.length - 1; i >= 0; i--) {
                            that.linkdata.push(res.data[i]);
                        }
                    }).catch(err => console.log(err));
                }
            }

        })