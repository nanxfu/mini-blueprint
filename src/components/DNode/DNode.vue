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
            <div class="w-4 h-4 mr-2 hover:scale-110 shadow-md rounded-full bg-amber-400"
                 @click.stop="deleteNode"></div>
          </header>
        </div>
      </div>
    </foreignObject>
  </g>
</template>

<script setup lang="ts">

import {computed, onMounted, reactive, ref, watch, WatchStopHandle} from "vue";
import {
  findRecordedNodeById,
  mapIdToCoord,
  nodeProps,
  notifyEventResponseHandler,
  registerEventResponseHandler, removeEventResponser
} from "./useNode"
import {Coord} from "../DLine/useLine";
import {useLinesStore} from "../../store/DLines";
import {useGlobalStateStore} from "../../store/globalState";
import {useDNodesStore} from "../../store/DNodes";
import {storeToRefs} from "pinia";
import {v4 as uuid} from "uuid";

let scaleRatio = 1
/*
停止观察鼠标位置，用于停止拖拽事件
 */
let stopWatchMousePos: WatchStopHandle
/*
停止观察连线是否连接成功，用于连接失败事件
 */
const props = defineProps<nodeProps>()
const useLines = useLinesStore()
const useGlobalState = useGlobalStateStore()
const {
  preNodeID,
  lastConnectedDNodesOutput,
  lastConnectedDLinesID
} = storeToRefs(useGlobalState)
const useDNodes = useDNodesStore()
const nodeRef = ref()
/*
记录上游结点
 */
const inputDNodes = ref([])
/*
记录下游结点
 */

const outputDNodes = ref([])
/*
记录与之相连的线
 */
const connectedLines = ref([])
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

//观察自身结点是否被删除

function handleClick(e) {
  if (draging.value) {
    draging.value = false
    stopWatchMousePos()
    stopWatchMousePos = null
  } else {
    stopWatchMousePos && stopWatchMousePos()
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

/*
处理连接结点逻辑
 */
function handleConnect() {
  mapIdToCoord(props.id, ConnectedPointCoord)
  if (!preNodeID.value) {
    //检查是第一次按下
    //是否仅创建随鼠标移动的曲线
    //绑定inputNode的id
    preNodeID.value = props.id
    ConnectingNodes.value = true
    /*
    观测是否成功连接直线，成功连接就记录下游结点。不同仅观察单个ref，因为output/input再二次连接时可能相同
      watchConnected = watch(lastConnectedDNodesOutput, () => {
      outputDNodes.value.push(lastConnectedDNodesOutput.value)
      connectedLines.value.push(lastConnectedDLinesID.value)
      //订阅下游结点事件
      registerEventResponseHandler(props.id,EventResponseFromOutputNode)
      watchConnected()
    })
     */
    registerEventResponseHandler("connectingEvent", () => {
      outputDNodes.value.push(lastConnectedDNodesOutput.value)
      connectedLines.value.push(lastConnectedDLinesID.value)
      //订阅下游结点事件
      registerEventResponseHandler(props.id, EventResponseFromOutputNode)
      removeEventResponser("connectingEvent")
    })
  } else {
    //判断是否即将连接相同的曲线
    if (findRecordedNodeById(inputDNodes, preNodeID.value) != -1 || findRecordedNodeById(outputDNodes, preNodeID.value) != -1) {
      // === 处理连接失败 ===
      useGlobalState.cancelNodesConnecting()
      removeEventResponser("connectingEvent")
      return;
    }
    //   ===  处理成功连接事件  ===
    const LineId = uuid()
    useLines.addLines({
      id: LineId,
      inputDnode: preNodeID.value,
      outputDnode: props.id
    })
    useGlobalState.setLastConnectedStatus({
      DNodesInput: preNodeID.value,
      DNodesOutput: props.id,
      DLinesID: LineId
    })
    notifyEventResponseHandler("connectingEvent", props.id)
    // 订阅上游结点
    registerEventResponseHandler(props.id + 'in', EventResponseFromInputNode)
    inputDNodes.value.push(preNodeID.value)
    connectedLines.value.push(LineId)
    useGlobalState.cancelNodesConnecting()
  }
}

function deleteNode() {
  useDNodes.deleteDNode(props.index, connectedLines)
  removeEventResponser(props.id)
  //相对于下游结点来说自身是上游
  outputDNodes.value.forEach((id) => notifyEventResponseHandler(id + 'in', props.id))
  //相对于上游结点来说自身是下游
  inputDNodes.value.forEach((id) => notifyEventResponseHandler(id + 'out', props.id))
}

function handleRemoveEvent(id) {
  console.log(`节点${id}，被删除`)
}

/*
处理来自上游结点的消息，目前仅'删除'消息
 */
function EventResponseFromInputNode(fromId) {
  let index = findRecordedNodeById(inputDNodes, fromId)
  inputDNodes.value.splice(index, 1)
}

/*
处理来自下游结点的消息
 */
function EventResponseFromOutputNode(fromId) {
  let index = findRecordedNodeById(outputDNodes, fromId)
  inputDNodes.value.splice(index, 1)
}
</script>