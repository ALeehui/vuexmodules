// drama actions
import Vue from 'vue'
import {NET_API} from '../api'
import {COMP_VIEW} from '../api'
import {page2scene} from '../util'
import * as types from './mutation-types'
import {getBaseUrl} from './gameActions'
import {startLoad} from './gameActions'
import {closeLoad} from './gameActions'
import {startReq} from './gameActions'
import {getADPic} from './gameActions'
import {getCompInfo} from './viewActions'
import {getWordStyle} from './viewActions'

export const setCurr = makeAction(types.SET_CURR)
export const setCurrJq = makeAction(types.SET_CURR_JQ)
export const setCurrPage = makeAction(types.SET_CURR_PAGE)
export const setCurrOpt = makeAction(types.SET_CURR_OPT_IDX)
export const setCurrIdx = makeAction(types.SET_CURR_IDX)
export const setFreeSel = makeAction(types.SET_FREE_SEL)
export const addCurrSel = makeAction(types.ADD_CURR_SEL)
export const removeCurrSel = makeAction(types.REMOVE_CURR_SEL)
export const cleanSel = makeAction(types.CLEAN_SEL)
export const setTemp = makeAction(types.SET_TEMP)
export const removeTemp = makeAction(types.REMOVE_TEMP)
export const popEdit = makeAction(types.POP_EDIT)

function makeAction(type) {
  return ({ dispatch }, ...args) => dispatch(type, ...args)
}

var vm
var gameid = 1

export const initJq = ({dispatch}, gid, vue) => {
  gameid = gid ? gid : gameid
  vm = vue ? vue : vm
  let req = getBaseUrl() + NET_API.GET_JQING_LIST
  startReq({dispatch}, types.INIT_JUQING, req, {}, gameid)
  //获取通用&开始页的组件资源
  getCompInfo({dispatch}, 0)
  getCompInfo({dispatch}, 1)
  getCompInfo({dispatch}, page2scene[1])
  getADPic({dispatch}, 0)
  //获取游戏主界面文字样式
  getWordStyle({dispatch})
}

export const getDramaList = ({dispatch}, pid, type, id, optidx, getmore) => {
  startLoad()
  if (!optidx) {
    optidx = -1
  }
  let req = getBaseUrl() + NET_API.GET_DRAMA_LIST
  let reqdata = type == 'story' ? {story_id: id} : {question_id: id}
  reqdata.limit = getmore || null
  Vue.http.post(req, reqdata).then(
    function (data) {
      closeLoad()
      let d = JSON.parse(data.data).data[0]
      dispatch(types.GET_DRAMA_LIST, d, optidx, getmore)
      //检测当前列表是否全部获取并通知相应列表
      optidx = Math.max(0, optidx)
      if (d.story.length + d.question.length < 20) {
        vm.$dispatch('locMsg', {notice: 'loadAll', pid: pid, opt: optidx, state: true})
      } else {
        vm.$dispatch('locMsg', {notice: 'loadAll', pid: pid, opt: optidx, state: false})
      }
    },
    function (data) {
      vm.$dispatch('locMsg', {notice: 'showAlert', show: true, word: '3001 请求失败'})
    }
  )
}

export const createStory = ({dispatch}, story) => {
  let req = getBaseUrl() + NET_API.CREATE_STORY
  startReq({dispatch}, types.CREATE_ITEM, req, story, story)
}

export const updateStory = ({dispatch}, data) => {
  let req = getBaseUrl() + NET_API.UPDATE_STORY
  startReq({dispatch}, types.UPDATE_ITEM, req, data, data)
}

export const removeStory = ({dispatch}, story) => {
  let req = getBaseUrl() + NET_API.REMOVE_STORY
  startReq({dispatch}, types.REMOVE_ITEM, req, {story_id: story.id}, story)
}

export const createOption = ({dispatch}, option) => {
  let req = getBaseUrl() + NET_API.CREATE_OPTION
  startReq({dispatch}, types.CREATE_ITEM, req, option, option)
}

export const updateOption = ({dispatch}, data) => {
  let req = getBaseUrl() + NET_API.UPDATE_OPTION
  startReq({dispatch}, types.UPDATE_ITEM, req, data, data)
}

export const removeOption = ({dispatch}, option) => {
  let req = getBaseUrl() + NET_API.REMOVE_OPTION
  startReq({dispatch}, types.REMOVE_ITEM, req, {q_id: option.id}, option)
}

export const removeOpt = ({dispatch}, opt) => {
  let req = getBaseUrl() + NET_API.REMOVE_OPTION_OPT
  startReq({dispatch}, types.REMOVE_OPT, req, opt, opt)
}

export const pasteItem = ({dispatch}, data) => {
  let req = getBaseUrl() + NET_API.PASTE_ITEM
  startReq({dispatch}, types.PASTE_ITEM, req, data, data)
}

export const removeMulti = ({dispatch}, data) => {
  let req = getBaseUrl() + NET_API.MULTI_REMOVE
  startReq({dispatch}, types.REMOVE_ITEM, req, data, data)
}

export const batchCreate = ({dispatch}, data) => {
  let req = getBaseUrl() + NET_API.BATCH_CREATE
  startReq({dispatch}, types.BATCH_CREATE, req, data, data)
}

export const createJq = ({dispatch}, jq) => {
  let req = getBaseUrl() + NET_API.CREATE_JQING
  startReq({dispatch}, types.CREATE_JUQING, req, jq)
}

export const renameJq = ({dispatch}, jq) => {
  let req = getBaseUrl() + NET_API.RENAME_JQING
  startReq({dispatch}, types.RENAME_JUQING, req, jq, jq)
}

export const removeJq = ({dispatch}, data, jq) => {
  let req = getBaseUrl() + NET_API.REMOVE_JQING
  startReq({dispatch}, types.REMOVE_JUQING, req, data, jq)
}

export const copyJq = ({dispatch}, data) => {
  let req = getBaseUrl() + NET_API.COPY_JQING
  startReq({dispatch}, types.COPY_JUQING, req, data)
}
