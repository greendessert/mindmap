// Lines should be generated as vue instance already
export default function lineLayout(mindmap, lines){
    let result = []
    helper(mindmap)
    function helper(node){
        if(!node || !node.children) return
        for(let i=0; i<node.children.length; i++){
            let child = node.children[i]
            helper(child)
            let lineId = getLineId(node, child)
            let targetLine = _.find(lines, {
                id: lineId
            })
            if(!targetLine) return
            targetLine.x1 = node.x+node.width
            targetLine.y1 = node.y+(node.height/2)
            targetLine.x2 = child.x
            targetLine.y2 = child.y+(child.height/2)
        }
    }
    return result
}

function getLineId(parent, child){
    return `(${parent.id})-(${child.id})`
}