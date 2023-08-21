import {defineStore} from "pinia";
import {Coord} from "../components/DLine/useLine";
import {state} from "vue-tsc/out/shared";

export const useGlobalStateStore = defineStore('globalState', {
    state: () => ({
        mousePos: {} as Coord,
        ConnectingNodes: false,
    }),
    actions: {
        updateMousePos(pos: Coord) {
            this.mousePos.x = pos.x
            this.mousePos.y = pos.y
        }
    }
})