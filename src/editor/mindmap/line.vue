<template>
    <div class="lineWrapper" :style="c_style.transform">
        <svg :width="c_width" :height="c_height" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" >
            <path  class="line" :id="pathId" :d="d" :stroke-width="strokeWidth"></path>
        </svg>
    </div>
</template>

<script>
    import * as d3 from "d3"
    import * as _ from "lodash"
    export default {
        data(){
            return {
                id: "",
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0,

                c_x1: 0,
                c_y1: 0,
                c_x2: 0,
                c_y2: 0,

                d: "",
                c_width: 0,
                c_height: 0,
                c_style: {
                    transform: "scale(1, 1)"
                },

                strokeWidth: 1,

                parentNode: null,
                childNode: null,

                animating: false,
                animations: [],

                animatable: true,
                animateAttr: ["x1", "y1", "x2", "y2"],
            }
        },
        computed: {
            pathDef(){
                return `M${this.x1-this.x},${(this.y1-this.y) || this.strokeWidth/2} L${this.x2-this.x},${this.y2-this.y || this.strokeWidth/2}`
            },
            pathId(){
                return `${this.id}-path`
            },
            x(){
                return Math.min(this.x1, this.x2)
            },
            y(){
                return Math.min(this.y1, this.y2)
            },
            // width(){
            //     return Math.abs(this.x1 - this.x2)
            // },
            // height(){
            //     return Math.abs(this.y1 - this.y2) || this.strokeWidth
            // },
            style(){
                return {
                    position: { left: `${this.x}px`, top: `${this.y}px` },
                    transform: { transform: `translate3d(${this.x}px, ${this.y}px, 0px)` },
                }
            }
        },
        methods: {
            async animate(){

            },
            async applyLayout(){
                // debugger
                this.$el.classList.remove("line-animation")
                this.d = `M${this.x1-this.x},${(this.y1-this.y) || this.strokeWidth/2} L${this.x2-this.x},${this.y2-this.y || this.strokeWidth/2}`
                let newWidth = Math.abs(this.x1 - this.x2)
                let newHeight = Math.abs(this.y1 - this.y2) || this.strokeWidth
                this.c_style.transform = {
                    transform: `scale(${this.c_width/newWidth}, ${this.c_height/newHeight})`
                }
                this.c_width = newWidth
                this.c_height = newHeight
                await new Promise((resolve)=>requestAnimationFrame(resolve))
                this.$el.classList.add("line-animation")

                this.c_style.transform = {
                    left: `${this.x}px`,
                    top: `${this.y}px`,
                    transform: `scale(1, 1)`
                }
            }
        },
        beforeDestroy(){
            this.$parent.$el.removeChild(this.$el)
        }
    }
</script>


<style lang="scss">
    .line-animation {
        transition: all 0.5s;
    }

    .line {
        stroke: black;
    }

    .lineWrapper {
        position: absolute;
        svg {
            position: absolute;
        }
    }

    .line {
        position: relative;
    }
</style>