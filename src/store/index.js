import Vue from 'vue'
import Vuex from 'vuex'
import mapData from './mapData'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    mapData,
  }
})
