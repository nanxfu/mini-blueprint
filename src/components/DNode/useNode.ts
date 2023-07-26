import {ref} from "vue";

let clickedNode: HTMLElement;
let dragging = false;
let mousePoint: PointerEvent| null;
let initPosition:DOMRect
let ratio = 1
export interface nodeProperties {
    title: string,
    output?:string
}
export function dragable(_ele: HTMLElement, _mousePoint: PointerEvent) {
    if (dragging) {
        dragging = false;
        return;
    }
    if(!clickedNode){
        //防止重复添加EventListener
        window.addEventListener("mousemove", handleDragging);
    }else {
        //调整层级 从O(N)优化到O(1)
        clickedNode.style.zIndex = '1'
    }
    clickedNode = _ele;
    clickedNode.style.zIndex = '10'
    initPosition = clickedNode.getBoundingClientRect()
    mousePoint = _mousePoint;
    dragging = true;
}
export function changeRatio(){
    ratio = 1.5
}
function handleDragging(e: MouseEvent) {
    if (dragging) {
        console.log(e.offsetY - mousePoint!.offsetY)
        //todo 改为鼠标到画布的位置
        clickedNode.style.left = `${(initPosition.left+ -mousePoint!.clientX + e.clientX)/ratio}px`;
        clickedNode.style.top = `${(initPosition.top +- mousePoint!.clientY + e.clientY)/ratio}px`;
    }
}

