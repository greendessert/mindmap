<template>
  <div id="app">
    <MindmapEditor/>
  </div>
</template>

<script>
import MindmapEditor from './mindmap-editor'

export default {
  name: 'app',
  components: { MindmapEditor }
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
