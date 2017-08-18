<template>
    <g class="line">
        <path :id="pathId" :d="currentPathDef"></path>
    </g>
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
                return `M${this.x1},${this.y1} L${this.x2},${this.y2}`
            },
            currentPathDef(){
                return `M${this.c_x1},${this.c_y1} L${this.c_x2},${this.c_y2}`
            },
            pathId(){
                return `${this.id}-path`
            }
        },
        methods: {
            async animate(){
                let animationId = _.uniqueId()
                this.animations.push(animationId)   
                let path = d3.select(`#${this.pathId}`)
                await new Promise((resolve)=>
                    path
                    .transition()
                    .duration(300)
                    .attr("d", this.pathDef)
                    .on('end', resolve))
                this.animations = this.animations.slice(this.animations.indexOf(animationId)+1, this.animations.length)
            },
            async applyLayout(){
                if(this.$el && this.animatable){
                    try{
                        await this.animate()
                    } catch(err){
                        console.log(err)
                    }
                }
                if(!this.animations.length){
                    this.animateAttr.map((attr)=>{
                        this["c_"+attr] = this[attr]
                    })
                }
            }
        },
        beforeDestroy(){
            this.$parent.$el.removeChild(this.$el)
        }
    }
</script>


<style lang="scss">
    .line {
        stroke: black;
        stroke-width: 1;
    }

    .run-animation {
        transition: opacity 5s, transform 5s
    }
</style>