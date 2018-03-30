import Vue from 'vue'
import EditorDef from "./editor.vue"
import store from "./store"
const EditorComp = Vue.extend(EditorDef)

let mindmapPlugin = {
    install(Vue, options){
        Vue.prototype.$mStore = store
    }
}

Vue.use(mindmapPlugin)

export default class Editor {
    constructor(data){
        this.data = data
    }

    mount(id){
        let editor = new EditorComp()
        editor.$mount()
        let cNode = document.getElementById(id)
        cNode.innerHTML = ""
        cNode.appendChild(editor.$el)
        editor.ready()
    }
}