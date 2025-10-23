import { ComponentState } from "react"

export default interface RadioProps{
    name: string,
    type?: string,
    update: ComponentState,
    data: ComponentState,
    disable?: boolean,
    dataset: Array<any>
}