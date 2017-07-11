// vuex/modules/view.js
import Vue from 'vue'
import * as types from '../mutation-types'
import * as Util from '../../util'

// 该模块的初始状态
const state = {
  bgSize: {w: 0, h: 0, scale: 1},
  bgPopSize: {w: 0, h: 0, scale: 1},
  //组件信息(作品中实际尺寸&位置，基于480*852屏，-1时表示值不固定，属性前加m或p如mtop、pleft表示margin和padding)
  //每种类型无论是否需要背景都必须包含一个bg数据
  compInfo: {
    public: {
      //公共资源
      bg: {w: 480, h: 852},
      life: {name: '复活道具', w: 70, h: 70}
    },
    ad: {
      //推广资源
      bimg: {name: '首页轮播图', w: 640, h: 280},
      rimg: {name: '首页推荐图', w: 200, h: 265},
      himg: {name: '首页热门图', w: 260, h: 150},
      icon: {name: '排行页前三图', w: 135, h: 135},
      pimg: {name: '排行页排行图', w: 200, h: 150},
      img: {name: '详情页详细图', w: 640, h: 400},
      pic1: {name: '详情页介绍图-1', w: 480, h: 852},
      pic2: {name: '详情页介绍图-2', w: 480, h: 852},
      pic3: {name: '详情页介绍图-3', w: 480, h: 852},
      pic4: {name: '详情页介绍图-4', w: 480, h: 852}
    },
    alert: {
      //通用弹框资源
      bg: {w: 480, h: 852, noImg: true},
      alertbg: {name: '通用弹框面板', w: 420, h: 260},
      confirm: {name: '确认按钮', w: 130, h: 50, mleft: 30, mtop: 270},
      cancel: {name: '取消按钮', w: 130, h: 50, mleft: 260, mtop: 270},
      save: {name: '存储提示内容', w: 340, h: 180, left: 40, top: 40},
      load: {name: '读取提示内容', w: 340, h: 180, left: 40, top: 40},
      cover: {name: '覆盖提示内容', w: 340, h: 180, left: 40, top: 40},
      retry: {name: '重试剧情提示内容', w: 340, h: 180, left: 40, top: 40},
      send: {name: '赠送提示内容', w: 340, h: 180, left: 40, top: 40},
      get: {name: '获得赠送提示内容', w: 340, h: 180, left: 40, top: 40},
      quit: {name: '退出作品提示内容', w: 340, h: 180, left: 40, top: 40}
    },
    load: {
      //加载页
      bg: {w: 480, h: 852, noImg: true},
      logo: {name: '作品logo', w: 160, h: 160, left: 'center', top: 220},
      tips: {name: '加载文字提示', w: -1, h: 20, left: 'center', top: 560},
      probg: {name: '进度条背景', w: 420, h: 48, left: 'center', top: 590},
      probar: {name: '进度条', w: 400, h: 28, left: 'center', top: 600}
    },
    start: {
      //开始页
      bg: {name: '开始页背景', w: 480, h: 852},
      start: {name: '作品开始按钮', w: 210, h: 60, left: 30, top: 550},
      load: {name: '读取进度按钮', w: 210, h: 60, left: 250, top: 550},
      info: {name: '作品介绍按钮', w: 210, h: 60, left: 30, top: 640},
      more: {name: '更多作品按钮', w: 210, h: 60, left: 250, top: 640}
    },
    intro: {
      //介绍页
      bg: {name: '介绍页背景', w: 480, h: 852},
      introtitle: {name: '介绍页标题', w: -1, h: 60, left: 'center', top: 40},
      content: {name: '介绍内容文本', w: 420, h: 180, left: 'center', top: 140, noImg: true},
      back: {name: '返回按钮', w: 200, h: 64, left: 'center', top: 720},
    },
    menu: {
      //菜单页
      bg: {name: '菜单页背景', w: 480, h: 852},
      menutitle: {name: '菜单页标题', w: -1, h: 60, left: 'center', top: 40},
      save: {name: '存档按钮', w: 460, h: 80, left: 'center', top: 120},
      load: {name: '读档按钮', w: 460, h: 80, left: 'center', top: 240},
      music: {name: '音乐按钮', w: 460, h: 80, left: 'center', top: 360},
      sound: {name: '音效按钮', w: 460, h: 80, left: 'center', top: 480},
      quit: {name: '退出作品按钮', w: 460, h: 80, left: 'center', top: 600},
      tick: {name: '勾选标记', w: 32, h: 32, left: 40, top: 25},
      back: {name: '返回按钮', w: 200, h: 64, left: 'center', top: 720}
    },
    save: {
      //存档页
      bg: {name: '存档页背景', w: 480, h: 852},
      savetitle: {name: '存档页标题', w: -1, h: 60, left: 'center', top: 40},
      ritembg: {name: '存档条目背景', w: 440, h: 126, left: 'center', top: 120},
      info: {name: '存档页文本', w: 200, h: 100, mleft: 160, mtop: 18, noImg: true},
      infobig: {name: '存档信息文本', noImg: true},
      itembg2: {name: '存档位开启按钮背景', w: 440, h: 126, left: 'center', top: 120},
      itembg3: {name: '存档位开启按钮背景', w: 440, h: 126, left: 'center', top: 120},
      scene1: {name: '存档场景图1', w: 130, h: 92, mleft: 20, mtop: 17},
      scene2: {name: '存档场景图2', w: 130, h: 92, mleft: 20, mtop: 17},
      back: {name: '返回按钮', w: 200, h: 64, left: 'center', top: 720}
    },
    friend: {
      //好友页
      bg: {name: '好友页背景', w: 480, h: 852},
      friendtitle: {name: '好友页标题', w: -1, h: 60, left: 'center', top: 40},
      fitembg: {name: '好友条目背景', w: 440, h: 126, left: 'center', top: 120},
      headbg: {name: '头像背景', w: 80, h: 80, mleft: 22, mtop: 23},
      info: {name: '好友信息文本', w: 180, h: 80, mleft: 120, mtop: 23, noImg: true},
      add: {name: '加好友按钮', w: 100, h: 40, mleft: 310, mtop: 22},
      send: {name: '赠送按钮', w: 100, h: 40, mleft: 310, mtop: 68},
      sended: {name: '已赠送标记', w: 100, h: 40, mleft: 310, mtop: 43},
      back: {name: '返回按钮', w: 200, h: 64, left: 'center', top: 720}
    },
    shop: {
      //商城页
      bg: {name: '商城页背景', w: 480, h: 852},
      shoptitle: {name: '商城页标题', w: -1, h: 60, left: 'center', top: 40},
      tips: {name: '道具数量提示文本', w: 480, h: 30, top: 230, noImg: true},
      listbg: {name: '商城物品列表背景', w: 420, h: 630, left: 'center', top: 120},
      itembg: {name: '物品条目背景', w: 382, h: 80, left: 19, top: 160},
      iconbig: {name: '复活道具图标', w: 80, h: 80, left: 'center', top: 135},
      icon: {name: '倒计时图标', w: 60, h: 60, left: 20, top: 10},
      icon2: {name: '复活道具图标', w: 60, h: 60, left: 20, top: 10},
      info1: {name: '商城面板文本', w: 160, h: 60, left: 100, top: 10, noImg: true},//倒计时信息
      info2: {name: '商城面板文本', w: 160, h: 30, left: 100, top: 25, noImg: true},//道具信息
      info3: {name: '商城面板文本', w: 160, h: 30, left: 25, top: 25, noImg: true},//CDKey信息
      cdkey: {name: 'CDKey面板', w: 382, h: 236, left: 19, top: 330},
      inputbg: {name: 'CDKey输入框', w: 336, h: 30, left: 23, top: 112},
      buy: {name: '购买按钮', w: 100, h: 40, left: 274, top: 20},
      get: {name: '领取按钮', w: 100, h: 40, left: 274, top: 20},
      confirm: {name: '确认购买按钮', w: 100, h: 40, left: 274, top: 20},
      back: {name: '返回按钮', w: 200, h: 64, left: 'center', top: 720}
    },
    drama: {
      //剧情页
      bg: {name: '场景', w: 480, h: 852},
      head: {name: '状态栏背景', w: 230, h: 90, left: 20, top: 20},
      headicon: {name: '状态栏头像', w: 80, h: 80, mleft: 5, mtop: 5},
      life: {name: '复活道具', w: 24, h: 24, mleft: 93, mtop: 46},
      add: {name: '复活道具增加按钮', w: 26, h: 26, mleft: 180, mtop: 46},
      nickname: {name: '状态栏用户昵称文本', w: 120, mleft: 108, mtop: 20, noImg: true},
      itemnum: {name: '状态栏用户道具数量文本', w: 60, mleft: 115, mtop: 46, noImg: true},
      friend: {name: '好友按钮', w: 75, h: 76, left: 380, top: 30},
      menu: {name: '菜单按钮', w: 75, h: 76, left: 380, top: 120},
      end: {name: '返回主界面按钮', w: 240, h: 80, left: 'center', mtop: 326},
      retry: {name: '重试剧情按钮', w: 240, h: 80, left: 'center', mtop: 446},
      avatar: {name: '立绘', w: -1, h: 700, left: 'center', top: 152},
      namebg: {name: '角色名框', w: 160, h: 40, left: 10, top: 600},
      down: {name: '对话点击提示', w: 32, h: 32, left: 430, top: 150},
      dialog: {name: '对话框', textname: '剧情对话框文本', w: 480, h: 200, top: 652},
      select: {name: '选项按钮', textname: '剧情选项文本', w: 436, h: 53, top: 310, left: 'center'}
    }
  },
  //0：通用页  1：弹框页	 2：加载页	 3：开始页	 4：介绍页	 5：存档页 6：菜单页 7：道具页	 8：好友页
  viewRes: {
    0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {}, 8: {}
  },
  //推广资源素材
  adRes: {bimg: '', rimg: '', himg: '', icon: '', img: '', pimg: '', pic1: '', pic2: '', pic3: '', pic4: ''},
  wordStyle: {},
  publicRes: {},
  privateRes: {},
  recentRes: {},
  testRes: {comp: '', page: 9, resid: '0'}
}

