<template>
  <g>
    <path :d="dProp" stroke="#ffffff" stroke-width="5" strokeOpacity="1" fill="none" ></path>
  </g>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {Coord, LineProps} from "./useLine";


const props = defineProps<LineProps>()
const dProp = computed(()=>`M ${props.inputCoord.x} ${props.inputCoord.y} C ${middlePoint.x} ${props.inputCoord.y}, ${middlePoint.x} ${props.outputCoord.y}, ${props.outputCoord.x} ${props.outputCoord.y}`)
let middlePoint = calcMiddlePoint(props.inputCoord, props.outputCoord)

function calcMiddlePoint(start:Coord,end: Coord): Coord{
  return {
    x: (start.x + end.x)/2,
    y: (start.y + end.y)/2
  }
}

</script>

<style scoped>

</style>