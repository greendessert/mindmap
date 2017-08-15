<template>
  <g :class="{active: active}" class="node" @click="click">
    <rect :style="rectStyle" :width="width" :height="height" :transform="rectTransform"></rect>
    <text font-size="18" :transform="textTransform">{{title}}</text>
  </g>
</template>

<script>
    import * as utils from './utils'
    import * as _ from 'lodash'
    export default {
        data(){
            return {
                id: "",
                title: "",
                children: [],
                x: 0,
                y: 0,
                totalHeight: 0,
                totalWidth: 0,
                lines: [],
            }
        },
        computed: {
            height(){
                return 100
            },
            width(){
                return 100
            },
            rectStyle(){
                return `
                    transform: translate(${this.x}px, ${this.y}px)
                `
            },
            textStyle(){
                return `
                    transform: translate(${this.x+5}px, ${this.y+55}px)
                `
            },
            rectTransform(){
                return `translate(${this.x}, ${this.y})`
            },
            textTransform(){
                return `translate(${this.x+5}, ${this.y+55})`
            },
            active(){
                return this.$parent.activeNode === this
            },
            onEnterKey(){
                console.log("Enter")
            }
        },
        mounted(){
        },
        beforeDestroy(){
            this.lines.forEach((line)=>line.$destroy())
            this.children.forEach((child)=>child.$destroy())
            this.$parent.$el.removeChild(this.$el)
        },
        methods: {
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
    rect {
        transition: transform 0.3s;
    }

    text {
        transition: transform 0.3s;
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