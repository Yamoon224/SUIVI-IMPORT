import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import httpClient, { encodeData, writeErrors } from "../hooks/httpClient";
import myRoute from "../hooks/myRoute";
import noNetWork, { Toast, problemOccur } from "./AlertReport";
import { HttpStatusCode } from "axios";
import { BeatLoader } from "react-spinners";

interface ICORRECTION {
    remise: {
        id: number,
        etat: string,
        uri: string,
        sequence: number,
        montant: number,
        nbreCheques: number,
        compteRemettant: {
            intitule: string,
            numeroCmpt: string,
            codeAgence: string
        },
        
    },
    onCheque: () => void,
    updateRemise?: any,
    updateChecks?: any

}
const InputRemise = ({ remise, updateRemise, updateChecks}: ICORRECTION) => {

    const [data, setData] = useState<{ montant: number }>({
        montant: remise.montant
    });

    const [warning, setWarning] = useState(null);
    const [errors, setErrors] = useState({
        montant: null
    })
   
    const [isLoading, setIsLoading] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        /*e.preventDefault();
        setErrors(writeErrors({...errors}, {}));
        setIsLoading(true);
        setWarning(null);
        httpClient.post(myRoute.editRemiseCorrect.replace("{remiseId}", remise?.id.toString()), encodeData(data))
        .then(res => {
            setData({
                montant: res.data.remise.montant
            });
            updateRemise(res.data.remise);
            updateChecks(res.data.cheques);
            setIsLoading(false);
            setWarning(null);
            Toast.fire();
        })
        .catch(err => {
            setIsLoading(false);
            setWarning(null);
            if(err.response == undefined){
                noNetWork();
                setWarning(null);
            }else{
                if(err.response.status == HttpStatusCode.NotFound){
                   setWarning(err.response.data);
                }else if(err.response.status == HttpStatusCode.BadRequest){
                    setErrors(writeErrors({...errors}, err.response.data));
                
                }else{
                    problemOccur();
                }
            }
        })*/
    }

    const onCompleteCorrection = () => {
        setWarning(null);
        setIsLoading(true);
        httpClient.post(myRoute.submitRemiseCorrect.replace("{remiseId}", remise?.id.toString()))
        .then(res => {

            setIsLoading(false);
            setRedirect(true);
            Toast.fire();
            
            
        })
        .catch(err => {
            setWarning(null);
            setIsLoading(false);
            if(err.response == undefined){
                noNetWork();
            }else{
                if(err.response.status == HttpStatusCode.NotFound){
                    setWarning(err.response.data);
                }else{
                    problemOccur();
                }
            }
        })
    }


    if(redirect){
        return <Navigate to={"/banking/correcteur/remise/rejete"} />
    }

    return <form onSubmit={onSubmit}>
        <div className='row mb-4'>
            <div className='col-md-3'>
                <div className='border-bottom'>
                    <div><small>Agence</small></div>
                    <div>{remise.compteRemettant.codeAgence}</div>
                </div>
                <br />
            </div>
            <div className='col-md-4'>
                <div className='border-bottom'>
                    <div><small>Numero de compte</small></div>
                    <div>{remise.compteRemettant.numeroCmpt}</div>
                </div>
                <br />
            </div>
            <div className='col-md-5'>
                <div className='border-bottom'>
                    <div><small>Nom du client</small></div>
                    <div>{remise.compteRemettant.intitule}</div>
                </div>
                <br />
            </div>
            <div className='col-md-3'>
                <div className='border-bottom'>
                    <div><small>Nombre d'instruction</small></div>
                    <div>{remise.nbreCheques}</div>
                </div>
                <br />
            </div>
            <div className='col-md-5'>
                <div className='border-bottom'>
                    <div><small>Montant</small></div>
                    <div>{data.montant}</div>
                    {/** <input type="text" name="montant" value={data.montant} onChange={onchange} style={{ border: '0px solid black' }} /> */}
                </div>
                {errors.montant != null && <div className="text-danger"><small>{errors.montant}</small></div>}
                <br />
            </div>
            <div className='col-md-4'>
                <div className='border-bottom'>
                    <div><small>Sequence</small></div>
                    <div>{remise.sequence}</div>
                </div>
                <br />
            </div>

            {warning != null && 
                <div className="alert alert-danger col-12">{warning}</div>
            }
            <div className='col-md-12'>
                {isLoading == true && <BeatLoader />}
                {/*<button disabled={isLoading} type="submit" className="btn btn-success mr-1">Enregistrer</button>*/}
                <button disabled={isLoading} onClick={() => onCompleteCorrection()} type="button" className="btn btn-danger mr-1">Soumettre la correction</button>
            </div>
        </div>
    </form>
}

export default InputRemise;