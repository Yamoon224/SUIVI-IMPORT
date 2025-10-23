import { useEffect, useState } from "react";

const CheckEtat = ({etat}: any) => {

    const [libelle, setLibelle] = useState('');
    const [classVal, setClassVal] = useState('badge-secondary')

    useEffect(() => {
        if(etat == 1){
            setClassVal("badge-secondary");
            setLibelle("Nouveau cheque");
        }
        if(etat == 4){
            setClassVal('badge-success')
            setLibelle("Cheque Valide");
        }
        if(etat == 5){
            setClassVal('badge-danger')
            setLibelle("Cheque rejete");
        }
        if(etat == 6){
            setClassVal('badge-success')
            setLibelle("Pret pour integration");
        }
        if(etat == 7){
            setClassVal('badge-success')
            setLibelle("Cheque integre");
        }
       
    }, [etat])

    return(
        <>
            <span className={"badge " + classVal}>{libelle}</span>
        </>
    )
}

export default CheckEtat;