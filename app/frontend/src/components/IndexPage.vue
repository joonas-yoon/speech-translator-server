<template>
  <div class="ui container">
    <h1>{{ greeting }}</h1>

    <router-link to="/">Home</router-link>

    <a href="" v-if="isAuthenticated" @click.prevent="onClickLogout">Logout</a>
    <div v-else>
      <router-link to="/login">Login</router-link>
      <router-link to="/signup">Sign up</router-link>
    </div>

    <router-link to="/me">Me</router-link>

    <h2>Get Started</h2>
    <a v-if="latestVersion.public_url" :href="latestVersion.public_url">Download {{ latestVersion.identifier }}</a>
    <div v-else>No available version.</div>

    <h2>Supported Languages</h2>
    <div class="languages">
      <li v-for="lang in languages" v-bind:key="lang.name">
        {{ lang.name }}
      </li>
    </div>
  </div>
</template>

<script>
import store from '@/store'

export default {
  created () {
    this.$http.get('/api/hello')
      .then(({data}) => {
        this.greeting = data.text
      })
    this.$http.get('/api/app/translate/supports')
      .then(({data}) => {
        this.languages = data
      })
    this.$http.get('/api/versions/latest')
      .then(({data}) => {
        console.log(data)
        this.latestVersion = data
      })
  },
  name: 'Index',
  data () {
    return {
      greeting: '',
      latestVersion: {},
      languages: []
    }
  },
  computed: {
    isAuthenticated () {
      return store.getters.isAuthenticated
    }
  },
  methods: {
    onClickLogout () {
      store.dispatch('LOGOUT').then(() => this.$router.push('/'))
    }
  }
}
</script>

<style scoped>
.languages li {
  display: inline-block;
  padding: 5px 10px;
  margin-right: 5px;
  margin-bottom: 5px;
  background: #eee;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
