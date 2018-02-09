import Vue from 'vue'
import EditorDef from "./editor"
const Editor = Vue.extend(EditorDef)

export default class Editor2 {
    constructor(data){
        this.data = data
    }

    mount(id){
        let editor = new Editor()
        editor.$mount()

        let d = document.createElement("div")
        d.appendChild(document.createTextNode("Hello"))
        let cNode = document.getElementById(id)
        cNode.innerHTML = ""
        cNode.appendChild(editor.$el)

        editor.ready()
    }
}