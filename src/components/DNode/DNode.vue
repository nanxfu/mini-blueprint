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

import {computed, onMounted, reactive, Ref, ref, watch, WatchStopHandle} from "vue";
import {
  findRecordedNodeById,
  mapIdToCoord,
  nodeProps,
  notifyEvent,
  registeEvent, removeEvent
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

    registeEvent("connectingEvent", () => {
      outputDNodes.value.push(lastConnectedDNodesOutput.value)
      connectedLines.value.push(lastConnectedDLinesID.value)
      //订阅下游结点删除事件
      registeEvent(props.id, (param) => handleEvent(param, 'out'))
      //订阅结点线删除事件
      registeEvent(props.id + 'removeLine', (param) => removeDLineRecord(param))
      removeEvent("connectingEvent")
    })
  } else {
    //判断是否即将连接相同的曲线
    if (findRecordedNodeById(inputDNodes, preNodeID.value) != -1 || findRecordedNodeById(outputDNodes, preNodeID.value) != -1) {
      // === 处理连接失败 ===
      useGlobalState.cancelNodesConnecting()
      removeEvent("connectingEvent")
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
    notifyEvent("connectingEvent", '')
    // 订阅上游结点
    registeEvent(props.id + 'in', (param) => handleEvent(param, 'in'))
    // 订阅结点线删除事件
    registeEvent(props.id + 'removeLine', removeDLineRecord)
    inputDNodes.value.push(preNodeID.value)
    connectedLines.value.push(LineId)
    useGlobalState.cancelNodesConnecting()
  }
}

function deleteNode() {
  //相对于下游结点来说自身是上游
  outputDNodes.value.forEach((id) => notifyEvent(id + 'in', props.id))
  //相对于上游结点来说自身是下游
  inputDNodes.value.forEach((id) => notifyEvent(id + 'out', props.id))
  //通知与自身连接的线被删除的消息
  connectedLines.value.forEach((id) => notifyEvent(id, props.id))
  useDNodes.deleteDNode(props.index, connectedLines)
  removeEvent(props.id)
}

/*
断开连接过的线
 */
function removeDLineRecord(lineid: string) {
  let index = connectedLines.value.indexOf(lineid)
  connectedLines.value.splice(index, 1)
}

function handleRemoveEvent(id) {
  console.log(`节点${id}，被删除`)
}

/*
处理来自上下游的结点
 */
function handleEvent(param, messageOrg: 'in' | 'out') {
  let oriRef: Ref<Array<string>>
  if (messageOrg == 'in') {
    oriRef = inputDNodes
  } else {
    oriRef = outputDNodes
  }
  let index = findRecordedNodeById(oriRef, param)
  oriRef.value.splice(index, 1)
}
</script>