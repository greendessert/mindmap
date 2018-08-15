<template>
    <svg class="mindmap" :id="rootId" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" >
    </svg>
</template>

<script>
import _ from "lodash"
import rightLayout from './layouts/right-layout'
import Vue from 'vue'
const SVG = require("svg.js")
import nodeDef from './node.vue'
const Node = Vue.extend(nodeDef)
import lineDef from './line.vue'
const Line = Vue.extend(lineDef)
import * as utils from './utils'

import mindmapData from "../data/mindmapData.js"

export default {
    data(){
        return {
            rootId: "mindmap",
            mindmapData: mindmapData,
            drawSVG: ()=>{  },
            mindmap: {  }, // After Interpolation
            lines: [ ], // Vue instances
            activeNode: null,
        }
    },
    mounted(){
        this.bindKeys()
        this.draw()
    },
    methods: {
        draw(){
            this.drawSVG = SVG(this.rootId)
            this.redraw()
        },
        redraw(){
            document.getElementById(this.rootId).innerHTML = ""

            this.$mStore.commit("setMindmap", {mindmapData: this.mindmapData, parent: this, layoutFunc: rightLayout})

            this.updateFrame()
            this.drawNodes()
            this.drawLines()
        },
        drawNodes(){
            for(let node of this.$mStore.getters.nodes){
                !node.$el ? node.$mount() : null
                this.$el.appendChild(node.$el)
            }
        },
        updateLayout(){
            rightLayout(this.$mStore.state.mindmap)
        },
        drawLines(){
            for(let line of this.$mStore.state.lines){
                !line.$el ? line.$mount() : null
                this.$el.appendChild(line.$el)
            }
        },
        updateFrame(){
            this.drawSVG = SVG(this.rootId).size(this.$mStore.state.mindmap.totalWidth, this.$mStore.state.mindmap.totalHeight)
        },
        bindKeys(){
            document.body.addEventListener("keydown", (evt)=>{
                let keyList = ["Tab", "Enter", "Backspace"]
                if(keyList.indexOf(evt.key)>=0){
                    evt.preventDefault()
                }
            })
            
            document.body.addEventListener("keyup", (evt)=>{
                if(evt.key === "Tab"){
                    evt.preventDefault()
                    this.insertChild(this.activeNode)
                }
                if(evt.key === "Enter"){
                    evt.preventDefault()
                    this.insertSibling()
                }
                if(evt.key === "Backspace"){
                    evt.preventDefault()
                    this.removeNode()
                }
            })
        },
        nodeClick(node){
            this.activeNode = node
        },
        insertChild(parentNode, data){
            let newChildNode = new Node({
                data: {
                    id: `node-${_.uniqueId()}`,
                    title: "Node #"+this.$mStore.getters.nodes.length,
                    children: [],
                    x: parentNode.x,
                    y: parentNode.y
                }
            })
            
            newChildNode.$parent = this
            parentNode.children.push(newChildNode)

            let newLine = new Line({
                data: {
                    id: utils.getLineId(parentNode, newChildNode),
                    x1: parentNode.x + parentNode.width,
                    y1: parentNode.y + (parentNode.height / 2),
                    x2: newChildNode.x + newChildNode.width,
                    y2: newChildNode.y + (newChildNode.height / 2)
                }
            })

            newLine.$parent = this
            parentNode.lines.push(newLine)
            
            this.activeNode = newChildNode
            
            newChildNode.$mount()
            newLine.$mount()
            this.$el.appendChild(newChildNode.$el)
            newChildNode.updatePosition()
            this.$el.appendChild(newLine.$el)
            newLine.updatePosition()

            this.updateLayout()
            this.updateFrame()
            
        },
        removeNode(){
            let parentNode = getParentNode(this.$mStore.state.mindmap, this.activeNode)
            parentNode.deleteChild(this.activeNode)
            this.activeNode = parentNode

            this.updateLayout()
            this.updateFrame()
        },
        insertSibling(){
            let parentNode = getParentNode(this.$mStore.state.mindmap, this.activeNode)
            parentNode ? this.insertChild(parentNode) : null
        }
    }
}

function getParentNode(root, node){
    if(!root) return null
    if(root.children.indexOf(node) >= 0){
        return root
    }
    for(let child of root.children){
        let foundParent = getParentNode(child, node)
        if(foundParent){
            return foundParent
        }
    }
    return null
}
</script>
