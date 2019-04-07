import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'

import Index from '@/components/IndexPage'
import Login from '@/components/LoginPage'
import Signup from '@/components/SignupPage'
import Me from '@/components/MyPage'
import store from '@/store'

Vue.use(Vuex)
Vue.use(Router)

const requireAuth = (from, to, next) => {
  if (store.getters.isAuthenticated) return next()
  next('/login?returnPath=me')
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'Sign up',
      component: Signup
    },
    {
      path: '/me',
      name: 'Me',
      component: Me,
      beforeEnter: requireAuth
    }
  ]
})
