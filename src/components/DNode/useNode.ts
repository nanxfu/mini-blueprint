import {useLinesStore} from "../../store/Lines";

let preNode: HTMLElement

export interface nodeProperties {
    title: string,
    output?: string
}

export function handleNodesConnect(e: PointerEvent) {
    if(!(e.target instanceof HTMLElement)) return;  //类型守卫
    const uselines = useLinesStore()
    if (!preNode) {
        preNode = e.target
    } else {
        let previousNodeCenter = _calcCenterCoord(preNode)
        let presentNodeCenter = _calcCenterCoord(e.target)
        uselines.addLines({
            inputCoord: previousNodeCenter,
            outputCoord: presentNodeCenter
        })
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