<template>
  <div class="node absolute" ref="nodeRef">
    <div class="flex flex-col w-48 h-32 rounded-md bg-gray-700">
      <h1 class="w-full text-white rounded-t-md text-center bg-gradient-to-r from-indigo-500 select-none" @click="handleDrage">
        {{ props.title }}</h1>
    </div>

  </div>

</template>

<script setup lang="ts">

import {ref} from "vue";
import {dragable} from "./useNode"

const props = defineProps<{
  title: string,
  output?: string
}>()
const nodeRef = ref()

function handleDrage(e) {
  // if(nodeRef.value.style) nodeRef.value.style = '6px'
  // absolute元素相对position是相对于父元素的content区域，margin不参与计算

  //调整层级 复杂度为O(1)

  dragable(nodeRef!.value, e)
}


</script>