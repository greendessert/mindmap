import Vue from 'vue'
import Vuex from "vuex"

import mindmapData from "./data/mindmapData.js"

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        mindmap: { }
    },
    mutations: {
        setMindmap(state, mindmapData, parent, layoutFunc) {
            state.mindmap = mindmapData
            // let mindmap = interpolateNodes(mindmapData, parent)
            // let lines = interpolateLines(mindmapData, parent)
            // layoutFunc(mindmap)
            // state.mindmap = mindmap
        }
    },
    actions: {

    }
})

store.commit("setMindmap", mindmapData)

export default store