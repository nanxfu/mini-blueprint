let clickedNode: HTMLElement;
let dragging = false;
let mousePoint: PointerEvent| null;
let initPosition = {
    left:0,
    top:0
}
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
    initPosition.left = clickedNode.offsetLeft
    initPosition.top = clickedNode.offsetTop
    mousePoint = _mousePoint;
    dragging = true;
}
export function changeRatio(){
    ratio = 1.5
}
function handleDragging(e: MouseEvent) {
    if (dragging) {
        console.log(-mousePoint!.screenX + e.screenX)
        clickedNode.style.left = `${(initPosition.left+ -mousePoint!.screenX + e.screenX)/ratio}px`;
        clickedNode.style.top = `${(initPosition.top +- mousePoint!.screenY + e.screenY)/ratio}px`;
    }
}

