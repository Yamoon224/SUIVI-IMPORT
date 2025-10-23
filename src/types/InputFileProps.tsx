import { ComponentState } from "react";


export default interface InputFileProps{
    name: string,
    label: string
    report?: string,
    update: ComponentState,
    data: ComponentState,
    disable?: boolean,
}