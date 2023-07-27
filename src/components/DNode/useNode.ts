let clickedNode: HTMLElement;
let dragging = false;
let mousePoint: PointerEvent | null;
let initPosition = {
    left: 0,
    top: 0
}
let ratio = 1

export interface nodeProperties {
    title: string,
    output?: string
}

export function dragable(_ele: HTMLElement, _mousePoint: PointerEvent) {
    if (dragging) {
        dragging = false;
        return;
    }
    if (!clickedNode) {
        //防止重复添加EventListener
        window.addEventListener("mousemove", handleDragging);
    } else {
        //调整层级 从O(N)优化到O(1)
        clickedNode.style.zIndex = '1'
    }
    clickedNode = _ele;
    clickedNode.style.zIndex = '10'
    initPosition.left = clickedNode.offsetLeft
    initPosition.top = clickedNode.offsetTop
    mousePoint = _mousePoint;
    // console.log(mousePoint)
    dragging = true;
}

export function changeRatio() {
    ratio = 1.5
}

function getStyle(ele, cla?) {
    return window.getComputedStyle ? window.getComputedStyle(ele, cla) : ele.currentStyle;
}

function handleDragging(e: MouseEvent) {
    if (dragging) {
        console.log(getStyle(clickedNode).top)
        let deltaX = `${initPosition.left + (-mousePoint!.screenX + e.screenX) / ratio}px`
        let deltaY =  `${initPosition.top + (-mousePoint!.screenY + e.screenY) / ratio}px`;
        clickedNode.style.left = deltaX;
        clickedNode.style.top = deltaY
    }
}

