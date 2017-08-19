<template>
  <div class="mindmapWrapper">
    <div ref="canvas" class="mindmap" id="mindmap">
    </div>
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
  // animation: a 3s infinite;
}

@keyframes a {
  0% {
    transform: scale(0)
  }

  50% {
    transform: scale(1)
  }

  100% {
    transform: scale(0)
  }
}

// .mindmap {
//   position: relative;
// }
</style>
