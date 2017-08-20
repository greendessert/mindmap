<template>
<div>
    <div ref="lineWrapper" class="lineWrapper line-animation" :style="c_style.wrapper">
        <svg ref="svg" :width="c_width" :height="c_height" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" >
            <path  class="line" :id="pathId" :d="d" :stroke-width="strokeWidth"></path>
        </svg>
    </div>
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
                    transform: "scale(1, 1)",
                    position: "",
                    wrapper: {
                        transform: "scale(1, 1)",
                        left: 0,
                        top: 0,
                        width: 0,
                        height: 0
                    }
                },

                strokeWidth: 1,

                parentNode: null,
                childNode: null,

                animating: false,
                animations: [],

                animatable: true,
                animateAttr: ["x1", "y1", "x2", "y2"],

                firstAnimation: true,
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
            style(){
                return {
                    position: { left: `${this.x}px`, top: `${this.y}px` },
                    transform: { transform: `translate3d(${this.x}px, ${this.y}px, 0px)` },
                }
            },
            _
        },
        methods: {
            async animate(){

                //  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
                // let d = `M${this.x1-this.x},${(this.y1-this.y) || this.strokeWidth/2} L${this.x2-this.x},${this.y2-this.y || this.strokeWidth/2}`
                
                // let newWidth = Math.abs(this.x1 - this.x2)
                // let newHeight = Math.abs(this.y1 - this.y2) || this.strokeWidth

                // let path = document.createElementNS("http://www.w3.org/2000/svg","path")
                // path.setAttribute("d", d)
                // path.setAttribute("stroke-width", `${this.strokeWidth}`)
                // path.classList.add("line")

                // let svg = document.createElementNS("http://www.w3.org/2000/svg","svg")
                // svg.appendChild(path)
                // svg.setAttribute("width", `${newWidth}`)
                // svg.setAttribute("height", `${newHeight}`)
                // svg.style.width = `${newWidth}px`
                // svg.style.height = `${newHeight}px`
                // svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
                // svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink")
                // svg.setAttribute("version", "1.1")

                // let animateWrapper = document.createElement("div")
                // animateWrapper.appendChild(svg)
                // animateWrapper.classList.add("lineWrapper")
                // animateWrapper.classList.add("line-animation")
                // animateWrapper.style.transform = `scale(${this.c_width/newWidth},${this.c_height/newHeight})`
                // animateWrapper.style.left = `${this.c_x1}px`
                // animateWrapper.style.top = `${this.c_y1}px`

                // this.$el.appendChild(animateWrapper)

                // animateWrapper.style.transform = `scale(1,1)`
                // animateWrapper.addEventListener("transitionend", ()=>{
                //     console.log("transition end")
                //     this.$el.removeChild(animateWrapper)

                // })

                let lineWrapper = this.$refs["lineWrapper"]

                this.c_style.wrapper.transform = "scale(1,1.5)"
                if(this.firstAnimation) {
                    this.firstAnimation = false
                } else {
                    await new Promise((resolve)=>lineWrapper.addEventListener("transitionend", resolve))
                }
            },
            async applyLayout(){
                await this.animate()
                // Set Current State To New State
                this.c_x1 = this.x1
                this.c_y1 = this.y1
                this.c_x2 = this.x2
                this.c_y2 = this.y2

                // Inference from current state
                let x = Math.min(this.x1, this.x2)
                let y = Math.min(this.y1, this.y2)

                this.d = `M${this.c_x1-x},${(this.c_y1-this.y) || this.strokeWidth/2} L${this.c_x2-x},${this.c_y2-y || this.strokeWidth/2}`
                this.c_width = Math.abs(this.x1 - this.x2)
                this.c_height = Math.abs(this.y1 - this.y2) || this.strokeWidth

                this.c_style.wrapper = {
                    transform: `scale(1, 1)`,
                    left: `${x}px`,
                    top: `${y}px`
                }
            }
        },
        beforeMount(){
            this.animateAttr.map((attr)=>{
                this["c_"+attr] = this[attr]
            })
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

    .hidden {
        display: none;
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