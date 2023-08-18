<template>
  <g x="30" y="30" :transform="transformMatrix" @click.stop="handleClick" @mousemove="dragNode">
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

import {computed, reactive, ref, unref} from "vue";
import {nodeProperties} from "./useNode"
import {Coord, handleNodesConnect} from "../DLine/useLine";

const props = defineProps<nodeProperties>()
const nodeRef = ref()

const draging = ref(false)
const transformMatrix = computed(() => `matrix(1,0,0,1,${NodeCoord.x},${NodeCoord.y})`)

const NodeCoord = reactive<Coord>({
  x: 0,
  y: 0
})
const clickCoord: Coord = {
  x: 0,
  y: 0
}

let NodeCoordWhenClicked: Coord = {
  x: 0,
  y: 0
}
let scaleRatio = 1


function handleClick(e) {
  if (draging.value) {
    draging.value = false
  } else {
    draging.value = true
  }
  clickCoord.x = e.clientX
  clickCoord.y = e.clientY
  NodeCoordWhenClicked = {...NodeCoord}
}

function dragNode(e: MouseEvent) {
  if (draging.value) {
    let deltaX = e.clientX - clickCoord.x
    let deltaY = e.clientY - clickCoord.y
    NodeCoord.x = NodeCoordWhenClicked.x + deltaX / scaleRatio
    NodeCoord.y = NodeCoordWhenClicked.y + deltaY / scaleRatio
  }
}

function handleConnect(e: PointerEvent) {
  handleNodesConnect(e)
}
</script>