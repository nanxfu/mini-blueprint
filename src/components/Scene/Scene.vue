<template>
  <!--  //fabric-->
  <!--  canvas-->
  <!--  viewport-->
  <div class="_container h-screen w-screen overflow-hidden" ref="canvas">
    <svg width="100%" height="100%">
      <g transform="matrix(1,0,0,1,0,0)">
        <d-node title="233"></d-node>
        <d-node title="236"></d-node>
        <d-node title="244"></d-node>
        <d-line :input-coord=start :output-coord=end></d-line>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import DNode from "../DNode/DNode.vue";
import DLine from "../DLine.vue";

const canvas = ref<HTMLElement>()
const start = {
  x: 50,
  y: 50
}
const end = {
  x: 210,
  y: 210
}

</script>

<style scoped>
</style>