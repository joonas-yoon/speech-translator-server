<template>
  <div class="ui container">
    <h1>Hello</h1>
    <div class="">
    </div>

    <h2>Supported Languages</h2>
    <div class="languages">
      <li v-for="lang in languages" v-bind:key="lang.name">
        {{ lang.name }}
      </li>
    </div>
  </div>
</template>

<script>
export default {
  created () {
    this.$http.get('/api/translate/supports')
      .then((response) => {
        this.languages = response.data
      })
  },
  name: 'Index',
  data () {
    return {
      languages: []
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
