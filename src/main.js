import Vue from 'vue'
import router from './router'
import App from './App'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../src/common/style/common.css'
import dateformat from '../src/common/mixin/dateformat'
Vue.use(ElementUI);

Vue.mixin(dateformat)
// import '../static/UE/ueditor.config.js'
// import '../static/UE/ueditor.all.min.js'
// import '../static/UE/lang/zh-cn/zh-cn.js'
// import '../static/UE/ueditor.parse.min.js'
// 引入echarts
// import echarts from 'echarts'
// Vue.prototype.$echarts = echarts

import api from './common/js/index'
Vue.prototype.$api = api;

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // render: h => h(App)
  components: { App },
  template: '<App/>'
})

