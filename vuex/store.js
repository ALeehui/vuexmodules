// vuex/store.js
import Vue from 'vue'
import Vuex from 'vuex'
// 导入各个模块的初始状态和 mutations
import game from './modules/game'
import view from './modules/view'
import drama from './modules/drama'

Vue.use(Vuex)

export default new Vuex.Store({
  // 组合各个模块
  modules: {
    game, view, drama
  }
})
