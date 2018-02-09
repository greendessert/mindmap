<template>
  <div id="app">
    Loading...
  </div>
</template>

<script>
import Editor2 from './editor/editor2'
import mindmapData from "./editor/mindmap/mindmapData.js"

export default {
  name: 'app',
  mounted(){
    new Editor2(mindmapData).mount("app")
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
