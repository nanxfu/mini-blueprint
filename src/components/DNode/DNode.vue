<template>
  <g x="30" y="30" :transform="transformMatrix" @click.stop="handleClick">
    <foreignObject width="192" height="128">
      <div class="node absolute resize shadow-blue-500/50" ref="nodeRef">
        <div class="flex flex-col w-48 h-32 rounded-md bg-gray-700 ">
          <header class="flex bg-gradient-to-r rounded-t-md  items-center from-indigo-500 ">
            <h1 class="flex-1 text-white text-center  select-none">
              {{ props.title }}</h1>
            <div class="w-4 h-4 mr-2 hover:scale-110 shadow-md rounded-full bg-slate-100"
                 @click.stop="handleConnect" ref="connectPointRef"></div>
          </header>
        </div>
      </div>
    </foreignObject>
  </g>
</template>

<script setup lang="ts">

import {computed, reactive, ref, watch} from "vue";
import {calcCenterCoord, mapIdToCoord, nodeProps} from "./useNode"
import {Coord} from "../DLine/useLine";
import {useLinesStore} from "../../store/Lines";
import {v4 as uuid} from "uuid";
import {useDNodesStore} from "../../store/DNodes";
import {useGlobalStateStore} from "../../store/globalState";
// import {useMouseMove} from "../Scene/useScene";

const props = defineProps<nodeProps>()
const nodeRef = ref()
const draging = ref(false)
const transformMatrix = computed(() => `matrix(1,0,0,1,${NodeCoord.x},${NodeCoord.y})`)
const NodeCoord: Coord = reactive({
  x: 0,
  y: 0
})
const NodeWidth = 176
const NodeHeight = 10
const ConnectedPointCoord:Coord = reactive({
  x: 0,
  y: 0
})
watch([NodeCoord], ()=>{
  ConnectedPointCoord.x = NodeCoord.x + NodeWidth
  ConnectedPointCoord.y = NodeCoord.y + NodeHeight
})

const clickCoord: Coord = {
  x: 0,
  y: 0
}
const useLines = useLinesStore()
const useDNode = useDNodesStore()
const useGlobalState = useGlobalStateStore()
watch(()=>useGlobalState.mousePos,()=>{
  if (draging.value) {
    let deltaX = useGlobalState.mousePos.x - clickCoord.x
    let deltaY = useGlobalState.mousePos.y - clickCoord.y
    NodeCoord.x = NodeCoordWhenClicked.x + deltaX / scaleRatio
    NodeCoord.y = NodeCoordWhenClicked.y + deltaY / scaleRatio
  }
},{deep: true})
let NodeCoordWhenClicked: Coord = {
  x: 0,
  y: 0
}
let scaleRatio = 1

function handleClick(e) {
  if (draging.value) {
    draging.value = false
  } else {
    draging.value = true
  }
  clickCoord.x = e.clientX
  clickCoord.y = e.clientY
  NodeCoordWhenClicked = {...NodeCoord}
}


function handleConnect(e: PointerEvent) {
  //不是保存结点位置，而是保存结点连接处中心位置
  //仅保存被连接的结点，而非所有结点
  mapIdToCoord(props.id, ConnectedPointCoord)
  if (!useDNode.preNodeID) {
    //检查是第一次按下
    //是否仅移动曲线
    //绑定inputNode的id
    useDNode.preNodeID = props.id
  } else {
    //绑定outputNode的id
    useLines.addLines({
      id: uuid(),
      inputDnode: useDNode.preNodeID,
      outputDnode: props.id
    })
    useDNode.preNodeID = ''
  }
}

</script>