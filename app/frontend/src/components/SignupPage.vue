<template>
  <div>
    <h2>Sign up</h2>
    <form @submit.prevent="onSubmit(form)">
      <input type="text" v-model.trim="form.username" placeholder="Username">
      <input type="password" v-model.trim="form.password" placeholder="Password">
      <input type="submit" value="Sign up">
    </form>
    <p><i>{{ message }}</i></p>
    <router-link to="/login">Login</router-link>
  </div>
</template>

<script>
export default {
  name: 'Signup',
  data () {
    return {
      form: {},
      message: ''
    }
  },
  methods: {
    onSubmit (form) {
      this.$http.post('/signup', form)
        .then(response => {
          alert('Registered successfully')
          this.$router.push({
            name: 'Login'
          })
        })
        .catch(e => {
          console.log(e)
          this.errors.push(e)
        })
    }
  }
}
</script>
