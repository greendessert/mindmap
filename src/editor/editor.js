import Vue from 'vue'
import EditorDef from "./editor.vue"
const Editor = Vue.extend(EditorDef)

export default class Editor2 {
    constructor(data){
        this.data = data
    }

    mount(id){
        let editor = new Editor()
        editor.$mount()
        let cNode = document.getElementById(id)
        cNode.innerHTML = ""
        cNode.appendChild(editor.$el)
        editor.ready()
    }
}