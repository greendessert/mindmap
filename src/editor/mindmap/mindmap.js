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
        }
    },
    computed: {
        nodes(){
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

            this.mindmap = interpolateNodes(this.mindmapData, this)
            this.lines = interpolateLines(this.mindmap, this)

            rightLayout(this.mindmap)
            // lineLayout(this.mindmap)

            this.updateFrame()
            this.drawNodes()
            this.drawLines()
        },
        drawNodes(){
            for(let node of this.nodes){
                !node.$el ? node.$mount() : null
                this.$el.appendChild(node.$el)
            }
        },
        updateLayout(){
            rightLayout(this.mindmap)
        },
        drawLines(){
            for(let line of this.lines){
                !line.$el ? line.$mount() : null
                this.$el.appendChild(line.$el)
            }
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
            let newChildNode = new Node({
                data: {
                    id: `node-${_.uniqueId()}`,
                    title: "Node #"+this.nodes.length,
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
            let parentNode = getParentNode(this.mindmap, this.activeNode)
            parentNode.deleteChild(this.activeNode)
            this.activeNode = parentNode

            this.updateLayout()
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