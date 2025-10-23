import { useEffect, useState } from "react";
import Layout from "../../../template/Layout";
import { BeatLoader } from "react-spinners";
import { Link, Navigate, useParams } from "react-router-dom";
import Wrapper from "../../../component/Wrapper";
import RemiseEtat from "../../../component/RemiseEtat";
import LoadImage from "../../../component/LoadImage";
import Remise from "../../../component/Remise";
import myRoute from "../../../hooks/myRoute";
import httpClient from "../../../hooks/httpClient";
import noNetWork, { Toast, ToastNotFound, ToastOperation, problemOccur } from "../../../component/AlertReport";
import { HttpStatusCode } from "axios";
import Cheque from "../../../component/Cheque";
import CheckEtat from "../../../component/CheckEtat";
import Swal from "sweetalert2";


const InfoRemise = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [remise, setRemise] = useState<any>({});
    const [cheques, setCheques] = useState([]);
    const { remiseId } = useParams();
    const [noFound, setNoFound] = useState(false);
    const [checkSelected, setCheckSelected] = useState(0);
    const [onRemoving, setOnRemoving] = useState(false);
    const [warning, setWarning] = useState(null);
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

    useEffect(() => {
        httpClient.get(myRoute.infoRemiseCorrecteur.replace("{remiseId}", remiseId ?? ''))
            .then(res => {
                setIsLoading(false);
                setRemise(res.data.remise);
                setCheques(res.data.cheques);
                if (res.data.user.role.libelle != "Correcteur" || res.data.remise.etat != 3) {
                    setNoFound(true);
                }
            })
            .catch(err => {
                setIsLoading(false);
                if (err.response == undefined) {
                    noNetWork();
                } else {
                    if (err.response.status == HttpStatusCode.NotFound) {
                        ToastNotFound.fire();
                        setNoFound(true);
                    } else {
                        problemOccur();
                    }
                }
            })
    }, []);


    const onRemoveCheck = (checkId: any) => {
        ToastOperation.fire()
            .then(result => {
                if (result.isConfirmed) {
                    setCheckSelected(checkId);
                    setOnRemoving(true);
                    httpClient.post(myRoute.removeCheckCorrect.replace("{remiseId}", remiseId ?? "").replace("{checkId}", checkId))
                        .then(res => {
                            setOnRemoving(false);
                            setCheques(res.data.cheques);
                            setRemise(res.data.remise);
                        })
                        .catch(err => {
                            setOnRemoving(false);
                            if (err.response == undefined) {
                                noNetWork();
                            } else {
                                if (err.response.status == HttpStatusCode.NotFound) {
                                    setNoFound(true);
                                }
                                else if (err.response.status == HttpStatusCode.BadRequest) {
                                    Swal.fire({
                                        title: "Echec de suppression",
                                        icon: 'error',
                                        text: err.response.data
                                    })
                                } else {
                                    problemOccur();
                                }
                            }
                        })
                }
            })
    }

    const onCompleteCorrection = () => {
        setWarning(null);
        setIsLoadingSubmit(true);
        httpClient.post(myRoute.submitRemiseCorrect.replace("{remiseId}", remiseId ?? ''))
        .then(res => {

            setIsLoadingSubmit(false);
            setNoFound(true);
            Toast.fire();
            
            
        })
        .catch(err => {
            setWarning(null);
            setIsLoadingSubmit(false);
            if(err.response == undefined){
                noNetWork();
            }else{
                if(err.response.status == HttpStatusCode.NotFound){
                    console.log(err.response.data);
                    
                    setWarning(err.response.data);
                }else{
                    problemOccur();
                }
            }
        })
    }


    if (noFound) {
        return <Navigate to={"/banking/correcteur/remise/rejete"} />
    }

    return (
        <Layout title="Detail de la remise">
            {isLoading == true &&
                <div className="text-center">
                    <BeatLoader />
                </div>
            }
            {(isLoading == false && remise?.id != null) && <div className="row">
                <div className="col-12">
                    <Wrapper title={remise ? 'Reference de la remise: ' + remise?.reference : "Remise"}>
                        <div className="card">
                            <h5 className="card-header">
                                Detail de la remise<br />
                                <RemiseEtat etat={remise?.etat} />
                            </h5>
                            <div className="card-body">
                                <LoadImage uri={remise?.uri} />
                                <Remise remise={remise} />
                               
                                 {warning != null && 
                                    <div className="alert alert-danger col-12">{warning}</div>
                                }
                                <div className="mt-1">
                                    <Link className="btn btn-primary mr-1" to={"/banking/correcteur/remise/" + remiseId + "/corriger"}>Corriger</Link>
                                    <button disabled={isLoadingSubmit} onClick={() => onCompleteCorrection()} type="button" className="btn btn-danger mr-1">Soumettre la correction</button>
                                </div>
                                
                            </div>
                        </div>
                        {cheques.map((check: any, index: number) => {

                            return (
                                <div key={check.id} className="card mt-4">
                                    <h5 className="card-header">
                                        Cheque #{index + 1}: <br />
                                        <small>Sequence du cheque de la remise: {check.sequenceRemise}</small>
                                    </h5>
                                    <div className="card-body">
                                        <div>
                                            <CheckEtat etat={check.etat} />
                                        </div>
                                        <Cheque check={check} remise={remise} />
                                    </div>
                                    {check.codeRejet != null && <div className="alert alert-danger">
                                        <div><strong>Rejet</strong></div>
                                        {check.codeRejet} - {check.libelleRejet}
                                    </div>}
                                    <div className="mt-2">
                                        {(onRemoving && checkSelected == check.id) && <div>
                                            <BeatLoader />
                                        </div>}
                                        <button disabled={onRemoving && checkSelected == check.id} onClick={() => onRemoveCheck(check.id)} type="button" className="btn btn-danger">Supprimer</button>
                                    </div>
                                </div>
                            )
                        })}
                    </Wrapper>
                </div>
            </div>}
        </Layout>
    )
}
export default InfoRemise;