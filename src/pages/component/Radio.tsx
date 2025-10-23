import { useEffect, useState } from "react";
import RadioProps from "../../types/RadioProps";

const Radio = ({data, update, dataset, name, type='radio', disable=false}: RadioProps) => {

    // dataset sample
    /**
     * [
     *  {value: "val", label: "label", id: "00"},
     * {value: "val", label: "label", id: "00"},
     * ]
     * 
     */
    const [field, setField] = useState('');
    useEffect(() => {
        let stateVal = {...data};
        setField(stateVal[name]);
    }, [data])

    function onChange(e: React.FormEvent<HTMLInputElement>){
        console.log(e.currentTarget.value + " changed");
        
        const value: string = e.currentTarget.value;
        let stateVal = {...data};
        stateVal[name] = value;
        update(stateVal);
        setField(value);
        
    }


    

    return(
        <>
            {dataset.map((row: any) => {
                return(
                    <div key={row.id} className="form-check">
                        <input checked={row.value == field} className="form-check-input" disabled={disable} type={type} value={row.value} onChange={onChange} name={name} id={row.id} />
                        <label className="form-check-label" htmlFor={row.id}>
                            {row.label}
                        </label>
                    </div>
                )
            })}
        </>
    )
}
export default Radio;