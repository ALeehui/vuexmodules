// vuex/modules/drama.js
import Vue from 'vue'
import * as types from '../mutation-types'
import * as Util from '../../util'

// 该模块的初始状态
const state = {
  gameID: 1,        //游戏id
  slist: {},        //根列表
  flist: {},        //选项分支列表 {选项qid:[[选项1分支列表], [选项2分支列表], [选项3分支列表]]}
  jlist: [],        //剧情线索列表
  curr: {},         //当前列表选中数据
  currIdx: 0,       //当前列表选中项索引
  currOptIdx: 0,    //当前列表选中选项索引,仅在点击选项后设定 0为未选中状态
  currJq: 1,        //当前选择剧情线索id
  currPage: 1,      //当前编辑页
  allName: [],       //剧情中所有人名数据（不重复）
  loadAll: false,   //更列表已经全部加载到本地
  editState: false,
  editType: '',
  freeSel: false,   //当前是否开启多选模式（复制剪切）
  currSel: [],      //当前多选内容（复制剪切）
  tempType: '',     //复制 or 剪切
  temp: [],         //临时数据(复制、剪切)
}

// 相关的 mutations
const mutations = {
  [types.GET_DRAMA_LIST] (state, data, optidx, getmore){
    let sdata = data.story
    let qdata = Util.initQues(data.question)

    //插入分支数据
    for (let i = 0; i < qdata.length; i++) {
      if (state.allName.indexOf(qdata[i].name) < 0 && qdata[i].name != '') {
        Vue.set(state.allName, state.allName.length, qdata[i].name)
      }
      Vue.set(state.flist[state.currJq], qdata[i].id, [[], [], []])
    }
    //判断第一条是否为选项
    let idx = Util.getIdx(qdata, {is_start: 1})
    if (idx >= 0) {
      sdata.splice(0, 0, qdata[idx]);
    }
    //插入选项数据到sdata
    for (let i = sdata.length - 1; i >= 0; i--) {
      let d = sdata[i]
      if (state.allName.indexOf(d.name) < 0 && d.name != '') {
        Vue.set(state.allName, state.allName.length, d.name)
      }
      if (!d.type) {
        d.type = 1  //类型为剧情
      }
      if (d.q_id && d.q_id > 0) {
        idx = Util.getIdx(qdata, {id: d.q_id})
        if (idx >= 0) {
          sdata.splice(i + 1, 0, qdata[idx])
        }
      }
    }
    //处理选项后接的选项
    for (let i = 0; i < sdata.length; i++) {
      let d = sdata[i]
      if (d.end && d.end < 0) {
        idx = Util.getIdx(qdata, {id: -d.end})
        if (idx >= 0) {
          sdata.splice(i + 1, 0, qdata[idx])
        }
      }
    }

    //是否只存在选项
    if (sdata.length == 0 && qdata.length > 0) {
      sdata = sdata.concat(qdata)
    }
    //主线是否为空（optidx参数仅在请求支线列表时存在）
    if (!sdata[0] && optidx < 0) {
      Vue.set(state.slist, state.currJq, [])
      return
    } else if (!sdata[0] && optidx > 0) {
      return
    }

    let pid = sdata[0].parent_id
    if (getmore) {
      sdata.shift() //移除第一条数据(原列表最末数据)
    }
    //更新数据
    if (pid == 0 && !state.slist[state.currJq]) { //设置根列表新剧情数据
      state.currIdx = 0
      state.curr = sdata[0]
      Vue.set(state.slist, state.currJq, sdata)

    } else if (pid == 0 && getmore) {             //扩展根列表已有剧情数据
      let newlist = state.slist[state.currJq].concat(sdata)
      Vue.set(state.slist, state.currJq, newlist)

    } else if (pid > 0 && optidx > 0) {           //更新分支剧情数据
      let flist = state.flist[state.currJq][pid][optidx - 1]
      let newlist
      if (flist.length == 0) {
        newlist = sdata
      } else if (getmore) {
        newlist = flist.concat(sdata)
      } else {
        return
      }
      for (let i = 0; i < newlist.length; i++) {
        Vue.set(state.flist[state.currJq][pid][optidx - 1], i, newlist[i])
      }
    }
  },
  [types.INIT_JUQING] (state, data, gameid){
    if (gameid) {
      state.gameID = gameid
    }
    let jlist = data.thread
    state.jlist = jlist
    for (let i = 0; i < jlist.length; i++) {
      let jq = jlist[i]
      if (jq.is_main == 1) {
        state.currJq = jq.id
      }
      //初始化支线数据
      if (!state.flist[jq.id]) {
        Vue.set(state.flist, jq.id, {})
      }
    }
  },
  [types.CREATE_JUQING] (state, data){
    let newjq = data.thread
    Vue.set(state.jlist, state.jlist.length, newjq)
    Vue.set(state.slist, newjq.id, [])
    Vue.set(state.flist, newjq.id, {})
  },
  [types.COPY_JUQING] (state, data){
    let newjq = data.new_thread
    Vue.set(state.jlist, state.jlist.length, newjq)
    Vue.set(state.flist, newjq.id, {})
  },
  [types.RENAME_JUQING] (state, data, jq){
    state.jlist[jq.idx].name = jq.name
  },
  [types.REMOVE_JUQING] (state, data, jq){
    if (data.msg) {
      console.log(data.msg)
    }
    if (data.state != 0) {
      return
    }
    if (state.currJq == jq.id) {
      state.currJq = state.jlist[0].id
      state.curr = state.slist[state.currJq][0] || {}
      state.currIdx = 0
      state.currOptIdx = 0
    }
    delete state.slist[jq.id]
    delete state.flist[jq.id]
    state.jlist.$remove(jq)
  },
  [types.CREATE_ITEM] (state, data, item){
    let slist = state.slist[state.currJq]
    let flist = state.flist[state.currJq]
    let d = data.story || data.question
    d.type = data.story ? 1 : -1

    if (d.type == -1) {
      d.open = {1: false, 2: false, 3: false}
      Vue.set(flist, d.id, [[], [], []])
    }
    if (!slist) {
      Vue.set(state.slist, state.currJq, [])
      slist = state.slist[state.currJq]
    }
    if (d.parent_id == 0) {
      slist.splice(item.idx, 0, d)
    } else if (item.opt > 0) {
      //分支下创建后分支自动展开
      let idx = Util.getIdx(slist, {id: d.parent_id, type: -1})
      if (idx >= 0) {
        slist[idx].open[item.opt] = true
      } else {
        let curr = state.curr
        let opt = Util.getOpt(flist[curr.parent_id], curr.id, -1)
        if (opt > 0) {
          flist[curr.parent_id][opt - 1][state.currIdx].open[item.opt] = true
        }
      }
      //分支下创建
      flist[d.parent_id][item.opt - 1].splice(item.idx, 0, d)
    }
    state.curr = d
    state.currIdx = item.idx
    state.currOptIdx = 0
    if (d.type == 1) {
      state.currPage = 9
    }
  },
  [types.PASTE_ITEM] (state, data, item){
    let slist = state.slist[state.currJq]
    let flist = state.flist[state.currJq]
    let sdata = data.story
    let qdata = Util.initQues(data.question)

    //debug:代码与之前重复 可优化
    //插入分支数据
    for (let i = 0; i < qdata.length; i++) {
      Vue.set(flist, qdata[i].id, [[], [], []])
    }
    //判断第一条是否为选项
    let idx = Util.getIdx(qdata, {is_start: 1})
    if (idx >= 0) {
      sdata.splice(0, 0, qdata[idx]);
    } else if (sdata[0] && Util.getIdx(qdata, {end: sdata[0].id}) >= 0) {
      sdata.splice(0, 0, qdata[0])
    }
    //插入选项数据到sdata
    for (let i = sdata.length - 1; i >= 0; i--) {
      let d = sdata[i]
      if (!d.type) {
        d.type = 1  //类型为剧情
      }
      if (d.q_id && d.q_id > 0) {
        idx = Util.getIdx(qdata, {id: d.q_id})
        if (idx >= 0) {
          sdata.splice(i + 1, 0, qdata[idx])
        }
      }
    }
    //处理选项后接的选项
    for (let i = 0; i < sdata.length; i++) {
      let d = sdata[i]
      if (d.end && d.end < 0) {
        idx = Util.getIdx(qdata, {id: -d.end})
        if (idx >= 0) {
          sdata.splice(i + 1, 0, qdata[idx])
        }
      }
    }
    //是否只存在选项
    if (sdata.length == 0 && qdata.length > 0) {
      sdata = sdata.concat(qdata)
    }
    if (!sdata[0]) {
      return
    }

    //粘贴数据
    if (sdata[0].parent_id == 0) {
      //根列表创建
      for (let i = 0; i < sdata.length; i++) {
        slist.splice(item.idx + i, 0, sdata[i])
      }
    } else if (item.opt > 0) {
      //分支下创建后分支自动展开
      let idx = Util.getIdx(slist, {id: sdata[0].parent_id, type: -1})
      if (idx >= 0) {
        slist[idx].open[item.opt] = true
      } else {
        let curr = state.curr
        let opt = Util.getOpt(flist[curr.parent_id], curr.id, -1)
        if (opt > 0) {
          flist[curr.parent_id][opt - 1][state.currIdx].open[item.opt] = true
        }
      }
      //分支下创建
      for (let i = 0; i < sdata.length; i++) {
        flist[sdata[0].parent_id][item.opt - 1].splice(item.idx + i, 0, sdata[i])
      }
    }
    state.curr = sdata[0]
    state.currIdx = item.idx
    state.currOptIdx = 0
  },
  [types.UPDATE_ITEM] (state, data, item){
    let curr = state.curr
    if (data.msg) {
      console.log(curr.type == 1 ? '剧情 id' : '选项 id', curr.id, data.msg)
    }
    if (data.state != 0) {
      return
    }
    if (item.arr.name && state.allName.indexOf(item.arr.name) < 0 && item.arr.name != '') {
      state.allName.splice(0, 0, item.arr.name)
    } else if (state.allName.indexOf(item.arr.name) >= 0) {
      let name = item.arr.name
      let nameidx = state.allName.indexOf(name)
      state.allName.splice(nameidx, 1)
      state.allName.splice(0, 0, name)
    }
    if (state.temp.length > 0 && Util.getIdx(state.temp, {id: curr.id, type: curr.type}) >= 0) {
      state.temp = []
    }
    item.type = item.story_id ? 1 : -1
    let itemid = item.story_id || item.q_id
    let list, slist, flist, opt
    if (item.pid == 0) {
      slist = state.slist[state.currJq]
      list = slist
    } else {
      flist = state.flist[state.currJq][item.pid]
      opt = Util.getOpt(flist, itemid, item.type)
      list = flist[opt - 1]
    }
    let idx = Util.getIdx(list, {id: itemid, type: item.story_id ? 1 : -1})
    if (idx >= 0) {
      for (let k in item.arr) {
        list[idx][k] = item.arr[k]
      }
    }
  },
  [types.REMOVE_ITEM] (state, data, itemdata){
    if (data.msg) {
      console.log(data.msg)
    }
    if (data.state != 0) {
      return
    }
    let slist = state.slist[state.currJq]
    let flist = state.flist[state.currJq]
    let idx = state.currIdx
    let cut = itemdata.cut
    let arr = itemdata.id ? [itemdata] : (itemdata.all || state.temp)
    if (arr.length > 1) {
      arr.sort(Util.sortByPath)
      arr.reverse()
    }
    for (let a = 0; a < arr.length; a++) {
      let item = arr[a]
      let pid = item.parent_id
      if (pid == 0) {
        slist.$remove(item)
        if (!itemdata.cut) {
          state.curr = slist[idx] ? slist[idx] : (slist[idx - 1] ? slist[idx - 1] : {})
        }
        if (!slist[idx] && !cut) {
          let i = 1
          for (i = 1; i < 1000; i++) {
            if (slist[idx - i] || idx - i == 0) {
              break
            }
          }
          state.currIdx = idx - i
          state.curr=slist[idx-i]
        }
      } else {
        for (let i = 0; i < 3; i++) {
          let d = flist[pid][i].$remove(item)
          if (d) {
            if (flist[pid][i][idx]) {               //删除后后置数据前移一位
              if (a == arr.length - 1 && !cut) {
                state.curr = flist[pid][i][idx]
              }
            } else if (flist[pid][i][idx - 1]) {    //当前分支列表最末，删除后索引前移一位
              if (a == arr.length - 1 && !cut) {
                state.curr = flist[pid][i][idx - 1]
                state.currIdx = idx - 1
              }
            } else {                                //当前分支被清空，删除后定位到分支选项
              //根列表分支
              let newidx = Util.getIdx(slist, {id: pid, type: -1})
              if (newidx >= 0) {
                if (a == arr.length - 1 && !cut) {
                  state.curr = slist[newidx]
                  state.currIdx = newidx
                  state.currOptIdx = 0
                }
                break
              }
              //分支列表的分支
              for (let k in flist) {
                for (let j = 0; j < 3; j++) {
                  newidx = Util.getIdx(flist[k][j], {id: pid, type: -1})
                  if (newidx >= 0) {
                    if (a == arr.length - 1 && !cut) {
                      state.curr = flist[k][j][newidx]
                      state.currIdx = newidx
                      state.currOptIdx = 0
                    }
                    if (item.type == -1) {
                      Vue.delete(flist, item.id)
                    }
                    break
                  }
                }
              }
            }
            break
          }
        }
      }
      if (item.type == -1) {
        Vue.delete(flist, item.id)
      }
    }
    if (!itemdata.id) {
      state.currSel = []
    }
    if (cut) {
      state.temp = []
    }
  },
  [types.REMOVE_OPT] (state, data, opt){
    if (data.state != 0) {
      console.log('选项分支删除失败')
      return
    }
    let slist = state.slist[state.currJq]
    let flist = state.flist[state.currJq]
    let optlist = state.flist[state.currJq][opt.q_id]

    //删除对应分支列表
    Vue.set(optlist, 3, [])
    optlist.splice(opt.num - 1, 1)

    //更新对应选项数据
    let item
    if (opt.pid == 0) {
      item = slist[opt.idx]
    } else {
      let opt = Util.getOpt(flist[opt.pid], opt.q_id, -1)
      if (opt <= 0) {
        return
      }
      let idx = Util.getIdx(flist[opt.pid][opt - 1], {id: opt.q_id, type: -1})
      if (idx < 0) {
        return
      }
      item = flist[opt.pid][opt - 1][idx]
    }
    for (let i = 1; i <= 3; i++) {
      if (i >= opt.num && i < 3) {
        item['answer' + i] = item['answer' + (i + 1)]
        item['next' + i] = item['next' + (i + 1)]
        item.open[i] = item.open[i + 1]
      } else if (i >= opt.num) {
        item['answer' + i] = ''
        item['next' + i] = 0
        item.open[i] = false
      }
    }
  },
  [types.BATCH_CREATE] (state, data, sdata){
    let ids = data.ids
    let items = sdata.arr
    let slist = state.slist[state.currJq]
    let flist = state.flist[state.currJq]

    for (let i = 0; i < items.length; i++) {
      let d = Util.formatItem(items[i].type)
      d.id = ids[i]
      d.name = items[i].arr.name
      d.version = data.version
      d[d.type == 1 ? 'content' : 'ask'] = items[i].arr.content

      if (d.type == -1) {
        d.open = {1: false, 2: false, 3: false}
        Vue.set(flist, d.id, [[], [], []])
      }
      if (!slist) {
        Vue.set(state.slist, state.currJq, [])
        slist = state.slist[state.currJq]
      }
      if (d.parent_id == 0) {
        sdata.idx++
        slist.splice(sdata.idx, 0, d)
      } else if (sdata.opt > 0) {
        //分支下创建后分支自动展开
        let idx = Util.getIdx(slist, {id: d.parent_id, type: -1})
        if (idx >= 0) {
          slist[idx].open[sdata.opt] = true
        } else {
          let curr = state.curr
          let opt = Util.getOpt(flist[curr.parent_id], curr.id, -1)
          if (opt > 0) {
            flist[curr.parent_id][opt - 1][state.currIdx].open[sdata.opt] = true
          }
        }
        //分支下创建
        flist[d.parent_id][sdata.opt - 1].splice(item.idx, 0, d)
      }
      state.curr = d
      state.currIdx = sdata.idx
      state.currOptIdx = 0
      if (d.type == 1) {
        state.currPage = 9
      }
    }
  },
  [types.UPLOAD_PIC] (state, data, sdata){
  },
  [types.UPLOAD_PIC] (state, data, sdata){
  },
  [types.SET_CURR] (state, data){
    state.curr = data
  },
  [types.SET_CURR_JQ] (state, id){
    state.currJq = id
    state.currIdx = 0
    state.currOptIdx = 0
    if (state.slist[id] && state.slist[id].length > 0) {
      state.curr = state.slist[id][0]
    } else {
      state.curr = {}
    }
  },
  [types.SET_CURR_IDX] (state, idx){
    state.currIdx = idx
  },
  [types.SET_CURR_OPT_IDX] (state, idx){
    state.currOptIdx = idx
    if (idx == 0) {
      return
    }
    let curr = state.curr
    if (curr.parent_id == 0) {
      let item = state.slist[state.currJq][state.currIdx]
      item.open[idx] = !item.open[idx]
    } else {
      let flist = state.flist[state.currJq][curr.parent_id]
      let curropt = Util.getOpt(flist, curr.id, -1)
      let item = flist[curropt - 1][state.currIdx]
      item.open[idx] = !item.open[idx]
    }
  },
  [types.SET_CURR_PAGE] (state, page){
    state.currPage = page
  },
  [types.POP_EDIT] (state, show, type){
    state.editState = show
    if (type) {
      state.editType = type
    }
  },
  [types.SET_FREE_SEL] (state, bool){
    state.freeSel = bool
  },
  [types.ADD_CURR_SEL] (state, data){
    let slist = state.slist[state.currJq]
    let flist = state.flist[state.currJq]

    for (let i = state.currSel.length - 1; i >= 0; i--) {
      let d = state.currSel[i]
      let p_old = d.path.split('-')
      let p_new = data.path.split('-')

      if (p_old.length != p_new.length) {

        let len = Math.min(p_old.length, p_new.length)
        for (let j = len - 1; j >= 0; j--) {
          let po = p_old[j]
          let pn = p_new[j]
          if (po.split(':')[0] == pn.split(':')[0]) {
            if (po == pn || po.indexOf(':') < 0 || pn.indexOf(':') < 0) {
              if (j == 0) {
                state.currSel.$remove(d)
              }
            }
          } else {
            break
          }
        }
      }
    }
    Vue.set(state.currSel, state.currSel.length, data)
  },
  [types.REMOVE_CURR_SEL] (state, data){
    state.currSel.$remove(data)
  },
  [types.CLEAN_SEL] (state){
    state.currSel = []
  },
  [types.SET_TEMP] (state, data, type){
    if (data.length > 1) {
      data.sort(Util.sortByPath)
    }
    state.currSel = []
    state.temp = []
    state.tempType = type
    for (let i = 0; i < data.length; i++) {
      Vue.set(state.temp, state.temp.length, data[i])
    }
  },
  [types.REMOVE_TEMP] (state, item){
    state.temp.$remove(item)
  }
}

export default {
  state,
  mutations
}
