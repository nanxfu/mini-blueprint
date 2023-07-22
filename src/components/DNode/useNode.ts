import {ref} from "vue";

let clickedNode: HTMLElement;
let dragging = false;
let mousePoint: PointerEvent| null;
export let topNode = ref<HTMLElement>()
export interface nodeProperties {
    title: string,
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
    mousePoint = _mousePoint;
    dragging = true;
}

function handleDragging(e: MouseEvent) {
    if (dragging) {
        clickedNode.style.left = `${-mousePoint!.offsetX + e.clientX}px`;
        clickedNode.style.top = `${-mousePoint!.offsetY + e.clientY}px`;
    }
}

