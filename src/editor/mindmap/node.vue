<template>
  <g class="node" @click="click">
    <rect :style="rectStyle" :width="width" :height="height">
        <animate attributeName="cx" from="0" to="100" dur="5s" repeatCount="indefinite" />
    </rect>
    <text :style="textStyle" font-size="18">{{title}}</text>
  </g>
</template>

<script>
    export default {
        data(){
            return {
                id: "",
                title: "",
                children: [],
                x: 0,
                y: 0,
                totalHeight: 0
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
            }
        },
        methods: {
            click(){
                console.log(`Clicked On ${this.id}`)
                this.$parent.nodeClick({
                    id: this.id
                })
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
        transition: transform 0.5s;
    }

    text {
        transition: transform 0.5s;
    }
}
</style>