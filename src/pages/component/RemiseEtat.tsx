import { useEffect, useState } from "react"


const RemiseEtat = ({etat}: any) => {

    const [libelle, setLibelle] = useState('');
    const [classVal, setClassVal] = useState('badge-secondary')

    useEffect(() => {
        if(etat == 1){
            setClassVal("badge-secondary");
            setLibelle("Nouvelle remise");
        }
        if(etat == 2){
            setClassVal('badge-warning')
            setLibelle("Validation encours");
        }
        if(etat == 3){
            setClassVal('badge-danger')
            setLibelle("Envoie pour correction");
        }
        if(etat == 4){
            setClassVal('badge-success')
            setLibelle("Remise validee");
        }
        if(etat == 5){
            setClassVal('badge-success')
            setLibelle("Valide par le validateur");
        }
        if(etat == 6){
            setLibelle("Validation Integrateur...");
        }
        if(etat == 7){
            setClassVal('badge-success')
            setLibelle("Pret pour integration");
        }
        if(etat == 10){
            setClassVal('badge-success')
            setLibelle("Remise integree");
        }
    }, [etat])

    return(
        <>
            <span className={"badge " + classVal}>{libelle}</span>
        </>
    )
}

export default RemiseEtat;