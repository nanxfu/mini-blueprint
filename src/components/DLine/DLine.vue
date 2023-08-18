<template>
  <g>
    <path :d="dProp" stroke="#ffffff" stroke-width="5" strokeOpacity="1" fill="none"></path>
  </g>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {Coord, LineProps, moveLineWithMouse} from "./useLine";
let middlePoint = calcMiddlePoint(props.inputCoord, props.outputCoord)  //自动避免TDZ

const props = defineProps<LineProps>()
//触发曲线位置改变的方式
//1.绑定的结点位置移动
//2.未完成结点连接时曲线跟随鼠标移动
//3.绑定结点时绘制曲线

//直接绑定结点，获取两个结点实例
const dProp = computed(() => `M ${props.inputCoord.x} ${props.inputCoord.y} C ${middlePoint.x} ${props.inputCoord.y}, ${middlePoint.x} ${props.outputCoord.y}, ${props.outputCoord.x} ${props.outputCoord.y}`)
window.addEventListener("mousemove", moveLineWithMouse)
function calcMiddlePoint(start: Coord, end: Coord): Coord {
  return {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2
  }
}

</script>

<style scoped>

</style>