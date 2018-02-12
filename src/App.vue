<template>
  <div id="app">
    Loading...
  </div>
</template>

<script>
import Editor from './editor/editor.js'

export default {
  name: 'app',
  mounted(){
    new Editor().mount("app")
  }
}
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
