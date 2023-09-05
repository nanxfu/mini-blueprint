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
import {storeToRefs} from "pinia";
import {getCoord, notifyEvent, registeEvent} from "../DNode/useNode";
import {useLinesStore} from "../../store/DLines";

const useLines = useLinesStore()
const props = defineProps<LineProps>()
const {mousePos, ConnectingNodes, preNodeID} = storeToRefs(useGlobalStateStore())
let middlePoint

let dProp = ref('')
let stopWatchCurvePos
if (props.isConnectedLine) {
  //连接好的线
  let [inputCoord, outputCoord] = useBindingNodeCoord(props.inputDnode as string, props.outputDnode as string)
  middlePoint = computed<Coord>(() => calcMiddlePoint(inputCoord, outputCoord))
  const curvePos = computed(() => `M ${inputCoord.x} ${inputCoord.y} C ${middlePoint.value.x} ${inputCoord.y}, ${middlePoint.value.x} ${outputCoord.y}, ${outputCoord.x} ${outputCoord.y}`)
  registeEvent(props.id, (DnodeID) => {
    // notifyEvent()
    if (props.inputDnode == DnodeID) {
      //来自上游的删除消息说明上游结点已经被删除，故通知下游结点删除
      notifyEvent(props.outputDnode + 'removeLine', props.id)
    } else {
      notifyEvent(DnodeID + 'removeLine', props.id)
    }
    useLines.delLine(props.index)
  })
  watch(curvePos, () => {
    dProp.value = curvePos.value
  }, {immediate: true})
  //注册删除事件
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
  }, {
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