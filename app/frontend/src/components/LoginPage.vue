<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="onSubmit(username, password)">
      <input type="text" v-model="username" placeholder="Username">
      <input type="password" v-model="password" placeholder="Password">
      <input type="submit" value="Login">
    </form>
    <p><i>{{ message }}</i></p>
    <router-link to="/signup">Sign up</router-link>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: '',
      message: ''
    }
  },
  methods: {
    onSubmit (username, password) {
      // run action named 'LOGIN'
      this.$store.dispatch('LOGIN', {username, password})
        .then(() => this.redirect())
        .catch(({response}) => {
          this.message = response.data
        })
    },
    redirect () {
      const {search} = window.location
      const tokens = search.replace(/^\?/, '').split('&')
      const {returnPath} = tokens.reduce((qs, tkn) => {
        const pair = tkn.split('=')
        qs[pair[0]] = decodeURIComponent(pair[1])
        return qs
      }, {})

      // redirect
      this.$router.push(returnPath || '/')
    }
  }
}
</script>
