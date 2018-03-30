import Vue from 'vue'
import Vuex from "vuex"

import nodeDef from './mindmap/node.vue'
const Node = Vue.extend(nodeDef)
import lineDef from './mindmap/line.vue'
const Line = Vue.extend(lineDef)
import * as utils from './mindmap/utils'

import mindmapData from "./data/mindmapData.js"

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        mindmap: { },
        lines: []
    },
    getters: {
        nodes(state){
            return getNodes(state.mindmap)
        }
    },
    mutations: {
        setMindmap(state, { mindmapData, parent, layoutFunc }) {
            let mindmap = interpolateNodes(mindmapData, parent)
            let lines = interpolateLines(mindmap, parent)
            layoutFunc(mindmap)
            state.mindmap = mindmap
            state.lines = lines
        }
    },
    actions: {

    }
})

// store.commit("setMindmap", mindmapData)

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

export default store