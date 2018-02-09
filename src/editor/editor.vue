<template>
  <svg class="mindmap" id="mindmap" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" >
  </svg>
</template>

<script>
import MindMap, { MindMapMixIn } from "./mindmap/mindmap.js"
import mindmapData from "./mindmap/mindmapData.js"

export default {
  mixins: [ MindMapMixIn ],
  data () {
    return {
      mindmapData,
      rootId: "mindmap"
    }
  },
  methods: {
    ready(){
      this.draw()
    }
  }
}
</script>
