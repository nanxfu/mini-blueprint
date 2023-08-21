import {inject, onMounted, ref, VNode} from "vue";

import DNode from "../DNode/DNode.vue";
import {v4 as uuid} from "uuid";
import {getCoord} from "../DNode/useNode";
import {useLinesStore} from "../../store/Lines";


export interface LineProps {
    id: string,
    index?: number
    inputDnode?: string,
    outputDnode?: string
    isConnectedLine?: boolean
}

export interface Coord {
    x: number,
    y: number
}


export function useBindingNodeCoord(inputDNodeID: string, outputDNodeID: string) {
    let inputCoord = getCoord(inputDNodeID)
    let outputCoord = getCoord(outputDNodeID)
    return [inputCoord, outputCoord]
}



