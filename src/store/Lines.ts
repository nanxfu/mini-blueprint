import {defineStore} from "pinia";
import {LineProps} from "../components/DLine/useLine";

export const useLinesStore = defineStore('lines', {
    state: () => ({
        lines: [] as LineProps[]
    }),
    actions: {
        addLines(vector:LineProps){
            this.lines.push(vector)
        }
    }
})