// 相关的 mutations
const mutations = {
  [types.GET_PUBLIC_RES] (state, data){//初始化公共资源
    let res = {}
    for (let k = 0; k < data.length; k++) {
      let rdata = data[k].data
      for (let i = 0; i < rdata.length; i++) {
        let d = rdata[i]
        d.filetype = d.name.indexOf('.mp3') >= 0 ? 'sound' : 'pic'
        let restype = d.filetype == 'pic' ? d.type + ' ' + d.width + 'x' + d.height : d.type

        if (!res[restype]) {
          res[restype] = {'全部': [[]]}//分素材类型
        }
        if (!res[restype][d.style]) {
          res[restype][d.style] = [[]]//分类style
        }

        let alllen = res[restype]['全部'].length
        let stllen = res[restype][d.style].length

        //单页最大显示数量
        let max = (restype == '背景音乐' || d.filetype == 'pic') ? Util.pageFileNum().num : Util.popFileNum().num

        if (res[restype]['全部'][alllen - 1].length >= max) {
          res[restype]['全部'].push([])//分页
        }
        if (res[restype][d.style][stllen - 1].length >= max) {
          res[restype][d.style].push([])//分页
        }

        alllen = res[restype]['全部'].length
        stllen = res[restype][d.style].length

        res[restype]['全部'][alllen - 1].push(d)
        res[restype][d.style][stllen - 1].push(d)
      }
    }
    state.publicRes = res
  },
  //获取私有素材
  [types.GET_PRIVATE_RES] (state, data, restype){
    //单页最大显示数量
    let max = (restype == '背景音乐' || data.pics) ? Util.pageFileNum().num : Util.popFileNum().num
    let myres = data.pics || data.sounds
    let res = {'全部': [[]]}
    myres.sort(Util.sortById)
    for (let i = 0; i < myres.length; i++) {
      let d = myres[i]
      d.filetype = data.pics ? 'pic' : 'sound'

      if (!res[d.style]) {
        res[d.style] = [[]]//分类style
      }

      let alllen = res['全部'].length
      let stllen = res[d.style].length

      if (res['全部'][alllen - 1].length >= max) {
        res['全部'].push([])
      }
      if (res[d.style][stllen - 1].length >= max) {
        res[d.style].push([])
      }

      alllen = res['全部'].length
      stllen = res[d.style].length

      res['全部'][alllen - 1].push(d)
      res[d.style][stllen - 1].push(d)
    }
    Vue.set(state.privateRes, restype, res)
  },
  [types.ADD_PRIVATE_RES] (state, data){
    let newres = data.pic || data.sound
    let restype = data.pic ? newres.type + ' ' + newres.width + 'x' + newres.height : newres.type
    //单页最大显示数量
    let max = (restype == '背景音乐' || data.pic) ? Util.pageFileNum().num : Util.popFileNum().num
    let style = newres.style
    let res = state.privateRes
    if (!res[restype]) {
      res[restype] = {'全部': [[newres]]}
      res[restype][style] = [[newres]]
    } else {
      let d = res[restype]['全部']
      if (d[d.length - 1].length == max) {
        res[restype]['全部'].push([])
      }
      res[restype]['全部'][d.length - 1].push(newres)

      if (!res[restype][style]) {
        res[restype][style] = [[newres]]
      } else {
        let d = res[restype][style]
        if (d[d.length - 1].length == max) {
          res[restype][style].push([])
        }
        res[restype][style][d.length - 1].push(newres)
      }
    }
    state.privateRes = res
  },
  [types.GET_RECENT_PIC] (state, data, restype){
    let max = Util.pageFileNum().num
    let myres = data.pics
    if (myres.length == 0) {
      Vue.set(state.recentRes, restype, [[]])
      return
    }
    let res = [[]]
    for (let i = 0; i < myres.length; i++) {
      let d = myres[i]
      d.filetype = 'pic'
      d.id = d.pic_id

      let len = res.length
      if (res[len - 1].length >= max) {
        res.push([])
        len++
      }
      res[len - 1].push(d)
    }
    Vue.set(state.recentRes, restype, res)
  },
  [types.GET_RECENT_SOUND] (state, data, restype){
    let max = restype == '背景音乐' ? Util.pageFileNum().num : Util.popFileNum().num
    let myres = data.sounds
    if (myres.length == 0) {
      Vue.set(state.recentRes, restype, [[]])
      return
    }
    let res = [[]]
    for (let i = 0; i < myres.length; i++) {
      let d = myres[i]
      d.filetype = 'sound'
      d.id = d.sound_id

      let len = res.length
      if (res[len - 1].length >= max) {
        res.push([])
        len++
      }
      res[len - 1].push(d)
    }
    Vue.set(state.recentRes, restype, res)
  },
  [types.REMOVE_RECENT] (state, data){
    let allres = $.extend(true, {}, state.recentRes)
    let restype = data.filetype == 'pic' ? data.type + ' ' + data.width + 'x' + data.height : data.type
    let res = allres[restype]
    let hasDel = false

    for (let i = 0; i < res.length; i++) {
      if (hasDel) {
        res[i].splice(0, 1)
        if (i < res.length - 1) {
          res[i].push(res[i + 1][0])
        }
        if (res[i].length == 0) {
          res.splice(i, 1)
        }
        continue
      }
      for (let j = 0; j < res[i].length; j++) {
        let d = res[i][j]
        if (d.id == data.id) {
          res[i].splice(j, 1)
          if (res[i + 1]) {
            res[i].push(res[i + 1][0])
          }
          hasDel = true
        }
      }
    }
    state.recentRes[restype] = res
  },
  [types.REMOVE_PIC] (state, data){
  },
  [types.REMOVE_SOUND] (state, data){
  },
  [types.GET_VIEW_INFO] (state, data){
    state.viewRes[data.scene_id] = data.info
    state.viewRes[data.scene_id].id = data.scene_id
  },
  [types.SAVE_VIEW_INFO] (state, data, sdata){
    state.viewRes[sdata.scene_id] = data.info
  },
  [types.GET_WORD_STYLE] (state, data){
    state.wordStyle = data.word
  },
  [types.SAVE_WORD_STYLE] (state, data){
    state.wordStyle = data.word
  },
  [types.GET_AD_PIC] (state, data){
    state.adRes = data.game_pic
  },
  [types.UPLOAD_AD_PIC] (state, data, imgdata){
    if (data.state == 0) {
      state.adRes[imgdata.type] = imgdata.img
    }
  },
  [types.SET_BG_SIZE] (state, w, h, pw, ph){
    state.bgSize.w = w - 2
    state.bgSize.h = h - 2
    state.bgSize.scale = (h - 2) / 852
    state.bgPopSize.w = pw - 2
    state.bgPopSize.h = ph - 2
    state.bgPopSize.scale = (ph - 2) / 852
  },
  [types.SET_TEST_RES](state, data){
    state.testRes = data
  }
}

export default {
  state,
  mutations
}
