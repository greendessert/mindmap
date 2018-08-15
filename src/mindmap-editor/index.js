import Editor from './editor.vue'

import Vue from 'vue'
import store from "./store"

let mindmapPlugin = {
    install(Vue, options){
        Vue.prototype.$mStore = store
    }
}

Vue.use(mindmapPlugin)

export default Editor