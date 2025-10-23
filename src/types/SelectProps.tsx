import { ComponentState } from "react";

export default interface SelectProps{
    data: Array<any>,
    name: string,
    label: string,
    report?: string,
    update: ComponentState,
    state: ComponentState,
    disable?: boolean,
    fieldNames: Array<string>,
    id?: string
};