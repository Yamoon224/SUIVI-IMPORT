import { useEffect, useState } from "react";
import InputProps from "../../types/InputProps";


const Input = ({data, update, name, label, report,required, placeholder='', type='text', disable=false}: InputProps) => {

    const [field, setField] = useState('');
    useEffect(() => {
        let stateVal = {...data};
       
        setField(stateVal[name]);


    }, [data])

    function onChange(e: React.FormEvent<HTMLInputElement>){
        const value: string = e.currentTarget.value;
        let stateVal = {...data};
        stateVal[name] = value;
        update(stateVal);
        setField(value);
        
    }



    return (
        <div className="form-group">
           <label htmlFor={name + "input"}>
            {label}{required && <span style={{color: 'red'}}>*</span>}
            </label>
            <input disabled={disable} type={type} placeholder={placeholder} required={required} value={field} onChange={onChange} className="form-control" id={name + "input"} />
            {report != undefined && <small className="form-text text-danger">{report}</small>}
        </div>
    )
}

export default Input;