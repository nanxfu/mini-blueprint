<template>
  <g>
    <path :d="dProp" stroke="#ffffff" stroke-width="5" strokeOpacity="1" fill="none"></path>
  </g>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {Coord, LineProps, useBindingNodeCoord} from "./useLine";

const props = defineProps<LineProps>()
//触发曲线位置改变的方式
//1.绑定的结点位置移动
//2.未完成结点连接时曲线跟随鼠标移动
//3.绑定结点时绘制曲线
//直接绑定结点id，观测结点变化。由父组件观测变化并通知给子组件

let [inputCoord, outputCoord] = useBindingNodeCoord(props.inputDnode, props.outputDnode)
console.log(inputCoord, outputCoord)
//注意中心点也需要变化
// let middlePoint = calcMiddlePoint(inputCoord, outputCoord)  //自动避免TDZ
let middlePoint = computed<Coord>(()=> calcMiddlePoint(inputCoord, outputCoord))
const dProp = computed(() => `M ${inputCoord.x} ${inputCoord.y} C ${middlePoint.value.x} ${inputCoord.y}, ${middlePoint.value.x} ${outputCoord.y}, ${outputCoord.x} ${outputCoord.y}`)

function calcMiddlePoint(start: Coord, end: Coord): Coord {
  return {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2
  }
}

</script>

<style scoped>

</style>