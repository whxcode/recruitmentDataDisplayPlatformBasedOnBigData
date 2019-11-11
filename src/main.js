// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import echarts from 'echarts'
import store from './store/index.js'
import axios from './axios/http'
import '@/assets/styles/iconfont.css'
import '@/assets/styles/nomalize.css'
import '@/assets/styles/border.css'
import '@/assets/styles/animate.css'

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.prototype.$axios = axios
require('echarts-wordcloud')


Vue.prototype.Events = { // 全局事件系统
    event:{

    },
    $on(name,fun) {  // 绑定事件
       this.event[name] = fun
    },
    $emit(name,data) { // 触发事件
      this.event[name](data)
    },
    $emitAll(city) {

      Object.keys(this.event).forEach(fun => {
          if(fun.includes('/')) {
              this.event[fun](city)
          }
      })
    }
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})


let fetchs = window.fetch

let fetch = function(url) {  // 适配器模式
  console.log(`请求啦`)
  return fetchs(url)
}

window.fetch = fetch
