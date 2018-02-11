<template>
    <g class="line">
        <path :id="pathId">
        </path>
    </g>
</template>

<script>
    import * as d3 from "d3"
    export default {
        data(){
            return {
                id: "",
                
                x1: 0,
                y1: 0,

                x2: 0,
                y2: 0,

                parentNode: null,
                childNode: null,
            }
        },
        computed: {
            pathDef(){
                return `M${this.x1},${this.y1} L${this.x2},${this.y2}`
            },
            pathId(){
                return `${this.id}-path`
            },
            path(){
                return d3.select(`#${this.pathId}`)
            }
        },
        watch: {
            x1(){ this.updatePosition() },
            y1(){ this.updatePosition() },
            x2(){ this.updatePosition() },
            y2(){ this.updatePosition() },
        },
        methods: {
            updatePosition(){
                this.path.transition().attr("d", this.pathDef)
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

        line {
            transition: all 0.3s ease-in-out;
        }
    }
</style>