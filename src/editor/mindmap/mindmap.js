import _ from "lodash"
import rightLayout from './layouts/right-layout'
import Vue from 'vue'
const SVG = require("svg.js")
import nodeDef from './node.vue'
const Node = Vue.extend(nodeDef)
import lineDef from './line.vue'
const Line = Vue.extend(lineDef)
import * as utils from './utils'

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
            canvas: null
        }
    },
    computed: {
        nodes(){
            return getNodes(this.mindmap)
        }
    },
    mounted(){
        this.bindKeys()
        this.canvas = this.$refs["canvas"]
    },
    methods: {
        draw(){
            this.drawSVG = SVG(this.rootId)
            this.redraw()
        },
        redraw(){
            document.getElementById(this.rootId).innerHTML=""

            this.mindmap = interpolateNodes(this.mindmapData, this)
            this.lines = interpolateLines(this.mindmap, this)

            this.updateLayout()
            
            this.updateFrame()
            this.drawNodes()
            this.drawLines()
            this.applyLayout()
        },
        drawNodes(){
            for(let node of this.nodes){
                !node.$el ? node.$mount() : null
                this.canvas.appendChild(node.$el)
            }
        },
        updateLayout(){
            rightLayout(this.mindmap)
        },
        applyLayout(){
            this.mindmap.applyLayout()
        },
        drawLines(){
            for(let line of this.lines){
                !line.$el ? line.$mount() : null
                this.canvas.appendChild(line.$el)
            }
        },
        updateFrame(){
            // this.drawSVG = SVG(this.rootId).size(this.mindmap.totalWidth, this.mindmap.totalHeight)
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
        async insertChild(parentNode, data){
            let newChildNode = new Node({
                data: {
                    id: `node-${_.uniqueId()}`,
                    title: "Node #"+this.nodes.length,
                    children: [],
                    parent: this
                }
            })
            newChildNode.$parent = this
            parentNode.children.push(newChildNode)

            let newLine = new Line({
                data: {
                    id: utils.getLineId(parentNode, newChildNode)
                }
            })
            newLine.$parent = this
            parentNode.lines.push(newLine)
            
            this.activeNode = newChildNode

            
            this.updateLayout()

            newLine.c_x1 = parentNode.c_x+parentNode.width
            newLine.c_y1 = parentNode.c_y+(parentNode.height/2)
            newLine.c_x2 = newChildNode.x
            newLine.c_y2 = newChildNode.y+(newChildNode.height/2)
            newChildNode.c_x = newChildNode.x
            newChildNode.c_y = newChildNode.y
            
            newChildNode.$mount()
            newLine.$mount()
            
            this.canvas.appendChild(newChildNode.$el)
            this.canvas.appendChild(newLine.$el)

            this.mindmap.applyLayout()
            this.updateFrame()

        },
        removeNode(){
            let parentNode = getParentNode(this.mindmap, this.activeNode)
            parentNode.deleteChild(this.activeNode)
            this.activeNode = parentNode

            this.updateLayout()
            this.mindmap.applyLayout()
            this.updateFrame()
        },
        insertSibling(){
            let parentNode = getParentNode(this.mindmap, this.activeNode)
            parentNode ? this.insertChild(parentNode) : null
        }
    }
}

// Return Array Of Nodes
function getNodes(mindmap){
    let result = [mindmap]
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

function getLines(mindmap){
    let lines = []
    helper(mindmap)
    function helper(node){
        if(!node) return
        lines.push(...node.children)
        if(!node.children) return
        for(let i=0; i<node.children.length; i++){
            helper(node.children[i])
        }
    }
    return lines
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
            node.lines.push(line)
            result.push(line)
        }
    }
    return result
}