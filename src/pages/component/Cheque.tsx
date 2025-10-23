import { useEffect, useState } from "react";
import CheckProps from "../../types/CheckProps";
import httpClient from "../hooks/httpClient";
import noNetWork, { Toast, ToastOperation, problemOccur } from "./AlertReport";
import LoadImage from "./LoadImage"
import myRoute from "../hooks/myRoute";
import { HttpStatusCode } from "axios";
import { BeatLoader } from "react-spinners";

const Cheque = ({check, remise}: CheckProps) => {

    const [bank, setBank] = useState({
        libelle: '',
        code: ''
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        httpClient.get(myRoute.infoBanque.replace("{codeBank}", check.codeBanque))
        .then(res => {  
            setIsLoading(false);
            setBank({
                libelle: res.data.libelle,
                code: res.data.code
            });
        })
        .catch(err => {
            setIsLoading(false);
            if(err.response == undefined){
                noNetWork();
            }else if(err.response.status == HttpStatusCode.NotFound){
                setBank({
                    libelle: 'UNKNOWN',
                    code: check.codeBanque
                })
            }else{
                problemOccur();
            }
            
        })
    }, [])

    return(

            <div>
                <LoadImage uri={check.uri} />
                {isLoading == true && <div className="row">
                    <div className="col-12 text-center">
                        <BeatLoader />
                        <div>Chargement des informations</div>
                    </div>
                </div>}
                {isLoading == false && <div className="row">
                    <div className='col-md-3'>
                        <div className='border-bottom'>
                            <div><small>Numero du cheque</small></div>
                            <div>{check.numeroCheque}</div>
                        </div>
                        <br />
                    </div>
                    <div className='col-md-3'>
                        <div className='border-bottom'>
                            <div><small>Code banque</small></div>
                            <div>{bank.code}</div>
                        </div>
                        <br />
                    </div>
                    <div className='col-md-3'>
                        <div className='border-bottom'>
                            <div><small>Libelle banque</small></div>
                            <div>{bank.libelle}</div>
                        </div>
                        <br />
                    </div>
                    <div className='col-md-3'>
                        <div className='border-bottom'>
                            <div><small>Code agence</small></div>
                            <div>{check.codeAgence}</div>
                        </div>
                        <br />
                    </div>
                    <div className='col-md-3'>
                        <div className='border-bottom'>
                            <div><small>Numero de compte</small></div>
                            <div>{check.referenceClient}</div>
                        </div>
                        <br />
                    </div>
                    <div className='col-md-2'>
                        <div className='border-bottom'>
                            <div><small>Rib</small></div>
                            <div>{check.rib}</div>
                        </div>
                        <br />
                    </div>
                    <div className='col-md-4'>
                        <div className='border-bottom'>
                            <div><small>Montant</small></div>
                            <div>{check.montant}</div>
                        </div>
                        <br />
                    </div>
                    <div className='col-md-3'>
                        <div className='border-bottom'>
                            <div><small>Sequence remise</small></div>
                            <div>{remise.sequence}</div>
                        </div>
                        <br />
                    </div>
                </div>}
                
            </div>
    )
}

export default Cheque;