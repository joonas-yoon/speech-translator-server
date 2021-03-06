import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const enhanceAccessToeken = () => {
  const {accessToken} = localStorage
  if (!accessToken) return
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
}
enhanceAccessToeken()

export default new Vuex.Store({
  state: {
    accessToken: null
  },
  getters: {
    isAuthenticated (state) {
      state.accessToken = state.accessToken || localStorage.accessToken
      return state.accessToken
    }
  },
  mutations: {
    LOGIN (state, {accessToken}) {
      state.accessToken = accessToken
      localStorage.accessToken = accessToken
    },
    LOGOUT (state) {
      state.accessToken = null
      delete localStorage.accessToken
    }
  },
  actions: {
    LOGIN ({commit}, {username, password}) {
      return axios.post('/api/login', {username, password})
        .then(({data}) => {
          console.log(data)
          commit('LOGIN', data)
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`
        })
    },
    LOGOUT ({commit}) {
      axios.defaults.headers.common['Authorization'] = undefined
      commit('LOGOUT')
    },
  }
})
