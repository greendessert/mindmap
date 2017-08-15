<template>
    <g class="line">
        <path :d="pathDef">
            <animate ref="animation"
                dur="0.2s" 
                attributeName="d"
                :from="oldPathDef"
                :to="pathDef"
                />
        </path>
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
                y2: 0,

                c_x1: 0,
                c_y1: 0,
                c_x2: 0,
                c_y2: 0,

                o_x1: 0,
                o_y1: 0,
                o_x2: 0,
                o_y2: 0,
            }
        },
        computed: {
            pathDef(){
                return `M${this.x1},${this.y1} L${this.x2},${this.y2}`
            },
            oldPathDef(){
                return `M${this.o_x1},${this.o_y1} L${this.o_x2},${this.o_y2}`
            }
        },
        beforeMount(){
            // Layout update must happen before $mount
            let arr = ["x1", "y1", "x2", "y2"]
            arr.map((attr)=>{
                this["o_"+attr] = this[attr]
            })
        },
        methods: {
            animate(){
                this.$refs["animation"].beginElement()
            },
            startAnimate: (function(){
                let frames = 30
                let startTime
                let duration = 300
                let x1, y1, x2, y2 // Target Location
                let timer // Interval Timer
                return function(){
                    // When called, update target location, startTime

                    let nextFrame = ()=>{
                        // Access current location
                        let c_x1, c_y1, c_x2, c_y2 // Current Location
                        // Calculate next frame
                        let n_x1, n_y1, n_x2, n_y2 // Current Location
                        // If current location is target position, return, invalidate timer

                        // Else, Update current location

                        console.log("Animateing")
                    }
                    
                    timer = setInterval(nextFrame, 1000/frames)
                }
            })(),
            async layoutUpdated(){
                if(!this.$el) return
                this.animate()
                // this.startAnimate()
                let arr = ["x1", "y1", "x2", "y2"]
                await delay(300)
                arr.map((attr)=>{
                    this["o_"+attr] = this[attr]
                })
            }
        },
        beforeDestroy(){
            this.$parent.$el.removeChild(this.$el)
        }
    }

    async function delay(ms){
        return new Promise((resolve)=>setTimeout(resolve, ms))
    }

    var throttle = function (fn, delay) {
        var now, lastExec, timer, context, args; //eslint-disable-line

        var execute = function () {
            fn.apply(context, args);
            lastExec = now;
        };

        return function () {
            context = this;
            args = arguments;

            now = Date.now();

            if (timer) {
            clearTimeout(timer);
            timer = null;
            }

            if (lastExec) {
            var diff = delay - (now - lastExec);
            if (diff < 0) {
                execute();
            } else {
                timer = setTimeout(() => {
                execute();
                }, diff);
            }
            } else {
                execute();
            }
        };
    };

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