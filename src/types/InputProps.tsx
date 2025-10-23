import { ComponentState } from "react"


export default interface InputProps{
    name: string,
    label: string
    placeholder?: string,
    type?: string,
    report?: string,
    required?: boolean;
    update: ComponentState,
    data: ComponentState,
    disable?: boolean,
   
}