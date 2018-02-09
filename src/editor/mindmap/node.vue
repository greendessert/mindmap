<template>
  <g :class="{active: active}" class="node" @click="click">
    <rect :id="rectId" :width="width" :height="height" :transform="c_style.rectTransform"></rect>
    <text :id="textId" font-size="18" :transform="c_style.textTransform">{{title}}</text>
  </g>
</template>

<script>
    import * as utils from './utils'
    import * as _ from 'lodash'
    import * as d3 from "d3"
    import bluebird from 'bluebird'
    export default {
        data(){
            return {
                id: "",
                title: "",
                children: [],
                totalHeight: 0,
                totalWidth: 0,
                lines: [],

                x: 0,
                y: 0,
                c_x: 0,
                c_y: 0,

                animating: false,

                animatable: true,
                animateAttr: ["x", "y"],

                height: 100,
                width: 100
            }
        },
        computed: {
            active(){
                return this.$parent.activeNode === this
            },
            rectId(){
                return `${this.id}_rect`
            },
            textId(){
                return `${this.id}_text`
            },
            
            style(){
                return {
                    rectTransform: `translate(${this.x}, ${this.y})`,
                    textTransform: `translate(${this.x+5}, ${this.y+55})`
                }
            },
            c_style(){
                return {
                    rectTransform: `translate(${this.c_x}, ${this.c_y})`,
                    textTransform: `translate(${this.c_x+5}, ${this.c_y+55})`
                }
            },
        },
        mounted(){
        },
        beforeDestroy(){
            this.lines.forEach((line)=>line.$destroy())
            this.children.forEach((child)=>child.$destroy())
            this.$parent.$el.removeChild(this.$el)
        },
        methods: {
            async animate(){
                this.animating = true
                let rect = d3.select(`#${this.rectId}`)
                let text = d3.select(`#${this.textId}`)
                let rectAnimation = new Promise((resolve)=>rect.transition().attr("transform", this.style.rectTransform).on('end', resolve))
                let textAnimation = new Promise((resolve)=>text.transition().attr("transform", this.style.textTransform).on('end', resolve))
                await bluebird.all([rectAnimation, textAnimation])
                this.animating = false
            },
            click(){
                console.log(`Clicked On ${this.id}`)
                this.$parent.nodeClick(this)
            },
            deleteChild(child){
                let index = this.children.indexOf(child)
                this.children.splice(index, 1)

                let lineId = utils.getLineId(this, child)
                let lineIndex = _.findIndex(this.lines, {id: lineId})
                let line = this.lines.splice(lineIndex, 1)[0]
                
                child.$destroy()
                line.$destroy()
            },
            async layoutUpdated(){
                if(this.$el && this.animatable){
                    try {
                        await this.animate()
                    } catch(err){
                        console.log(err)
                    }
                }
                if(!this.animating){
                    this.animateAttr.map((attr)=>{
                        this["c_"+attr] = this[attr]
                    })
                }
            }
        }
    }
</script>

<style lang="scss">
.node {
    fill: pink;
    cursor: pointer;
    text {
        fill: black;
    }
    &:hover {
        fill: blue;
        text {
            fill: white;
        }
    }
}

.node.active {
    rect {
        fill: yellow;
    }

    &:hover {
        text {
            fill: black;
        }
    }
}
</style>