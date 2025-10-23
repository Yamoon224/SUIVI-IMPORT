import { useEffect, useState } from "react";

const AuditEtat = ({status}: any) => {

    const [libelle, setLibelle] = useState('');
    const [classVal, setClassVal] = useState('badge-secondary')
    useEffect(() => {
        if(status == 1){
            setLibelle('Information');
            setClassVal('badge-primary')
        }
        if(status == 2){
            setLibelle('Important')
            setClassVal('badge-warning')
        }
        if(status == 3){
            setLibelle('Suppression');
            setClassVal('badge-danger');
        }
        if(status == 4){
            setLibelle('Connexion');
            setClassVal('badge-success');
        }
    }, [])

    return(
        <>
            <span className={"badge " + classVal}>{libelle}</span>
        </>
    );
}
export default AuditEtat;