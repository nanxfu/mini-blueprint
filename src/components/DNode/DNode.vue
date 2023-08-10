<template>
  <div class="node absolute resize shadow-blue-500/50" ref="nodeRef">
    <div class="flex flex-col w-48 h-32 rounded-md bg-gray-700 ">
      <header class="flex bg-gradient-to-r rounded-t-md  items-center from-indigo-500 ">
        <div class="w-4 h-4 ml-2 hover:scale-110 shadow-md rounded-full bg-slate-100 "></div>
        <h1 class="flex-1 text-white text-center  select-none" @click="handleDrage">
          {{ props.title.slice(0, 3) }}</h1>
        <div class="w-4 h-4 mr-2 hover:scale-110 shadow-md rounded-full bg-slate-100 "></div>
      </header>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref } from "vue";
import { dragable, nodeProperties } from "./useNode"

const props = defineProps<nodeProperties>()
const nodeRef = ref()

function handleDrage(e) {
  // if(nodeRef.value.style) nodeRef.value.style = '6px'
  // absolute元素相对position是相对于父元素的content区域，margin不参与计算
  dragable(nodeRef!.value, e)
}


</script>