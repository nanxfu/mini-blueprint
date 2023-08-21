import {Coord} from "../DLine/useLine";


let map = new Map<string, Coord>()
export interface nodeProps {
    id: string
    title: string,
    index?: number
    output?: string
    belongsToDLine?: string
}

export function mapIdToCoord(id:string, coord:Coord){
    map.set(id, coord)
}

export function getCoord(id: string){
    return map.get(id)
}
export function deleteCoord(){
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
