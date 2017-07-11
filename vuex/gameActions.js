// game actions
import Vue from 'vue'
import {NET_API} from '../api'
import * as Cfg from '../cfg'
import * as types from './mutation-types'
import {getDramaList} from './dramaActions'
import {updateStory} from './dramaActions'
import {updateOption} from './dramaActions'
import {removeMulti} from './dramaActions'

var vm
var editorid = 1
var gameid = -1

var upload = false    //是否正在上传

export const userLogin = ({dispatch}, data, vue) => {
  vm = vue ? vue : vm
  startLoad()
  Vue.http.post(Cfg.apiLogin, data).then(
    function (data) {
      closeLoad()
      let d = JSON.parse(data.data)
      if (d.msg) {
        showAlert(d.msg)
        return
      }
      dispatch(types.INIT_USER, d)
      if (d.editor_info) {
        vm.$broadcast('showGameLogin', {show: false})
      }
      getGameList({dispatch}, {editor_id: d.editor_info.id})
    },
    function (data) {
      closeLoad()
      showAlert('登陆失败')
    }
  )
}

export const userRegister = ({dispatch}, data, vue) => {
  vm = vue ? vue : vm
  startLoad()
  Vue.http.post(Cfg.apiReg, data).then(
    function (data) {
      closeLoad()
      let d = JSON.parse(data.data)
      if (d.msg) {
        showAlert(d.msg)
        return
      }
      dispatch(types.INIT_USER, d)
      if (d.editor_info) {
        vm.$broadcast('showGameLogin', {show: false})
      }
      getGameList({dispatch}, {editor_id: d.editor_info.id})
    },
    function (data) {
      closeLoad()
      showAlert('注册失败')
    }
  )
}

export const getGameList = ({dispatch}, data) => {
  editorid = data.editor_id
  let req = getBaseUrl() + NET_API.GET_GAME_LIST
  startReq({dispatch}, types.GET_GAME_LIST, req, data)
  getPublicRes({dispatch})
  getMGZ({dispatch})
}

export const createGame = ({dispatch}, data) => {
  let req = getBaseUrl() + NET_API.CREATE_GAME
  startReq({dispatch}, types.CREATE_GAME, req, data)
}

export const updateGame = ({dispatch}, data) => {
  let req = getBaseUrl() + NET_API.UPDATE_GAME
  startReq({dispatch}, types.UPDATE_GAME, req, data)
}

export const removeGame = ({dispatch}, data) => {
  let req = getBaseUrl() + NET_API.REMOVE_GAME
  startReq({dispatch}, types.REMOVE_GAME, req, data)
}

export const getPublicRes = ({dispatch}) => {
  Vue.http.get(Cfg.resJson).then(
    function (data) {
      //请求成功回调
      let d = JSON.parse(data.data)
      dispatch(types.GET_PUBLIC_RES, d)
    },
    function (data) {
      showAlert('获取公共素材json失败')
    }
  )
}

export const getMGZ = ({dispatch}) => {
  Vue.http.get(Cfg.mgzJson).then(
    function (data) {
      //请求成功回调
      let d = data.data
      dispatch(types.GET_MGZ_DATA, d)
    },
    function (data) {
      showAlert('mgzjson failed')
    }
  )
}

export const uploadPic = ({dispatch}, data) => {
  upload = true
  let req = getBaseUrl() + NET_API.UPLOAD_PIC
  startReq({dispatch}, types.UPLOAD_PIC, req, data)
}

export const removePic = ({dispatch}, data, filedata) => {
  let req = getBaseUrl() + NET_API.REMOVE_PIC
  startReq({dispatch}, types.REMOVE_PIC, req, data, filedata)
}

export const removeSound = ({dispatch}, data, filedata) => {
  let req = getBaseUrl() + NET_API.REMOVE_SOUND
  startReq({dispatch}, types.REMOVE_SOUND, req, data, filedata)
}

export const removeRecent = ({dispatch}, data) => {
  dispatch(types.REMOVE_RECENT, data)
}

export const getADPic = ({dispatch}, data) => {
  let req = getBaseUrl() + NET_API.GET_AD_PIC
  startReq({dispatch}, types.GET_AD_PIC, req, data)
}

export const uploadADPic = ({dispatch}, data) => {
  upload = true
  let req = getBaseUrl() + NET_API.UPLOAD_AD_PIC
  startReq({dispatch}, types.UPLOAD_AD_PIC, req, data, data)
}

export const initGame = ({dispatch}, gid) => {
  gameid = gid ? gid : gameid
  dispatch(types.INIT_GAME, gameid)
}

export const addPrivateRes = ({dispatch}, data) => {
  dispatch(types.ADD_PRIVATE_RES, data)
}

export const getPrivatePic = ({dispatch}, data) => {
  let req = getBaseUrl() + NET_API.GET_PRIVATE_PIC
  let restype = data.width + 'x' + data.height
  if (data.type) {
    restype = data.type + ' ' + restype
  }
  startReq({dispatch}, types.GET_PRIVATE_RES, req, data, restype)
}

export const getPrivateSound = ({dispatch}, data) => {
  let req = getBaseUrl() + NET_API.GET_PRIVATE_SOUND
  startReq({dispatch}, types.GET_PRIVATE_RES, req, data, data.type)
}

