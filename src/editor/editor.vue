<template>
  <div class="mindmapWrapper">
    <svg ref="canvas" class="mindmap" id="mindmap"xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" >
    </svg>
  </div>
</template>

<script>
import MindMap, { MindMapMixIn } from "./mindmap/mindmap.js"
import mindmapData from "./mindmap/mindmapData.js"
// console.log(mindmapData)
export default {
  mixins: [ MindMapMixIn ],
  data () {
    return {
      mindmapData,
      rootId: "mindmap",
      canvas: null
    }
  },
  mounted(){
    this.draw()
  },
}
</script>

<style lang="scss">
.mindmapWrapper {
  position: absolute;
}

// .mindmap {
//   position: relative;
// }
</style>
