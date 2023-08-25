<template>
  <div class="w-4 h-4 mr-2 hover:scale-110 shadow-md rounded-full bg-slate-100"
       @click.stop="handleConnect" ref="connectPointRef"></div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
const connectPointRef = ref<HTMLElement | null>(null)
const pointPos = reactive({
  x: 0,
  y: 0
})
function updatePointPos(){
  const clientRect = connectPointRef.value!.getBoundingClientRect()
  pointPos.x = clientRect.left
  pointPos.y = clientRect.top
}

defineExpose({
  updatePointPos
})
</script>

<style scoped>

</style>