export const getRecentPic = ({dispatch}, data)=> {
  let req = getBaseUrl() + NET_API.GET_RECENT_PIC
  let restype = data.width + 'x' + data.height
  if (data.type) {
    restype = data.type + ' ' + restype
  }
  startReq({dispatch}, types.GET_RECENT_PIC, req, data, restype)
}

export const getRecentSound = ({dispatch}, data)=> {
  let req = getBaseUrl() + NET_API.GET_RECENT_SOUND
  startReq({dispatch}, types.GET_RECENT_SOUND, req, data, data.type)
}

export const getGiftInfo = ({dispatch}, data) => {
  let req = getBaseUrl() + NET_API.GET_GIFT_INFO
  startReq({dispatch}, types.GET_GIFT_INFO, req, data)
}

export const createGift = ({dispatch}, data) => {
  let req = getBaseUrl() + NET_API.CREATE_GIFT
  startReq({dispatch}, types.CREATE_GIFT, req, data)
}

export const removeGift = ({dispatch}, data) => {
  let req = getBaseUrl() + NET_API.REMOVE_GIFT
  startReq({dispatch}, types.REMOVE_GIFT, req, data)
}

export const getCDKey = ({dispatch}, data) => {
  startLoad()
  Vue.http.post(Cfg.apiGetKey, data).then(
    function (data) {
      closeLoad()
      vm.$broadcast('exportCDKey', {cdkey: data.body})
    },
    function (data) {
      closeLoad()
      showAlert('CDKEY导出失败')
    }
  )
}

export const updateGameJson = ({dispatch}) => {
  let req = getBaseUrl() + NET_API.UPDATE_GAME_JSON
  startReq({dispatch}, types.UPDATE_GAME_JSON, req, {game_id: gameid})
}

export const publishGame = ({dispatch}) => {
  let req = getBaseUrl() + NET_API.PUBLISH_GAME
  startReq({dispatch}, types.PUBLISH_GAME, req, {game_id: gameid})
}

export const startReq = ({dispatch}, type, req, param, senddata) => {
  startLoad()
  let currapi = parseInt(req.split('/')[req.split('/').length - 1])
  Vue.http.post(req, param).then(
    function (data) {
      //请求成功回调
      if (currapi != NET_API.GET_JQING_LIST) {
        closeLoad()
      }
      let d = JSON.parse(data.data)
      d = d.ret == 1 ? d.data[0] : d

      if (type != '') {
        dispatch(type, d, senddata)
      }

      switch (currapi) {
        case NET_API.GET_GAME_LIST:
          vm.$broadcast('showGameList', {show: true})
          break;
        case NET_API.GET_JQING_LIST:
          for (let i = 0; i < d.thread.length; i++) {
            let ob = d.thread[i]
            if (ob.is_main == 1) {
              getDramaList({dispatch}, 0, ob.first_type, ob.first_id)
              break;
            }
          }
          break
        case NET_API.CREATE_STORY:
          if (d.story) {
            //vm.$broadcast('showEdit', {type: "word"})
          }
          break
        case NET_API.CREATE_OPTION://创建选项完成后立即弹出编辑框
          if (d.question) {
            vm.$broadcast('showEdit', {show: true, type: "option"})
          }
          break
        case NET_API.PASTE_ITEM:
          if (senddata.type == 2) {
            delete senddata.all
            senddata.cut = true
            removeMulti({dispatch}, senddata)
          }
          break
        case NET_API.BATCH_CREATE:
          //getDramaList({dispatch}, 0, senddata.first_type, senddata.first_id)
          break
        case NET_API.UPDATE_GAME_JSON:
          if (d.state == 0) {
            showAlert('配置数据更新成功！')
          } else {
            showAlert(d[0] || d[1])
          }
          break
        case NET_API.UPLOAD_PIC:
          if (d.id) {
            vm.$broadcast('uploadPicSuc', {id: d.id})
          }
          upload = false
          break
        case NET_API.UPLOAD_AD_PIC:
          vm.$broadcast('showEditRes', {show: false})
          upload = false
          break;
        case NET_API.GET_PRIVATE_PIC:
        case NET_API.GET_PRIVATE_SOUND:
          vm.$broadcast('getResSuc')
          break
        case NET_API.REMOVE_PIC:
        case NET_API.REMOVE_SOUND:
          if (d.msg && d.state == 1) {
            setTimeout(function () {
              showAlert(d.msg)
            }, 1000)
            return
          }
          if (currapi == NET_API.REMOVE_PIC) {
            getPrivatePic({dispatch}, {type: senddata.type, width: senddata.width, height: senddata.height})
          } else {
            getPrivateSound({dispatch}, {type: senddata.type})
          }
          removeRecent({dispatch}, senddata)
          break
        case NET_API.REMOVE_GIFT:
          if (d.msg && d.state == 1) {
            showAlert(d.msg)
          }
          break;
      }
    },
    function (data) {
      closeLoad()
      showAlert(currapi + ' 请求失败')
    }
  )
}

export const showAlert = (msg)=> {
  vm.$broadcast('showAlert', {show: true, word: msg})
}

export const getBaseUrl = ()=> {
  let gamedata = gameid > 0 ? 'game_id/' + gameid + '/' : ''
  return Cfg.apiUrl + editorid + '/' + gamedata + 't/'
}

export const startLoad = () => {
  vm.$broadcast('showLoad', {show: true, word: (upload ? '图片上传中...' : null)})
}

export const closeLoad = () => {
  vm.$broadcast('showLoad', {show: false})
}
