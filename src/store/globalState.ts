import {defineStore} from "pinia";
import {Coord} from "../components/DLine/useLine";
import {state} from "vue-tsc/out/shared";

export const useGlobalStateStore = defineStore('globalState', {
    state: () => ({
        mousePos: {} as Coord,
        /*
        是否正在进行连接结点过程中
         */
        ConnectingNodes: false,
        /*
        当前鼠标点击的结点ID
         */
        preNodeID: '',

        /*
        连接结点成功后记录状态
         */
        lastConnectedDNodesInput: '',
        lastConnectedDNodesOutput: '',
        lastConnectedDLinesID: ''

    }),
    actions: {
        updateMousePos(pos: Coord) {
            this.mousePos.x = pos.x
            this.mousePos.y = pos.y
        },
        /*
        取消结点连接
         */
        cancelNodesConnecting(){
            this.ConnectingNodes = false
            this.preNodeID = ''
        },
        setLastConnectedStatus({DNodesInput, DNodesOutput, DLinesID}){
            this.lastConnectedDNodesInput = DNodesInput
            this.lastConnectedDNodesOutput = DNodesOutput
            this.lastConnectedDLinesID = DLinesID
        }
    }
})