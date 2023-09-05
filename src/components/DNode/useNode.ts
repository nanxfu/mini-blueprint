import {Coord} from "../DLine/useLine";
import {Ref} from "vue";


let map = new Map<string, Coord>()

export interface nodeProps {
    id: string
    title: string,
    index?: number
}

export function mapIdToCoord(id: string, coord: Coord) {
    if (map.get(id)) return;
    map.set(id, coord)
}

export function getCoord(id: string) {
    return map.get(id)
}

export function deleteCoord() {
    map.delete(id)
}

export function calcCenterCoord(el: HTMLElement) {
    let rect = el.getBoundingClientRect()
    let x = rect.left + (rect.right - rect.left) / 2
    let y = rect.top + (rect.bottom - rect.top) / 2
    return {
        x,
        y
    }
}

let responseHandlers = new Map()
/*
记录某个结点的事件响应器
 */
export function registeEvent(index: string, handler:(id: string)=>void){
    if (responseHandlers.get(index)){
        return ;
    }else {
        responseHandlers.set(index, handler)
    }
}
/*
通知某个结点响应事件
 */
export function notifyEvent(index: string, param:string){
    responseHandlers.get(index)(param)
}
/*
移除结点事件响应器
 */
export function removeEvent(id: string){
    responseHandlers.delete(id)
}
export function findRecordedNodeById(recorder:Ref<Array<string>>,id: string){
    return recorder.value.indexOf(id)
}