import { useEffect, useState } from "react";
import InputFileProps from "../../types/InputFileProps";

const InputFile = ({data, update, name, label, report, disable=false}: InputFileProps) => {

    const [field, setField] = useState<any>(null);
    useEffect(() => {
        let stateVal = {...data};
        setField(stateVal[name]);
    }, [data])

    function onChange(e: React.FormEvent<HTMLInputElement>){
        const value = e.currentTarget.files;
        if(value != null && value[0]){
            let stateVal = {...data};
            stateVal[name] = value[0];
            update(stateVal);
            setField(value[0]);
        }else{
            let stateVal = {...data};
            stateVal[name] = null;
            update(stateVal);
            setField(null);
        }
       
    }

    return (
        <div className="form-group">
            <label htmlFor={name + "input"}>{label}</label>
            <input type="file" disabled={disable}  onChange={onChange} className="form-control" id={name + "input"} />
            {report != undefined && <small className="form-text text-danger">{report}</small>}
        </div>
    )

}

export default InputFile;