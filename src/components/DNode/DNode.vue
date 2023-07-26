<template>
  <div class="node absolute resize shadow-blue-500/50" ref="nodeRef">
    <div class="flex flex-col w-48 h-32 rounded-md bg-gray-700 ">
      <header>
        <h1 class="flex-1 text-white rounded-t-md text-center bg-gradient-to-r from-indigo-500 select-none" @click="handleDrage">
          {{ props.title }}</h1>
      </header>
    </div>
  </div>

</template>

<script setup lang="ts">

import {ref} from "vue";
import {dragable, nodeProperties} from "./useNode"

const props = defineProps<nodeProperties>()
const nodeRef = ref()

function handleDrage(e) {
  // if(nodeRef.value.style) nodeRef.value.style = '6px'
  // absolute元素相对position是相对于父元素的content区域，margin不参与计算
  dragable(nodeRef!.value, e)
}


</script>