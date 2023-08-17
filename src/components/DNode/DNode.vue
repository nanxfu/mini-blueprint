<template>
  <g x="30" y="30" transform="matrix(1,0,0,1,0,0)" @click.stop="handleClick" @mousemove="dragNode">
    <foreignObject width="192" height="128">
      <div class="node absolute resize shadow-blue-500/50" ref="nodeRef">
        <div class="flex flex-col w-48 h-32 rounded-md bg-gray-700 ">
          <header class="flex bg-gradient-to-r rounded-t-md  items-center from-indigo-500 ">
            <h1 class="flex-1 text-white text-center  select-none">
              {{ props.title }}</h1>
            <div class="w-4 h-4 mr-2 hover:scale-110 shadow-md rounded-full bg-slate-100"
                 @click.stop="handleConnect"></div>
          </header>
        </div>
      </div>
    </foreignObject>
  </g>
</template>

<script setup lang="ts">

import {ref} from "vue";
import {handleNodesConnect, nodeProperties} from "./useNode"

const props = defineProps<nodeProperties>()
const nodeRef = ref()
let scaleRatio = 1
const draging = ref(false)
let dragEl: HTMLElement

const clickCoord = {
  x: 0,
  y: 0
}
let preNodeCoord = []
// function handleDrage(e) {
//   // if(nodeRef.value.style) nodeRef.value.style = '6px'
//   // absolute元素相对position是相对于父元素的content区域，margin不参与计算
//   dragable(nodeRef!.value, e)
// }
function handleClick(e) {
  const regex = /matrix\([0-9,]+,(\d+),(\d+)\)$/;
  if (draging.value) {
    draging.value = false
  } else {
    draging.value = true
  }
  dragEl = e.currentTarget
  let svgElementTransform = dragEl.getAttribute("transform")
  //在设置dragedel后第一次输出 dragedel.getAttribute 会输出null（？:
  // 因为没在元素上默认设置transform
  preNodeCoord = svgElementTransform.match(regex) //需要获取当前结点的坐标，这样才能准确的使用transform位移结点
  clickCoord.x = e.clientX
  clickCoord.y = e.clientY
}

function dragNode(e: MouseEvent) {
  if (draging.value) {
    let deltaX = e.clientX - clickCoord.x
    let deltaY = e.clientY - clickCoord.y
    dragEl.setAttribute("transform", `matrix(1,0,0,1,${+preNodeCoord[1] + deltaX / scaleRatio},${+preNodeCoord[2] + deltaY / scaleRatio})`)
  }
}

function handleConnect(e: PointerEvent) {
  handleNodesConnect(e)
}
</script>