<template>
  <!--  //fabric-->
  <!--  canvas-->
  <!--  viewport-->
  <div class="_container h-screen w-screen overflow-hidden" ref="canvas" @click="handleClickBlankArea"
       @mousemove="updateMousePos">
    <svg width="100%" height="100%">
      <g>
        <!--        console-->
        <foreignObject width="192" height="128">
          <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10" @click.stop="addDNode">Badge</span>
        </foreignObject>
      </g>
      <g transform="matrix(1,0,0,1,0,0)">
        <d-node v-for="(DNode, index) in DNodes" :key="DNode.id" :index="index" :id="DNode.id" :title="DNode.title"
                ref="itemRefs"></d-node>
        <d-line v-for="(line,index) in lines" :key="index" :id="line.id" :index="index" :input-dnode="line.inputDnode"
                :output-dnode="line.outputDnode" :is-connected-line="true"></d-line>
<!--        v-show改成v-if会导致dProp失效？-->
        <d-line :is-connected-line="false" id="aaa" key="aaa" v-if="ConnectingNodes"></d-line>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {v4 as uuidv4} from 'uuid';
import DNode from "../DNode/DNode.vue";
import DLine from "../DLine/DLine.vue";
import {useLinesStore} from "../../store/Lines";
import {useDNodesStore} from "../../store/DNodes";
import {useGlobalStateStore} from "../../store/globalState";
import {storeToRefs} from "pinia";
const useLines = useLinesStore()
const useDNodes = useDNodesStore()
const useGlobalState = useGlobalStateStore()
const canvas = ref<HTMLElement>()
let DNodes = useDNodes.DNodes
let lines = useLines.lines
let itemRefs = ref([])
const {preNodeID} = storeToRefs(useDNodes)
const {mousePos, ConnectingNodes} = storeToRefs(useGlobalState)

function addDNode() {
  let title = (Math.random() * 100).toString().slice(0, 4)
  let id = uuidv4()
  useDNodes.addDNode(id, title)
}

function click() {
  useDNodes.deleteDNode(1)
}

function updateMousePos(e: MouseEvent) {
  let x = e.clientX
  let y = e.clientY
  mousePos.value.x = x
  mousePos.value.y = y

}

/*
处理鼠标点击空舞台时的状态
 */
function handleClickBlankArea() {
  ConnectingNodes.value = false
  preNodeID.value = ''
}
</script>

<style scoped>

</style>