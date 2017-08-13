<template>
  <g :class="{active: active}" class="node" @click="click">
    <rect :style="rectStyle" :width="width" :height="height" :transform="rectTransform"></rect>
    <text font-size="18" :transform="textTransform">{{title}}</text>
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
                totalHeight: 0,
                totalWidth: 0,
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
            this.children.forEach((child)=>child.$destroy())
            this.$parent.$el.removeChild(this.$el)
        },
        methods: {
            click(){
                console.log(`Clicked On ${this.id}`)
                this.$parent.nodeClick(this)
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
        transition: transform 0.3s ease-in-out;
    }

    text {
        transition: transform 0.3s ease-in-out;
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