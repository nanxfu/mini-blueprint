<template>
  <!--  //fabric-->
  <!--  canvas-->
  <!--  viewport-->
  <div class="_container h-screen w-screen overflow-hidden" ref="canvas">
    <!--    <div id="stage" ref="stageRef" class="relative w-[2000px] h-[2000px] origin-top-left" @mousemove="dragCanvas"-->
    <!--         @mousedown="mousedown" @mouseup="mouseup">-->
    <!--      <span-->
    <!--          class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 select-none"-->
    <!--          style="z-index: 100"-->
    <!--          @click="handler">Badge-->
    <!--      </span>-->
    <!--      <span-->
    <!--          class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 select-none"-->
    <!--          style="z-index: 100"-->
    <!--          @click="changeScale">changeScale-->
    <!--      </span>-->
    <!--      <span-->
    <!--          class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 select-none"-->
    <!--          style="z-index: 100"-->
    <!--          @click="capture">capture-->
    <!--      </span>-->
    <!--      <directive-node v-for="node in nodes" :title=node.title :key="node.title"></directive-node>-->
    <!--    </div>-->
    <svg width="100%" height="100%">
      <g transform="matrix(1,0,0,1,0,0)">
        <g x="30" y="30" transform="matrix(1,0,0,1,0,0)" @click.stop="clicksvg" @mousemove="dragNode">
          <foreignObject width="192" height="128">
            <div class="node absolute resize shadow-blue-500/50" ref="nodeRef">
              <div class="flex flex-col w-48 h-32 rounded-md bg-gray-700 ">
                <header class="flex bg-gradient-to-r rounded-t-md  items-center from-indigo-500 ">
<!--                  <div class="w-4 h-4 ml-2 hover:scale-110 shadow-md rounded-full bg-slate-100 "></div>-->
                  <h1 class="flex-1 text-white text-center  select-none" >
                    {{ 232323 }}</h1>
<!--                  <div class="w-4 h-4 mr-2 hover:scale-110 shadow-md rounded-full bg-slate-100 "></div>-->
                </header>
              </div>
            </div>
          </foreignObject>
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
// import DirectiveNode from "../DNode/DNode.vue";
// import {changeRatio, nodeProperties} from "../DNode/useNode";
// import * as htmlToImage from "html-to-image";

// const nodes = ref<Array<nodeProperties>>([])
const canvas = ref<HTMLElement>()
const stageRef = ref()
const drag = ref(false)
let scaleRatio = 1
let dragedel: HTMLElement

const clickCoord = {
  x: 0,
  y: 0
}
let preNodeCoord = []

function clicksvg(e) {
  if (drag.value) {
    drag.value = false
  } else {
    drag.value = true
  }
  dragedel = e.currentTarget
  console.log(e)
  let svgElementTransform = dragedel.getAttribute("transform")
  //在设置dragedel后第一次输出 dragedel.getAttribute 会输出null（？:
  // 因为没在元素上默认设置transform
  const regex = /matrix\([^,]+,[^,]+,[^,]+,[^,]+,(\d+),(\d+)\)/;
  preNodeCoord = svgElementTransform.match(regex)
  clickCoord.x = e.clientX
  clickCoord.y = e.clientY
}

function dragNode(e: MouseEvent) {
  if (drag.value) {
    let deltaX = e.clientX - clickCoord.x
    let deltaY = e.clientY - clickCoord.y
    dragedel.setAttribute("transform", `matrix(1,0,0,1,${+preNodeCoord[1] + deltaX / scaleRatio},${+preNodeCoord[2] + deltaY / scaleRatio})`)
  }
}

// function changeScale() {
//   stageRef.value.classList.add("scale-150")
//   changeRatio()
// }
//
// function mousedown(e: PointerEvent) {
//   drag.value = true
//   startClickCoord.x = e.clientX
//   startClickCoord.y = e.clientY
//   startScrollCoord.left = canvas.value!.scrollLeft
//   startScrollCoord.top = canvas.value!.scrollTop
// }
//
// function mouseup() {
//   drag.value = false
// }
//
// function dragCanvas(e: MouseEvent) {
//   if (drag.value) {
//     let relX = e.clientX - startClickCoord.x
//     let relY = e.clientY - startClickCoord.y
//     canvas.value!.scrollLeft = startScrollCoord.left - relX * 0.2
//     canvas.value!.scrollTop = startScrollCoord.top - relY * 0.5
//   }
// }

</script>

<style scoped>
</style>