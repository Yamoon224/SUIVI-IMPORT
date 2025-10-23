
import { useEffect, useState } from "react";
import Switch from "react-switch";

import SwitchProps from "../../types/SwitchProps";
import httpClient, { encodeData } from "../hooks/httpClient";
import noNetWork, { problemOccur } from "./AlertReport";
const SwitchButton = ({value, url, data}: SwitchProps) => {
    const [checked, setChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setChecked(value);
    }, [value])

    const onHandle = (check: any) => {
        if(url == undefined){
            setChecked(check);
        }else{
            setIsLoading(true);
            const dataSend = encodeData(data == undefined ? {} : data)
            httpClient.post(url, dataSend)
            .then(res => {
                setIsLoading(false);
                setChecked(res.data);
            })
            .catch(err => {
                setIsLoading(false);
                setChecked(!check)
                if(err.response == undefined){
                    noNetWork();
                }else{
                    problemOccur();
                }
            })
        }
        
        
    }
    
    
   
    
    return(
        <div>
            <div>{checked == true ? 'Active': 'Desactive'}</div>
            <div><Switch onChange={onHandle} checked={checked} disabled={isLoading} /></div>
        </div>
    );
}

export default SwitchButton;