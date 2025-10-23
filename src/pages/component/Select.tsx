import React, { useEffect, useState } from "react";
import SelectProps from "../../types/SelectProps";

const Select = ({name, label, data, fieldNames, state, update, report, disable=false, id=undefined}: SelectProps) => {

    const [input, setInput] = useState('');
   
    useEffect(() => {
        let stateVal = {...state};
        setInput(stateVal[name]);
    }, [state])

    const onChange = (e: any) => {
        const val = e.currentTarget.value;
        const oldData = {...state};
        oldData[name] = val;
        setInput(val);
        update(oldData);
    }
    

    return(
        <div className="form-group">
            <label htmlFor={"sel" + name}>{label}</label>
            <select value={input} onChange={onChange} disabled={disable} className="form-control" id={"sel" + name}>
                <option hidden  disabled key={0} value={''}>Veuillez choisir</option>
                {data.map(val => {
                    let libelle: string = "";
                    let idValue = id == undefined ? val.id : val[id]

                    //libelle +=  fieldNames.map(field => val[field]) + " ";
                    fieldNames.forEach(lib => {
                        libelle += val[lib] + " ";
                    })
                    return (
                        <option key={idValue} value={idValue}>{libelle.trim()}</option>
                    )
                })}
            </select>
            {report != undefined && <small className="form-text text-danger">{report}</small>}
        </div>
    );
}

export default Select;