<template>
    <g class="line">
        <path :d="pathDef"></path>
    </g>
</template>

<script>
    export default {
        data(){
            return {
                id: "",
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0
            }
        },
        computed: {
            prevPathDef(){
                return `M${this.x1},${this.y1-50} L${this.x2},${this.y2-50}`
            },
            pathDef(){
                return `M${this.x1},${this.y1} L${this.x2},${this.y2}`
            }
        }
    }
</script>

<style lang="scss">
    .line {
        stroke: black;
        stroke-width: 1;

        line {
            transition: all 0.3s ease-in-out;
        }
    }
</style>