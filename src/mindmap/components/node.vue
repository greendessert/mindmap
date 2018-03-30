<template>
  <g class="mindmap-node" :id="id" :class="{active: active}" @click="click" @dbclick="dbclick">
    <rect class="mindmap-node__rect" :id="rectId" :width="width" :height="height"></rect>
    <text class="mindmap-node__text" :id="textId" font-size="18" transform="translate(5, 55)">{{title}}</text>
    <foreignObject v-if="showInput" width="100" height="50" transform="translate(5, 35)">
        <input type="text" @keyup.enter="onEnter($event)" :value="title"/>
    </foreignObject>
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

                width: 100,
                height: 100,

                showInput: false
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
            nodeEl(){
                return this.$el
            },
            style(){
                return {
                    gTransform: `translate(${this.x}, ${this.y})`
                }
            }
        },
        mounted(){
            this.nodeEl.setAttribute("transform", this.style.gTransform)
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
                this.showInput = true
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
                this.node.transition().attr("transform", this.style.gTransform)
            },
            onEnter(event){
                event.stopPropagation()
                this.title = event.target.value
                this.showInput = false
            },
            deselect(){
                this.showInput = false
            }
        }
    }
</script>

<style lang="scss">
.mindmap-node {
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

.mindmap-node.active {
    .mindmap-node__rect {
        fill: yellow;
    }

    &:hover {
        text {
            fill: black;
        }
    }
}

.mindmap-node__text {
    user-select: none;
}
</style>