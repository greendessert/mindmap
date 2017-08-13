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
// import lineLayout2 from './layouts/line-layout2'

// Mind Map Vue MixIn
export const MindMapMixIn = {
    data(){
        return {
            rootId: "",
            drawSVG: ()=>{  },
            mindmapData: {  }, // Not maintained after initialization
            mindmap: {  }, // After Interpolation
            lines: [ ], // Vue instances
            activeNode: null,
        }
    },
    computed: {
        nodes(){ //Change to nodes
            return getNodes(this.mindmap)
        }
    },
    mounted(){
        this.bindKeys()
    },
    methods: {
        draw(){
            this.drawSVG = SVG(this.rootId)
            this.redraw()
        },
        redraw(){
            document.getElementById(this.rootId).innerHTML=""
            // Replace Nodes Into Vue Instance
            this.mindmap = interpolateNodes(this.mindmapData, this)
            // Assign Coordinates And Other Stuff
            rightLayout(this.mindmap)
            // Assign Lines
            this.lines = interpolateLines(this.mindmap, this)
            // Assign layout
            lineLayout(this.mindmap, this.lines)
            // Try to use insertNode API Only?
            this.updateFrame()
            this.drawNodes()
            this.drawLines()
        },
        drawNodes(){
            this.nodes.map((node)=>{
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
            this.drawSVG = SVG(this.rootId).size(this.mindmap.totalWidth, this.mindmap.totalHeight)
        },
        bindKeys(){
            window.addEventListener("keydown", (evt)=>{
                evt.preventDefault()
                if(evt.key === "Tab"){
                    this.insertChild(this.activeNode)
                }
                if(evt.key === "Enter"){
                    this.insertSibling()
                }
                if(evt.key === "Backspace"){
                    this.removeNode()
                }
            })
        },
        nodeClick(node){
            this.activeNode = node
        },
        insertChild(parentNode, data){
            let newNode = new Node({
                data: {
                    id: "#"+this.nodes.length,
                    title: "Node #"+this.nodes.length,
                    children: [],
                    parent: this
                }
            })
            newNode.$parent = this
            newNode.$mount()

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
            this.activeNode = newNode
        },
        removeNode(){
            // Remove Routing 
            let parentNode = getParentNode(this.mindmap, this.activeNode)
            // Remove From Parent
            let index = parentNode.children.indexOf(this.activeNode)
            parentNode.children.splice(index, 1)
            // Set New Active Node
            // Destroy Recursively
            this.activeNode.$destroy()
            // Update Layout
            this.activeNode = parentNode
            this.updateNodes()
        },
        insertSibling(){
            let parentNode = getParentNode(this.mindmap, this.activeNode)
            parentNode ? this.insertChild(parentNode) : null
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

function interpolateNodes(mindmapData, parent){
    function interpolate(rootNode){
        if(!rootNode) return
        rootNode.children = rootNode.children.map((child)=>interpolate(child))
        let node = new Node({
            data: {
                id: rootNode.id,
                title: rootNode.title,
                children: rootNode.children
            }
        })
        node.$parent = parent
        node.$mount()
        return node
    }
    let interpolated = interpolate(mindmapData)
    return interpolated
}


function interpolateLines(mindmap, parent){
    let result = []
    helper(mindmap)
    function helper(node){
        if(!node || !node.children) return
        for(let i=0; i<node.children.length; i++){
            let child = node.children[i]
            helper(child)
            let line = new Line({
                data: {
                    id: utils.getLineId(node, child),
                }
            })
            line.$parent = parent
            line.$mount()
            result.push(line)
        }
    }
    return result
}