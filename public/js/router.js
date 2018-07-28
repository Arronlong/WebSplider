// 路由集
const routes = [{
    path: "/login",
    component: {
        template: '#login',
        data() {
            return {
                login_user: "",
                login_password: "",
                login_confirm: false,
            }
        },
        methods: {
            tologin() {
                let that = this;
                axios.get('/login', {
                        params: {
                            login_user: that.login_user,
                            login_password: that.login_password,
                        }
                    })
                    .then(function(response) {
                        if (response.data.state) {
                            store.commit('set_user', that.login_user);
                        } else {
                            that.login_confirm = true;
                        }
                    })
                    .catch(function(error) {
                        that.login_confirm = true;
                    });
            }
        }
    }
}, {
    path: "/register",
    component: {
        template: "#register",
        data() {
            return {
                register_user: "",
                register_password: "",
                register_repeat_password: "",
                reg_confirm: false
            }
        },
        methods: {
            toregister() {
                let that = this;
                axios.get('/register', {
                        params: {
                            register_user: that.register_user,
                            register_password: that.register_password,
                            register_repeat_password: that.register_repeat_password
                        }
                    })
                    .then(function(response) {
                        if (response.data.state) {
                            store.commit('set_user', that.register_user);
                        } else {
                            that.reg_confirm = true;
                        }
                    })
                    .catch(function(error) {
                        that.reg_confirm = true;
                    });

            }
        }
    }
}]


const router = new VueRouter({
    routes
})

//登录注册面板实例
const user_status = new Vue({
    el: "#loginOrgister",
    router,
    store,
    computed: {
        user() {
            return this.$store.state.user
        }
    }
})