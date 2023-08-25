import {defineStore} from "pinia";
import {nodeProps} from "../components/DNode/useNode";

export const useDNodesStore = defineStore('DNode', {
    state: () => ({
        DNodes: [] as nodeProps[],
    }),
    actions: {
        addDNode(uuid, title) {
            this.DNodes.push({
                title,
                id: uuid
            })
        },
        deleteDNode(index){
            this.DNodes.splice(index,1)
        }
    }
})