<template>
  <div>
    <h2>Me</h2>
    <label>User Info:</label>
    <pre>{{ user }}</pre>
  </div>
</template>

<script>
export default {
  name: 'MyPage',
  data () {
    return {
      user: null
    }
  },
  created () {
    this.$http.get('/api/me')
      .then((response) => {
        this.user = response.user
      })
  }
}
</script>
