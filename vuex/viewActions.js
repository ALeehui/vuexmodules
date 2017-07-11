// view actions
import Vue from 'vue'
import {NET_API} from '../api'
import * as types from './mutation-types'
import {getBaseUrl, startReq} from './gameActions'

export const setBgSize = makeAction(types.SET_BG_SIZE)
export const setTestRes = makeAction(types.SET_TEST_RES)

function makeAction(type) {
  return ({ dispatch }, ...args) => dispatch(type, ...args)
}

var vm

export const getCompInfo = ({dispatch}, sceneid, vue) => {
  vm = vue ? vue : vm
  let req = getBaseUrl() + NET_API.GET_COMP_INFO
  startReq({dispatch}, types.GET_VIEW_INFO, req, {scene_id: sceneid})
}

export const saveCompInfo = ({dispatch}, data) => {
  let req = getBaseUrl() + NET_API.SAVE_COMP_INFO
  startReq({dispatch}, types.SAVE_VIEW_INFO, req, data, data)
}

export const getWordStyle = ({dispatch}, data) => {
  let req = getBaseUrl() + NET_API.GET_WORD_STYLE
  startReq({dispatch}, types.GET_WORD_STYLE, req, data)
}

export const saveWordStyle = ({dispatch}, data) => {
  let req = getBaseUrl() + NET_API.SAVE_WORD_STYLE
  startReq({dispatch}, types.SAVE_WORD_STYLE, req, data)
}
