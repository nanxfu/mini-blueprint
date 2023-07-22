<template>
  <div id="stage" ref="stageRef" class=" relative h-screen">
      <span
          class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10"
          @click="handler">Badge
      </span>
    <directive-node v-for="node in nodes" :title=node.title :key="node.title"></directive-node>
  </div>

</template>

<script setup lang="ts">
import {ref} from "vue";
import DirectiveNode from "../DNode/DNode.vue";
import {nodeProperties} from "../DNode/useNode";

const nodes = ref<Array<nodeProperties>>([])

function handler() {
  nodes.value.push({
    title: (Math.random() * 100).toString()
  })
}

</script>

<style scoped></style>