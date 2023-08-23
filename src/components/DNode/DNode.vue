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

import {computed, reactive, ref, watch, WatchStopHandle} from "vue";
import {mapIdToCoord, nodeProps} from "./useNode"
import {Coord} from "../DLine/useLine";
import {useLinesStore} from "../../store/Lines";
import {v4 as uuid} from "uuid";
import {useDNodesStore} from "../../store/DNodes";
import {useGlobalStateStore} from "../../store/globalState";
import {storeToRefs} from "pinia";

let scaleRatio = 1
let stopWatchMousePos: WatchStopHandle
const props = defineProps<nodeProps>()
const useLines = useLinesStore()
const useDNode = useDNodesStore()
const useGlobalState = useGlobalStateStore()
const nodeRef = ref()
const draging = ref(false)
const transformMatrix = computed(() => `matrix(1,0,0,1,${NodeCoord.x},${NodeCoord.y})`)
const NodeWidth = 176
const NodeHeight = 10

/*
记录结点坐标
 */
const NodeCoord: Coord = reactive({
  x: 0,
  y: 0
})

/*
记录连接点的左边
 */
const ConnectedPointCoord: Coord = reactive({
  x: 0,
  y: 0
})
/*
标识是否在连接结点的过程
 */
const {mousePos, ConnectingNodes} = storeToRefs(useGlobalState)

/*
记录鼠标单击的左边
 */
const ClickCoord: Coord = {
  x: 0,
  y: 0
}
/*
记录单击时结点的位置
 */
let NodeCoordWhenClicked: Coord = {
  x: 0,
  y: 0
}


//观测结点位置使得连接结点跟着变化
watch(NodeCoord, () => {
  ConnectedPointCoord.x = NodeCoord.x + NodeWidth
  ConnectedPointCoord.y = NodeCoord.y + NodeHeight
})

function handleClick(e) {
  if (draging.value) {
    draging.value = false
    stopWatchMousePos()
  } else {
    draging.value = true
    ClickCoord.x = e.clientX
    ClickCoord.y = e.clientY
    NodeCoordWhenClicked = {...NodeCoord}
    //观测鼠标位置
    stopWatchMousePos = watch(mousePos.value, () => {
      let deltaX = mousePos.value.x - ClickCoord.x
      let deltaY = mousePos.value.y - ClickCoord.y
      NodeCoord.x = NodeCoordWhenClicked.x + deltaX / scaleRatio
      NodeCoord.y = NodeCoordWhenClicked.y + deltaY / scaleRatio
    }, {immediate: true})
  }

}


function handleConnect(e: PointerEvent) {
  //不是保存结点位置，而是保存结点连接处中心位置
  //仅保存被连接的结点，而非所有结点
  mapIdToCoord(props.id, ConnectedPointCoord)
  if (!useDNode.preNodeID) {
    //检查是第一次按下
    //是否仅创建随鼠标移动的曲线
    //绑定inputNode的id
    useDNode.preNodeID = props.id
    ConnectingNodes.value = true
  } else {
    //绑定outputNode的id
    useLines.addLines({
      id: uuid(),
      inputDnode: useDNode.preNodeID,
      outputDnode: props.id
    })
    useDNode.preNodeID = ''
    ConnectingNodes.value = false
  }
}

//todo
//- 删除结点时连接线正确显示
//- 点击单个结点时任然正确显示连接线
//- 防止重复的两个结点链接 O(n) -> O(1)
</script>