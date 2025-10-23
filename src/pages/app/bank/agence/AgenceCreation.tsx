import { Link } from "react-router-dom";
import Wrapper from "../../../component/Wrapper";
import Layout from "../../../template/Layout";
import React, { useState } from "react";
import Input from "../../../component/Input";
import { BeatLoader } from "react-spinners";
import httpClient, { encodeData, writeErrors } from "../../../hooks/httpClient";
import myRoute from "../../../hooks/myRoute";
import noNetWork, { Toast, problemOccur } from "../../../component/AlertReport";
import { HttpStatusCode } from "axios";


const AgenceCreation = () => {

    const [userData, setUserData] = useState({
        codeAgence: '',
        libelle: ''
    });

    const [errors, setErrors] = useState({
        codeAgence: undefined,
        libelle: undefined
    });

    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    const onSubmit = (e: React.FormEvent) =>{
        e.preventDefault();
        setErrors(writeErrors({...errors}, {}));
        setIsSubmitLoading(true);
        httpClient.post(myRoute.addAgence, encodeData(userData))
        .then(res => {
            setIsSubmitLoading(false);
            Toast.fire();
            setUserData({
                codeAgence: '',
                libelle: ''
            })
        })
        .catch(err => {
            setIsSubmitLoading(false);
            if(err.response == undefined){
                noNetWork();
            }else{
                if(err.response.status == HttpStatusCode.BadRequest){
                    setErrors(writeErrors({...errors}, err.response.data));
                }else{
                    problemOccur();
                }
            }
        })

    }
    return(
        <Layout title="Enregister une agence">
            <div className="row">
                <div className="col-md-10 col-lg-8">
                    <Wrapper title="Nouvelle agence">
                        <div className="text-right">
                            <Link className="btn btn-link" to={"/banking/agence"}>Les agences</Link>
                        </div>
                        <form onSubmit={onSubmit}>
                            <Input  label='Code agence' report={errors.codeAgence}  name='codeAgence' data={userData}  update={setUserData}/>
                            <Input  label="Nom de l'agence" report={errors.libelle}  name='libelle' data={userData}  update={setUserData}/>
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
    );
}

export default AgenceCreation;