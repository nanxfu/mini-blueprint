<template>
  <g>
    <path :d="dProp" stroke="#ffffff" stroke-width="5" strokeOpacity="1" fill="none"></path>
    {{ dProp }}
  </g>
</template>

<script setup lang="ts">
import {computed, ref, watch} from "vue";
import {Coord, LineProps, useBindingNodeCoord} from "./useLine";
import {useGlobalStateStore} from "../../store/globalState";
import {useDNodesStore} from "../../store/DNodes";
import {storeToRefs} from "pinia";
import {getCoord} from "../DNode/useNode";

const props = defineProps<LineProps>()
const {mousePos, ConnectingNodes, preNodeID} = storeToRefs(useGlobalStateStore())
let middlePoint

let dProp = ref('')
let stopWatchCurvePos
//触发曲线位置改变的方式
//1.绑定的结点位置移动
//2.未完成结点连接时曲线跟随鼠标移动
//3.绑定结点时绘制曲线
//直接绑定结点id，观测结点变化。由父组件观测变化并通知给子组件
//注意中心点也需要变化
// let middlePoint = calcMiddlePoint(inputCoord, outputCoord)  //自动避免TDZ

  if (props.isConnectedLine) {
    //连接好的线
    let [inputCoord, outputCoord] = useBindingNodeCoord(props.inputDnode as string, props.outputDnode as string)
    middlePoint = computed<Coord>(() => calcMiddlePoint(inputCoord, outputCoord))
    const curvePos = computed(() => `M ${inputCoord.x} ${inputCoord.y} C ${middlePoint.value.x} ${inputCoord.y}, ${middlePoint.value.x} ${outputCoord.y}, ${outputCoord.x} ${outputCoord.y}`)

    watch(curvePos, () => {
      dProp.value = curvePos.value
    }, {immediate: true})
  } else {
    watch(ConnectingNodes, () => {
      if (ConnectingNodes.value) {
        let inputCoord = getCoord(preNodeID.value)
        let outputCoord = mousePos.value
        //未连接好的线
        middlePoint = computed<Coord>(() => calcMiddlePoint(inputCoord, outputCoord))
        const curvePos = computed(() => `M ${inputCoord.x} ${inputCoord.y} C ${middlePoint.value.x} ${inputCoord.y}, ${middlePoint.value.x} ${outputCoord.y}, ${outputCoord.x} ${outputCoord.y}`)
        stopWatchCurvePos = watch(curvePos, () => {
          dProp.value = curvePos.value
        }, {
          immediate: true
        })
      }
    },{
      immediate: true
    })
  }


function calcMiddlePoint(start: Coord, end: Coord): Coord {
  return {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2
  }
}

</script>

<style scoped>
path {
  pointer-events: none;
}
</style>