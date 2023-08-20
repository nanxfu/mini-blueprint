<template>
  <!--  //fabric-->
  <!--  canvas-->
  <!--  viewport-->
  <div class="_container h-screen w-screen overflow-hidden" ref="canvas" @mousemove="updateMousePos">
    <svg width="100%" height="100%">
      <rect x="30" y="30" height="120" width="210" @click.stop="addDNode">增加DNode</rect>
      <rect x="100" y="100" height="120" width="210" @click.stop="click">增加DNode</rect>
      <g transform="matrix(1,0,0,1,0,0)">
        <d-node v-for="(DNode, index) in DNodes" :key="DNode.id" :index="index" :id="DNode.id" :title="DNode.title" ref="itemRefs"></d-node>

        <d-line v-for="(line,index) in lines" :key="index" :id="line.id" :index="index" :input-dnode="line.inputDnode" :output-dnode="line.outputDnode"></d-line>
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
// import {useMouseMove} from "./useScene";

const useLines = useLinesStore()
const useDNodes = useDNodesStore()
const useGlobalState = useGlobalStateStore()
const canvas = ref<HTMLElement>()
let DNodes = useDNodes.DNodes
let lines = useLines.lines
let itemRefs = ref([])

function addDNode() {
  let title = (Math.random() * 100).toString().slice(0, 4)
  let id = uuidv4()
  useDNodes.addDNode(id, title)
}

function click() {
  useDNodes.deleteDNode(1)
}
function updateMousePos(e: MouseEvent){
  let x = e.clientX
  let y = e.clientY
  useGlobalState.updateMousePos({
    x,
    y
  })
}
</script>

<style scoped>
</style>