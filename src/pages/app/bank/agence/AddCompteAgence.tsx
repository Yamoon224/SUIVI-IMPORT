import React, { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import httpClient, { encodeData, httpHighTraffic, writeErrors } from "../../../hooks/httpClient";
import myRoute from "../../../hooks/myRoute";
import noNetWork, { Toast, problemOccur } from "../../../component/AlertReport";
import { HttpStatusCode } from "axios";
import Layout from "../../../template/Layout";
import Wrapper from "../../../component/Wrapper";
import Input from "../../../component/Input";
import { BeatLoader } from "react-spinners";
import InputFile from "../../../component/InputFile";


const AddCompteAgence = () => {

    const {agence} = useParams();
    const [userData, setUserData] = useState({
        codeAgence: '',
        numeroCmpt: '',
        intitule: '',
        adresse: ''
    })
    const [errors, setErrors] = useState({
        codeAgence: undefined,
        numeroCmpt: undefined,
        intitule: undefined,
        adresse: undefined
    });

    const [fileData, setFileData] = useState({
        file: null
    });

    const [errorFile, setErrorFile] = useState({
        file: undefined
    });



    const [isSubmitFile, setIsSubmitFile] = useState(false);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const onSubmit = (e: React.FormEvent) =>{
        e.preventDefault();
        setIsSubmitLoading(true);
        setErrors(writeErrors({...errors}, {}));
        httpClient.post(myRoute.addCompteAgence.replace("{codeAgence}", agence ?? ""), encodeData(userData))
        .then(res => {
            setIsSubmitLoading(false);
            setUserData({
                codeAgence: '',
                numeroCmpt: '',
                intitule: '',
                adresse: ''
            });
            Toast.fire();
        })
        .catch(err => {
            setIsSubmitLoading(false);
            if(err.response == undefined){
                noNetWork();
            }else{
                if(err.response.status == HttpStatusCode.BadRequest){
                    setErrors(writeErrors({...errors}, err.response.data));
                }
                else if(err.response.status == HttpStatusCode.NotFound){
                    setNotFound(true);
                }else{
                    problemOccur();
                }
            }
        })
    }

    const onSubmitFile = (e: React.FormEvent) =>{
        e.preventDefault();
        setIsSubmitFile(true)
        setErrorFile(writeErrors({...errorFile}, {}));
        httpClient.post(myRoute.updateCompte, encodeData(fileData))
        .then(res => {
            setIsSubmitFile(false);
            Toast.fire();
        })
        .catch(err => {
            setIsSubmitFile(false);
            if(err.response == undefined){
                noNetWork();
            }else{
                if(err.response.status == HttpStatusCode.BadRequest){
                    setErrorFile(writeErrors({...errorFile}, err.response.data));
                }else{
                    problemOccur();
                }
            }
        })
    }

    if(notFound == true){
        return <Navigate to={"/banking/agence"} />
    }
    
    return(
        <Layout title={"Ajouter un compte de l'agence: " + agence}>
           
            <div className="row">
                <div className="col-md-10 col-lg-8">
                    <Wrapper title="Ajout de compte remettant">
                        <div className="text-right">
                            <Link className="btn btn-link" to={"/banking/agence/"+ agence +"/comptes"}>Comptes</Link>
                        </div>

                        <form onSubmit={onSubmitFile}>
                            <div>
                                <small>Veuillez soummettre un fichier csv, Ci dessous un exemple du contenu du fichier<br/>
                                Code agence;N.Compte;Intitule<br/>
                                01001;1200000000001;Traore<br/>
                                30008;1800000000038;Sidiki
                                </small>
                            </div>
                            <InputFile label="Fichier" name="file" data={fileData} update={setFileData}  report={errorFile.file} />
                            {isSubmitFile == true && <div className="text-center">
                                    <BeatLoader />
                                </div>}
                            <button type="submit" className="btn btn-primary">Upload</button>
                        </form>

                        <hr/>
                        <form onSubmit={onSubmit}>
                            <Input  label='Code agence' report={errors.codeAgence}  name='codeAgence' data={userData}  update={setUserData}/>
                            <Input  label='Numero de compte' report={errors.numeroCmpt}  name='numeroCmpt' data={userData}  update={setUserData}/>
                            <Input  label='Intituel du compte' report={errors.intitule}  name='intitule' data={userData}  update={setUserData}/>
                            <Input  label='Adresse du compte' report={errors.adresse}  name='adresse' data={userData}  update={setUserData}/>
                            <div className="mt-2">
                                {isSubmitLoading == true && <div className="text-center">
                                    <BeatLoader />
                                </div>}
                                <button disabled={isSubmitLoading} type="submit" className="btn btn-primary">Enregistrer</button>
                            </div>
                        </form>
                    </Wrapper>
                </div>
            </div>
        </Layout>
    )
}
export default AddCompteAgence;