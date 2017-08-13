<template>
    <g class="line">
        <line :x1="x1" :y1="y1" :x2="x2" :y2="y2"></line>
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
        }
    }
</script>

<style lang="scss">
    .line {
        stroke: black;
        stroke-width: 1;
    }
</style>