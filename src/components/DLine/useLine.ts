import {ref} from "vue";
import {useLinesStore} from "../../store/Lines";

let movingLine = ref(false)

export interface LineProps {
    inputCoord: Coord,
    outputCoord: Coord
}

export interface LinePropsB{
    inputDNode: HTMLElement,
    outputDNode: HTMLElement
}

export interface Coord {
    x: number,
    y: number
}
export function handleNodesConnect(e: PointerEvent) {
    if(!(e.target instanceof HTMLElement)) return;  //类型守卫
    const useLines = useLinesStore()
    if (!preNode) {     //检查是第一次按下
        //移动曲线
        movingLine.value = false
        preNode = e.target
    } else {
        let previousNodeCenter = _calcCenterCoord(preNode)
        let presentNodeCenter = _calcCenterCoord(e.target)
        useLines.addLines({
            inputCoord: previousNodeCenter,
            outputCoord: presentNodeCenter
        })
    }
}

export function moveLineWithMouse(e: MouseEvent){
    if(movingLine.value){

    }
}
function _calcCenterCoord(el: HTMLElement) {
    let rect = el.getBoundingClientRect()
    let x = rect.left + (rect.right - rect.left) / 2
    let y = rect.top + (rect.bottom - rect.top) / 2
    return {
        x,
        y
    }
}

function handleObeserve(mutation, ca){

}