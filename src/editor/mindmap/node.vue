<template>
  <g :class="{active: active}" class="node" @click="click">
    <rect :id="rectId" :width="width" :height="height"></rect>
    <text :id="textId" font-size="18">{{title}}</text>
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

                x: -1,
                y: -1,

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
            rect(){
                return d3.select(`#${this.rectId}`)
            },
            textId(){
                return `${this.id}_text`
            },
            text(){
                return d3.select(`#${this.textId}`)
            },
            style(){
                return {
                    rectTransform: `translate(${this.x}, ${this.y})`,
                    textTransform: `translate(${this.x+5}, ${this.y+55})`
                }
            }
        },
        watch: {
            x(){
                this.updatePosition()
            },
            y(){
                this.updatePosition()
            }
        },
        beforeDestroy(){
            this.lines.forEach((line)=>line.$destroy())
            this.children.forEach((child)=>child.$destroy())
            this.$parent.$el.removeChild(this.$el)
        },
        methods: {
            click(){
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
            updatePosition(){
                if(this.x!==-1 && this.y!==-1){
                    this.rect.transition().attr("transform", this.style.rectTransform)
                    this.text.transition().attr("transform", this.style.textTransform)
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