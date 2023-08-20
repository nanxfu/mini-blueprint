import {defineStore} from "pinia";
import {Coord} from "../components/DLine/useLine";

export const useGlobalStateStore = defineStore('globalState', {
    state:()=>({
      mousePos: {} as Coord
    }),
    actions: {
        updateMousePos(pos:Coord){
            this.mousePos.x = pos.x
            this.mousePos.y = pos.y
        }
    }
})