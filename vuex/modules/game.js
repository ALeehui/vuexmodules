// vuex/modules/game.js
import Vue from 'vue'
import * as types from '../mutation-types'
import * as Util from '../../util'

// 该模块的初始状态
const state = {
  editorID: 0,
  gameID: 0,
  uname: '',
  nickname: '',
  avatar: '',
  gameInfo: {},
  gamelist: [],
  giftlist: [],
  mgzdata: [],
  cdkey: ''
}

// 相关的 mutations
const mutations = {
  [types.INIT_USER] (state, data){
    let d = data.editor_info
    state.editorID = d.id
    state.uname = d.uname
    state.nickname = d.nickname
    state.avatar = d.avatar != '' ? d.avatar : ''
  },
  [types.GET_MGZ_DATA] (state, data){//初始敏感字数据
    data = JSON.parse(data)
    state.mgzdata = data.data
  },
  [types.GET_GAME_LIST] (state, data){
    if (data.games) {
      for (let i = 0; i < data.games.length; i++) {
        data.games[i].filetype = 'game'
      }
      data.games.sort(Util.sortById)
    }
    state.gamelist = data.games || []
  },
  [types.CREATE_GAME] (state, data){
    let d = data.game_info
    d.filetype = 'game'
    Vue.set(state.gamelist, state.gamelist.length, d)
  },
  [types.UPDATE_GAME] (state, data){
    let d = data.game_info
    d.filetype = 'game'
    let idx = Util.getIdx(state.gamelist, {id: d.id})
    if (idx >= 0) {
      state.gamelist.splice(idx, 1)
      state.gamelist.splice(idx, 0, d)
    }
    if (state.gameInfo.id == d.id) {
      state.gameInfo = d
    }
  },
  [types.REMOVE_GAME] (state, data){
    let idx = Util.getIdx(state.gamelist, {id: data.game_id})
    if (idx >= 0) {
      state.gamelist.splice(idx, 1)
    }
  },
  [types.INIT_GAME] (state, gameid){
    state.gameID = gameid
    let idx = Util.getIdx(state.gamelist, {id: gameid})
    if (idx >= 0) {
      state.gameInfo = state.gamelist[idx]
    }
  },
  [types.UPDATE_GAME_JSON] (state, data){
    state.gameInfo.json_time = data.time
  },
  [types.PUBLISH_GAME] (state, data){
    if (data.new_info) {
      data.new_info.audit = 1
      state.gameInfo = data.new_info
    }
  },
  [types.GET_GIFT_INFO] (state, data){
    state.giftlist = data.gifts
  },
  [types.CREATE_GIFT] (state, data){
    Vue.set(state.giftlist, state.giftlist.length, data.type_info)
  },
  [types.REMOVE_GIFT] (state, data){
    if (data.gift_id) {
      let idx = Util.getIdx(state.giftlist, {id: data.gift_id})
      if (idx >= 0) {
        state.giftlist.splice(idx, 1)
      }
    }
  },
  [types.GET_CDKEY] (state, data){
  },
  [types.UPLOAD_PIC] (state, data){
  }
}

export default {
  state,
  mutations
}
