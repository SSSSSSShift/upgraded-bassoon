import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // token 与 用户id
    token: sessionStorage.getItem('token') || '',
    uid: sessionStorage.getItem('uid') || '',
},
mutations: {
  //设置 token
  setToken(state, token) {
      state.token = token;
      sessionStorage.setItem('token', token);
  },
  //设置 uid
  setUid(state, id) {
      state.uid = id;
      sessionStorage.setItem('uid', id);
  },
  //注销
  logout(state) {
      //清空 token 和 id
      state.token = '';
      state.uid = '';
      // 清空 sessionStorage
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('uid');
  }
},
  modules: {
    app,
    settings,
    user
  },
  getters
})

export default store
