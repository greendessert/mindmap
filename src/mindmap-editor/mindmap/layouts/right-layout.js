// Mindmap should be vue nodes with lines assigned already
import * as _ from 'lodash'
import * as utils from '../utils'
export default function rightLayout(mindmap){
    let marginRight = 50
    let marginBottom = 50
    let mapRoot = mindmap
    
    assignHeights(mapRoot)
    assignWidth(mapRoot)
    // assignLevel(mapRoot)
    assignCoordinates(mapRoot)
    
    function assignHeights(root){
        let blockHeight = root.height || 100
        root.height = root.height || blockHeight
        if(!root.children || !root.children.length){
            root.totalHeight = blockHeight
            return blockHeight
        }
        root.totalHeight = root.children.reduce((prev, child, index) => {
            return prev + assignHeights(child)
        }, 0)
        return root.totalHeight
    }

    function assignWidth(root){
        let blockWidth = root.width || 100
        root.width = root.width || blockWidth
        if(!root.children || !root.children.length){
            root.totalWidth = blockWidth
            return blockWidth
        }
        let childWidth = root.children.reduce((prev, child, index) => {
            let childWidth = assignWidth(child)
            if(childWidth > prev) {
                return childWidth
            } else {
                return prev
            }
        }, 0)
        root.totalWidth = root.width + childWidth + marginRight
        return root.totalWidth
    }

    function assignLevel(root){
        breathFirst(root)
        function breathFirst(root){
            let level = 0
            if(!root) return
            root.level = level
            let indexHash = {

            }
            let nodes = [root]

            while(nodes.length){
                let node = nodes.shift()
                level = node.level
                node.children.forEach((childNode)=>{ 
                    childNode.level = level+1
                    indexHash[level+1] = indexHash[level+1]===undefined ? 0 : indexHash[level+1]+1
                    childNode.levelIndex = indexHash[level+1]
                })
                if(node.children) nodes = nodes.concat(node.children)
            }
        }
    }

    function assignCoordinates(root, offsetX=0, offsetY=0){
        let blockWidth = root.width || 100
        root.width = root.width || blockWidth
        root.x = offsetX
        if(root.children.length>=2){
            let topNodeHeight = root.children[0].totalHeight
            , bottomNodeHeight = root.children[root.children.length-1].totalHeight
            , heightBetween = 0
            for(let i=1; i<root.children.length-1; i++){
                heightBetween+=root.children[i].totalHeight
            }
            let localOffset = ((topNodeHeight/2) + heightBetween + (bottomNodeHeight/2))/2 + (topNodeHeight/2)
            root.y = offsetY + localOffset - (blockWidth/2)     
        } else {
            root.y = offsetY + (root.totalHeight/2) - (blockWidth/2)
        }
        root.children.reduce((heightSum, child) => {
            assignCoordinates(child, offsetX + blockWidth + marginRight, offsetY + heightSum)

            // Assign Line Coordinates
            let line = _.find(root.lines, {id: utils.getLineId(root, child)})
            line.x1 = root.x + root.width
            line.y1 = root.y + (root.height/2)
            line.x2 = child.x
            line.y2 = child.y + (child.height/2)
            line.parentNode = root
            line.childNode = root
            
            return heightSum + child.totalHeight
        }, 0)
    }
    
    return mapRoot
}