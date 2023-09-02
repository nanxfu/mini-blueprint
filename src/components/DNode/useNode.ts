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


// let subscribers = new Map()
/*
订阅事件。难点：标识来源，如何通知其它关键组件自己被删除的消息
订阅者订阅某个结点，当结点commit事件后就通知该结点下的所有回调函数，
难点：结点A订阅了结点B的事件，但是结点A已经被删除了，事件池中任然有节点A的订阅回调函数
 */
// export function subscribeEvent(id: string, cb: (id) => void) {
//     let subscribersList = subscribers.get(id)
//     if (!subscribersList) {
//         subscribers.set(id, [cb])
//     } else {
//         subscribersList.push(cb)
//     }
// }

/*
某结点触发事件
@param id 触发事件的结点
 */
// export function commitNodeEvent(id: string) {
//     let cbList = subscribers.get(id)
//     cbList.forEach(cb => cb(id))
// }
let responseHandlers = new Map()
/*
记录某个结点的事件响应器
 */
export function registerEventResponseHandler(id: string, handler:(id: string)=>void){
    if (responseHandlers.get(id)){
        return ;
    }else {
        responseHandlers.set(id, handler)
    }
}
/*
通知某个结点响应事件
 */
export function notifyEventResponseHandler(notifingId: string,fromId:string){
    responseHandlers.get(notifingId)(fromId)
}
/*
移除结点事件响应器
 */
export function removeEventResponser(id: string){
    responseHandlers.delete(id)
}
export function findRecordedNodeById(recorder:Ref<Array<string>>,id: string){
    return recorder.value.indexOf(id)
}