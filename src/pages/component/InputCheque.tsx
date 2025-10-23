import React, { useEffect, useState } from 'react';
import { BeatLoader } from "react-spinners";
import LoadImage from './LoadImage';
import httpClient, { encodeData, writeErrors } from '../hooks/httpClient';
import myRoute from '../hooks/myRoute';
import noNetWork, { Toast, problemOccur } from './AlertReport';
import { HttpStatusCode } from 'axios';

const InputCheque = ({ remise, setCheck, check, isImgRLoading, isImgVLoading, imgR, imgV, getImg, updateChecks, updateRemise }: any) => {

    const [data, setData] = useState({
        numeroCheque: '',
        codeBanque: '',
        codeAgence: '',
        rib: '',
        referenceClient: '',
        montant: 0
    });



    const [errors, setErrors] = useState({
        numeroCheque: undefined,
        codeBanque: undefined,
        codeAgence: undefined,
        rib: undefined,
        referenceClient: undefined,
        montant: undefined
    })

    const [warning, setWarning] = useState(null);
    const [checkId, setCheckId] = useState(0);

    const [libelleBank, setLibelleBank] = useState('');

    useEffect(() => {
        setData({
            numeroCheque: check.numeroCheque,
            codeBanque: check.codeBanque,
            codeAgence: check.codeAgence,
            rib: check.rib,
            referenceClient: check.referenceClient,
            montant: check.montant
        });
    }, [check])
    
    useEffect(() => {
    
        const codeBk = data.codeBanque;
        if(codeBk != null && codeBk != ''){
            
            httpClient.get(myRoute.infoBanque.replace("{codeBank}", codeBk))
            .then(res => {
                setLibelleBank(res.data.libelle);
                //setData({...data, ["codeBanque"]: res.data.code})
            })
            .catch(err => {
                setLibelleBank('UNKNOWN');
            })
        }
       
    }, [data])

    const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const onSaveEdition = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors(writeErrors({...errors}, {}));
        setWarning(null);
        setCheckId(0);
        httpClient.post(myRoute.editCheckCorrect.replace("{remiseId}", remise?.id).replace("{checkId}", check?.id), encodeData(data))
        .then(res => {
            updateChecks(res.data.cheques);
            updateRemise(res.data.remise);
            const myCheck = res.data.cheques.find((myCheck: any) => myCheck.id == check.id);
            console.log(myCheck);
            
            setCheck(myCheck);
            Toast.fire();
        })
        .catch(err =>{
            if(err.response == undefined){
                noNetWork();
            }else{
                if(err.response.status == HttpStatusCode.BadRequest){
                    setErrors(writeErrors({...errors}, err.response.data));
                    setCheckId(check?.id);
                }
                else if(err.response.status == HttpStatusCode.NotFound){
                    setCheckId(check?.id);
                    setWarning(err.response.data);
                }else{
                    problemOccur();
                }
            }
            
        })
        
    }

    useEffect(() => {
        getImg(check?.uri)
    }, [check?.uri]);
    return <>
        <div>
            {/* <LoadImage uri={check.uri} /> */}

            <div className="row">
                <div className="col-md-6 text-center">
                    {isImgRLoading == true &&
                        <BeatLoader />
                    }
                    {isImgRLoading == false && <img src={imgR} className="img-fluid" />}
                </div>
                <div className="col-md-6 text-center">
                    {isImgVLoading == true &&
                        <BeatLoader />
                    }
                    {isImgVLoading == false && <img src={imgV} className="img-fluid" />}
                </div>
            </div>
            <form onSubmit={onSaveEdition} className="row">
                <div className='col-md-3'>
                    <div className='border-bottom'>
                        <div><small>Numero du cheque</small></div>
                        <input type="text" onChange={onchange} name="numeroCheque" value={data.numeroCheque} style={{ border: '0px solid black' }} />
                        
                    </div>
                    {(errors.numeroCheque && checkId == check?.id) && <div className='text-danger'><small>{errors.numeroCheque}</small></div>}
                    <br />
                </div>
                <div className='col-md-3'>
                    <div className='border-bottom'>
                        <div><small>Code banque</small></div>
                        {/* <div>{check.codeBanque}</div> */}
                        <input type="text" name="codeBanque" onChange={onchange} value={data.codeBanque} style={{ border: '0px solid black' }} />
                    </div>
                    {(errors.codeBanque && checkId == check?.id) && <div className='text-danger'><small>{errors.codeBanque}</small></div>}
                    <br />
                </div>
                <div className='col-md-6'>
                    <div className='border-bottom'>
                        <div><small>Libelle Banque</small></div>
                        {<div>{libelleBank}</div> }
                       
                    </div>
                    <br />
                </div>
                <div className='col-md-3'>
                    <div className='border-bottom'>
                        <div><small>Code agence</small></div>
                        {/* <div>{check.codeAgence}</div> */}
                        <input type="text" name="codeAgence" onChange={onchange} value={data.codeAgence} style={{ border: '0px solid black' }} />
                        {(errors.codeAgence  && checkId == check?.id) && <div className='text-danger'><small>{errors.codeAgence}</small></div>}
                    </div>
                    <br />
                </div>
                <div className='col-md-3'>
                    <div className='border-bottom'>
                        <div><small>Numero de compte</small></div>
                        {/* <div>{check.referenceClient}</div> */}
                        <input type="text" name="referenceClient" onChange={onchange} value={data.referenceClient} style={{ border: '0px solid black' }} />
                    </div>
                    {(errors.referenceClient && checkId == check?.id) && <div className='text-danger'><small>{errors.referenceClient}</small></div>}
                    <br />
                </div>
                <div className='col-md-2'>
                    <div className='border-bottom'>
                        <div><small>Rib</small></div>
                        <input type="text" name="rib" onChange={onchange} value={data.rib} style={{ border: '0px solid black' }} />
                    </div>
                    {(errors.rib && checkId == check?.id) && <div className='text-danger'><small>{errors.rib}</small></div>}
                    <br />
                </div>
                <div className='col-md-4'>
                    <div className='border-bottom'>
                        <div><small>Montant</small></div>
                        {/* <div>{check.montant}</div> */}
                        <input type="text" onChange={onchange} name="montant" value={data.montant} style={{ border: '0px solid black' }} />
                    </div>
                    {(errors.montant && checkId == check?.id) && <div className='text-danger'><small>{errors.montant}</small></div>}
                    <br />
                </div>
                
                {(warning != null && checkId == check?.id) && <div className="col-12 alert alert-danger">{warning}</div>}

                <div className='col-md-12 text-right'>

                    <button type="submit" className="btn btn-success">Enregistrer</button>
                </div>
            </form>

        </div>
    </>
}

export default InputCheque;