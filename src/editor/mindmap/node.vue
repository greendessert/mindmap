<template>
  <g :id="id" :class="{active: active}" class="node" @click="click" @dbclick="dbclick">
    <rect :id="rectId" :width="width" :height="height"></rect>
    <text :id="textId" font-size="18" transform="translate(5, 55)">{{title}}</text>
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
            node(){
                return d3.select(`#${this.id}`)
            },
            style(){
                return {
                    nodeTransform: `translate(${this.x}, ${this.y})`
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
                if(this.$parent.activeNode === this){
                    this.dbclick()
                } else {
                    this.$parent.nodeClick(this)
                }
            },
            dbclick(){
                console.log(this.$el.transform)
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
                this.node.transition().attr("transform", this.style.nodeTransform)
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