<template>
    <div class="nodeWrapper" :style="style.transform" @click="click">
        <div class="node" :class="{active: active}">
            <svg :width="width" :height="height" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" >
                <rect :width="width" :height="height"/>
                <text :font-size="18" x="5" y="55">
                    {{title}}
                </text>
            </svg>
        </div>
    </div>
</template>

<script>
    import * as utils from './utils'
    import * as _ from 'lodash'
    import * as d3 from "d3"
    import bluebird from 'bluebird'
    const SVG = require("svg.js")
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

                animating: false,
                animations: [],

                animatable: true,
                animateAttr: ["x", "y"]
            }
        },
        computed: {
            height(){
                return 100
            },
            width(){
                return 100
            },
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
                    transform: {transform: `translate3d(${this.x}px, ${this.y}px, 0px)`},
                    position: {left: `${this.x}px`, top: `${this.y}px`},
                    rectTransform: `translate(${this.x}, ${this.y})`,
                    textTransform: `translate(${this.x+5}, ${this.y+55})`
                }
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
            applyLayout(){
                for(let child of this.children){
                    child.applyLayout()
                }
                for(let line of this.lines){
                    line.applyLayout()
                }
            }
        }
    }
</script>

<style lang="scss">
.nodeWrapper {
    position: absolute;
    transition: all 0.5s;
}
.node {
    position: relative;
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