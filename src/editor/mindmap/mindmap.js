import _ from "lodash"
import rightLayout from './layouts/right-layout'
import Vue from 'vue'
const SVG = require("svg.js")
import nodeDef from './node.vue'
const Node = Vue.extend(nodeDef)
import lineDef from './line.vue'
const Line = Vue.extend(lineDef)
import * as utils from './utils'
import lineLayout from './layouts/line-layout'

// Mind Map Vue MixIn

export const MindMapMixIn = {
    data(){
        return {
            rootId: "",
            drawSVG: ()=>{  },
            mindmapData: {  }, // Not maintained after initialization
            mindmap: {  }, // After Interpolation
            lines: [ ], // Vue instances
        }
    },
    computed: {
        nodes(){ //Change to nodes
            return getNodes(this.mindmap)
        }
    },
    methods: {
        draw(){
            this.drawSVG = SVG(this.rootId).size(3000, 3000)
            this.redraw()
        },
        redraw(){
            document.getElementById(this.rootId).innerHTML=""
            // Replace Nodes Into Vue Instance
            this.mindmap = interpolateNodes(this.mindmapData)
            // Assign Coordinates And Other Stuff
            rightLayout(this.mindmap)
            // Assign Lines
            this.lines = interpolateLines(this.mindmap)
            // Assign layout
            lineLayout(this.mindmap, this.lines)
            // Try to use insertNode API Only?
            this.drawNodes()
            this.drawLines()
        },
        drawNodes(){
            this.nodes.map((node)=>{
                // Assign Parent So Node And Mindmap Can Talk To Each Other.
                node.$parent = this
                // Append Node
                this.$el.appendChild(node.$el)
            })
        },
        updateNodes(){
            rightLayout(this.mindmap)
        },
        drawLines(){
            for(let line of this.lines){
                this.$el.appendChild(line.$el)
            }
        },
        updateLines(){
            lineLayout(this.mindmap, this.lines)
        },
        updateFrame(){

        },
        nodeClick(rootNode){
            this.insertNode(rootNode)
        },
        insertNode(rootNode, data){
            let newNode = new Node({
                data: {
                    id: "#"+this.nodes.length,
                    title: "Node #"+this.nodes.length,
                    children: []
                }
            }).$mount()
            newNode.$parent = this
            let parentNode = searchNodeById(this.mindmap, rootNode.id)
            parentNode.children.push(newNode)
            this.$el.appendChild(newNode.$el)

            // Change Name To Parent Node?
            let newLine = new Line({
                data: {
                    id: utils.getLineId(parentNode, newNode)
                }
            }).$mount()
            newLine.$parent = this
            this.lines.push(newLine)
            this.$el.appendChild(newLine.$el)

            this.updateNodes()
            this.updateLines()
            this.updateFrame()
            // Use redraw
            // let parentNode = searchNodeById(this.mindmapData, rootNode.id)
            // parentNode.children.push({
            //     id: "#"+this.nodes.length,
            //     title: "Node #"+this.nodes.length,
            //     children: []
            // })
            // this.redraw()
        }
    }
}

// Return Array Of Nodes
function getNodes(mindmap){
    let result = []
    helper(mindmap)
    function helper(node){
        if(!node) return
        result.push(node)
        if(!node.children) return
        for(let i=0; i<node.children.length; i++){
            helper(node.children[i])
        }
    }
    return result
}

// Make a mindmap class maybe?
function searchNodeById(root, id){
    if(!root) return null
    if(root.id===id){
        return root
    }
    for(let child of root.children) {
        let foundNode = searchNodeById(child, id)
        if(foundNode){
            return foundNode
        }
    }
    return null
}

function interpolateNodes(mindmapData){
    function interpolate(rootNode){
        if(!rootNode) return
        rootNode.children = rootNode.children.map((child)=>interpolate(child))
        let node = new Node({
            data: {
                id: rootNode.id,
                title: rootNode.title,
                children: rootNode.children
            }
        }).$mount()
        return node
    }
    let interpolated = interpolate(mindmapData)
    return interpolated
}


function interpolateLines(mindmap){
    let result = []
    helper(mindmap)
    function helper(node){
        if(!node || !node.children) return
        for(let i=0; i<node.children.length; i++){
            let child = node.children[i]
            helper(child)
            result.push(
                new Line({
                    data: {
                        id: utils.getLineId(node, child),
                    }
                }).$mount()
            )
        }
    }
    return result
}