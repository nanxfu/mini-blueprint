import {defineStore} from "pinia";
import {nodeProps, notifyEventResponseHandler} from "../components/DNode/useNode";

export const useDNodesStore = defineStore('DNode', {
    state: () => ({
        DNodes: [] as nodeProps[],
        eventNodes:new Map()
    }),
    actions: {
        addDNode(uuid, title) {
            this.DNodes.push({
                title,
                id: uuid
            })
        },
        /*
        删除一个节点的流程如下：
        1.删除该节点在全局状态管理的数据
        2.通知持有该节点id的节点剔除该节点id
        3.删除与之相连的线
        4.通知持有被删除曲线id的结点剔除该曲线id
         */
        deleteDNode(index, connectedLine){
            this.DNodes.splice(index,1)
            connectedLine.value.forEach((id)=>notifyEventResponseHandler(id, ''))
        },
        _notifyNodeEvent(id:string){

        }
    }
})