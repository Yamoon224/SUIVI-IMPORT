import { FormEvent, useEffect, useState } from "react";
import Wrapper from "../../../component/Wrapper";
import Layout from "../../../template/Layout";
import { BeatLoader } from "react-spinners";
import httpClient, { encodeData } from "../../../hooks/httpClient";
import myRoute from "../../../hooks/myRoute";
import { Link, Navigate, useParams } from "react-router-dom";
import noNetWork, { Toast, ToastNotFound, ToastOperation, problemOccur, ForcingValidation } from "../../../component/AlertReport";
import { HttpStatusCode } from "axios";
import LoadImage from "../../../component/LoadImage";
import Remise from "../../../component/Remise";
import Cheque from "../../../component/Cheque";
import Select from "../../../component/Select";
import RemiseEtat from "../../../component/RemiseEtat";
import CheckEtat from "../../../component/CheckEtat";



const InfoRemiseValidator = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [remise, setRemise] = useState<any>({});
    const [cheques, setCheques] = useState([]);
    const [user, setUser] = useState({});
    const { remiseId } = useParams();
    const [noFound, setNoFound] = useState(false);
    const [isImgLoaded, setIsImgLoaded] = useState(false);
    const [imgBinary, setImgBinary] = useState<any>();
    const [motifs, setMotifs] = useState([]);
    const [errorValidated, setErrorValidated] = useState<any>('');
    const [idValidate, setIdValidate] = useState(0);
    const [idRejet, setIdRejet] = useState(0);
    const [idAnnuler, setIdAnnuler] = useState(0);
    const [isOperating, setIsOperating] = useState(false);
    const [input, setInput] = useState({
        motif: ''
    });
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    const [errorSubmit, setErrorSubmit] = useState('');
    const [control, setControl] = useState<any>({
        NEXT_REPORT: 0,
        NEXT_DATA: null,
        PREVIOUS_REPORT: 0,
        PREVIOUS_DATA: null
    });



    useEffect(() => {
        httpClient.get(myRoute.infoRemiseValidator.replace("{remiseId}", remiseId ?? ''))
            .then(res => {
                setIsLoading(false);
                setRemise(res.data.remise);
                setCheques(res.data.cheques);
                setUser(res.data.user);
                if (res.data.user.role.libelle != "Validateur" && res.data.user.role.libelle != 'Superviseur') {
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
    }, [])

    useEffect(() => {
        httpClient.get(myRoute.prevNextRemiseValidator.replace("{id}", remiseId ?? ''))
            .then(res => {
                setControl(res.data);
            })
            .catch(err => {

            })
    }, [])



    useEffect(() => {
        httpClient.get(myRoute.listAllMotif)
            .then(res => {
                setMotifs(res.data);
            })
            .catch(err => {
                if (err.response == undefined) {
                    noNetWork();
                } else {
                    problemOccur();
                }
            })
    }, [])





    const validationCheck = (cheque: any) => {

        ToastOperation.fire()
            .then(confirmation => {
                if (confirmation.isConfirmed) {
                    setIdValidate(cheque.id);
                    setIdRejet(0);
                    setIsOperating(true);
                    setErrorValidated('');
                    httpClient.post(myRoute.validateCheque.replace("{remiseId}", remiseId ?? '').replace("{chequeId}", cheque.id))
                        .then(res => {
                            Toast.fire();
                            setIsOperating(false);
                            setErrorValidated('');
                            setRemise(res.data.remise);
                            setCheques(res.data.cheques);
                        })
                        .catch(err => {
                            setIsOperating(false);
                            if (err.response == undefined) {
                                noNetWork();
                            } else {
                                if (err.response.status == HttpStatusCode.BadRequest || err.response.status == HttpStatusCode.NotFound) {
                                    setErrorValidated(err.response.data);
                                } else {
                                    problemOccur();
                                }
                            }

                        })
                }
            })


    }






    const onRejetCheck = (check: any) => {
        setIdValidate(0);
        setIdRejet(check.id);
        setErrorValidated('');
    }

    const onSubmitRejection = (e: FormEvent) => {
        e.preventDefault();
        setIsOperating(true);
        httpClient.post(myRoute.rejetCheque.replace("{remiseId}", remiseId ?? '').replace("{chequeId}", idRejet.toString()), encodeData(input))
            .then(res => {
                Toast.fire();
                setIsOperating(false);
                setErrorValidated('');
                setRemise(res.data.remise);
                setCheques(res.data.cheques);
            })
            .catch(err => {
                setIsOperating(false);
                if (err.response.status == undefined) {
                    noNetWork();
                } else if (err.response.status == HttpStatusCode.NotFound || err.response.status == HttpStatusCode.BadRequest) {
                    setErrorValidated(err.response.data);
                } else {
                    problemOccur();
                }
            })

    }


    const cancelValidation = (check: any) => {
        ToastOperation.fire()
            .then(result => {
                if (result.isConfirmed) {

                    setIdAnnuler(check.id);
                    setIsOperating(true);
                    setIdValidate(0);
                    setIdRejet(0);
                    setErrorValidated('');

                    httpClient.post(myRoute.cancelValidationCheque.replace("{remiseId}", remiseId ?? '').replace("{chequeId}", check.id))
                        .then(res => {
                            Toast.fire();
                            setIsOperating(false);
                            setIdAnnuler(0);
                            setRemise(res.data.remise);
                            setCheques(res.data.cheques);
                        })
                        .catch(err => {
                            setIsOperating(false);
                            setIdAnnuler(0);
                            if (err.response == undefined) {
                                noNetWork();
                            } else {
                                if (err.response.status == HttpStatusCode.NotFound) {
                                    setErrorValidated(err.response.data);
                                } else {
                                    problemOccur();
                                }
                            }
                        })
                }
            })
    }

    const onCompleteValidation = () => {
        setErrorSubmit('');
        ToastOperation.fire()
            .then(result => {
                if (result.isConfirmed) {
                    setIsLoadingSubmit(true);
                    httpClient.post(myRoute.submitValidation.replace("{remiseId}", remiseId ?? ""))
                        .then(res => {
                            setIsLoadingSubmit(false);
                            setRemise(res.data);
                            Toast.fire();
                        })
                        .catch(err => {
                            setIsLoadingSubmit(false);
                            if (err.response == undefined) {
                                noNetWork();
                            } else {
                                if (err.response.status == HttpStatusCode.NotFound || err.response.status == HttpStatusCode.BadRequest) {
                                    setErrorSubmit(err.response.data);
                                } else {
                                    problemOccur();
                                }
                            }
                        })
                }
            });
    }

    const onIntegration = () => {
        setErrorSubmit('');
        ToastOperation.fire()
            .then(result => {
                if (result.isConfirmed) {
                    setIsLoadingSubmit(true);
                    httpClient.post(myRoute.integrateRemiseValidation.replace("{remiseId}", remiseId ?? ""))
                        .then(res => {
                            setIsLoadingSubmit(false);
                            setRemise(res.data);
                            Toast.fire();
                        })
                        .catch(err => {
                            setIsLoadingSubmit(false);
                            if (err.response == undefined) {
                                noNetWork();
                            } else {
                                if (err.response.status == HttpStatusCode.NotFound || err.response.status == HttpStatusCode.BadRequest) {
                                    setErrorSubmit(err.response.data);
                                } else {
                                    problemOccur();
                                }
                            }
                        })
                }
            });
    }





    if (noFound) {
        return <Navigate to={"/banking/validation/newRemise"} />
    }

    return (
        <Layout title="Detail de la remise">
            {isLoading == true &&
                <div className="text-center">
                    <BeatLoader />
                </div>
            }
            {(isLoading == false && remise?.id != null) && <div className="row">
                {(control.NEXT_REPORT == 1 || control.PREVIOUS_REPORT == 1) && <div className="col-12 mt-1">
                    <div>
                        <ul className="pagination text-right">
                            {control.PREVIOUS_REPORT == 1 && <li className="page-item">
                                <a className="page-link" href={"/banking/validation/remise/" + control.PREVIOUS_DATA?.id + "/info"}>Remise precedente</a>
                            </li>}
                            {control.NEXT_REPORT == 1 && <li className="page-item">
                                <a className="page-link" href={"/banking/validation/remise/" + control.NEXT_DATA?.id + "/info"}>Remise suivante</a>
                            </li>}
                        </ul>
                    </div>
                </div>}
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
                                {errorSubmit.length != 0 && <div className="alert alert-danger">
                                    {errorSubmit}
                                </div>}

                                {remise?.etat == 2 && <div className="mt-2">
                                    <button disabled={isLoadingSubmit} type="button" onClick={() => onCompleteValidation()} className="btn btn-primary">Soumettre la validation</button>
                                </div>}


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
                                        {(idValidate == check.id && errorValidated.length != 0) &&
                                            <div className="alert alert-danger">
                                                {errorValidated}
                                            </div>
                                        }
                                        {(idRejet == check.id && errorValidated.length != 0) &&
                                            <div className="alert alert-danger">
                                                {errorValidated}
                                            </div>
                                        }
                                        {check.etat == 5 &&
                                            <div className="alert alert-danger">
                                                <div><strong>Rejet</strong></div>
                                                {check.codeRejet} - {check.libelleRejet}
                                            </div>
                                        }
                                        <div className="row">
                                            {check.etat == 1 && <div className="col-12">
                                                <button type="button" disabled={isOperating && idValidate == check.id} onClick={() => validationCheck(check)} className="btn btn-success mr-1">Valider</button>
                                                <button type="button" disabled={isOperating && idRejet == check.id} data-toggle="modal" data-target="#exampleModalCenter" onClick={() => onRejetCheck(check)} className="btn btn-danger">Rejeter</button>
                                            </div>}
                                            {((check.etat == 4 || check.etat == 5) && (remise?.etat == 2 || remise?.etat == 1)) && <div className="col-12">
                                                <button type="button" onClick={() => cancelValidation(check)} disabled={isOperating && idAnnuler == check.id} className="btn btn-warning">Annuler</button>
                                            </div>}
                                        </div>

                                    </div>
                                </div>
                            )
                        })}
                    </Wrapper>
                </div>
            </div>}

            <div className="modal fade" id="exampleModalCenter" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Motif de rejet</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={onSubmitRejection}>
                                <Select name="motif" data={motifs} state={input} update={setInput} fieldNames={["code", "libelle"]} label="Motif de rejet" />
                                <div className="mt-2">
                                    <button type="submit" className="btn btn-primary">Enregistrer</button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
};
export default InfoRemiseValidator;