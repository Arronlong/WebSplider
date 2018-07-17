//Vuex
//全局状态，用户登录与否
const store = new Vuex.Store({
    //数据状态
    state: {
        user: ""
    },
    //修改数据状态的唯一入口
    //同步修改
    mutations: {
        set_user(state, user) {
            state.user = user;
        }
    },
    //支持异步调用
    //将返回结果通过mutattons修改数据
    actions: {
        set_user(context) {
            axios.get('/userstatus')
                .then(function(response) {
                    if (response.data) {
                        context.commit("set_user", response.data)
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    }
})