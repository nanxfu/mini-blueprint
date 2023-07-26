<template>
  <!--  //fabric-->
  <!--  canvas-->
  <!--  viewport-->
  <div class="_container h-screen w-screen overflow-scroll" ref="canvas">
    <div id="stage" ref="stageRef" class="relative w-[2000px] h-[2000px] origin-top-left" @mousemove="dragCanvas"
         @mousedown="mousedown" @mouseup="mouseup">
      <span
          class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10"
          style="z-index: 100"
          @click="handler">Badge
      </span>
      <span
          class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10"
          style="z-index: 100"
          @click="changeScale">changeScale
      </span>
      <directive-node v-for="node in nodes" :title=node.title :key="node.title"></directive-node>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import DirectiveNode from "../DNode/DNode.vue";
import {changeRatio, nodeProperties} from "../DNode/useNode";

const nodes = ref<Array<nodeProperties>>([])
const canvas = ref<HTMLElement>()
const stageRef = ref()
const drag = ref(false)
const startCoord = {
  x: 0,
  y: 0
}
function handler() {
  nodes.value.push({
    title: (Math.random() * 100).toString()
  })
}

function changeScale() {
  stageRef.value.classList.add("scale-150")
  changeRatio()
}

function mousedown(e: PointerEvent) {
  drag.value = true
  console.log(e.clientX)
  startCoord.x = e.clientX
  startCoord.y = e.clientY
}
function mouseup() {
  drag.value = false
}
function dragCanvas(e: MouseEvent) {
  if(drag.value) {
    let relX = e.clientX - startCoord.x
    let relY = e.clientY - startCoord.y
    canvas.value!.scrollLeft += -relX *0.02
    console.log(-relX *0.1)
    canvas.value!.scrollTop += -relY*0.02
  }
}

</script>

<style scoped>

</style>