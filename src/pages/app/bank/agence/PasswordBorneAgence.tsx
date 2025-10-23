import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import httpClient, { encodeData, writeErrors } from "../../../hooks/httpClient";
import myRoute from "../../../hooks/myRoute";
import noNetWork, { Toast, problemOccur } from "../../../component/AlertReport";
import { HttpStatusCode } from "axios";
import Layout from "../../../template/Layout";
import { BeatLoader } from "react-spinners";
import Wrapper from "../../../component/Wrapper";
import Input from "../../../component/Input";


const PasswordBorneAgence = () => {

    const {agence} = useParams();
    const {borneId} = useParams();
    const [userData, setUserData] = useState({
        libelle: '',
        path: '',
        alias: '',
        password: ''
    })
    const [errors, setErrors] = useState({
        libelle: undefined,
        path: undefined,
        alias: undefined,
        password: undefined
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        httpClient.get(myRoute.infoBorne.replace("{borneId}", borneId ?? ''))
        .then(res => {
            setIsLoading(false);
            setUserData({
                libelle: res.data.libelle,
                path: res.data.path,
                alias: res.data.alias,
                password: ''
            });
        })
        .catch(err => {
            setIsLoading(false);
            if(err.response == undefined){
                noNetWork();
            }else{
                if(err.response.status == HttpStatusCode.NotFound){
                    setNotFound(true);
                }else{
                    problemOccur();
                }
            }
        })
    }, [])

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitLoading(true);
        httpClient.post(myRoute.bornePassword.replace("{borneId}", borneId ?? ''), encodeData(userData))
        .then(res => {
            setIsSubmitLoading(false);
            setUserData({
                libelle: res.data.libelle,
                path: res.data.path,
                alias: res.data.alias,
                password: ''
            })
            Toast.fire();
        })
        .catch(err => {
            setIsSubmitLoading(false);
            if(err.response == undefined){
                noNetWork();
            }else{
                if(err.response.status == HttpStatusCode.BadRequest){
                    setErrors(writeErrors({...errors}, err.response.data));
                }else if(err.response.status == HttpStatusCode.NotFound){
                    setNotFound(true);
                }else{
                    problemOccur();
                }
            }
        })
    }

    if(notFound == true){
        return <Navigate to={"/banking/agence/" + agence + "/bornes"} />
    }

    return(
        <Layout title={"Edition du mot de passe de la borne de l'agence: " + agence}>
           {isLoading == true && <div className="text-center">
                    <BeatLoader />
            </div>}
            {isLoading == false && <div className="row">
                <div className="col-md-10 col-lg-8">
                    <Wrapper title="Edition de mot de passe de la borne">
                        <div className="text-right">
                            <Link className="btn btn-link" to={"/banking/agence/"+ agence +"/bornes"}>Bornes</Link>
                        </div>
                        <form onSubmit={onSubmit}>
                            <Input disable={true} label='Nom de la borne' report={errors.libelle}  name='libelle' data={userData}  update={setUserData}/>
                            <Input disable={true} label='Chemin du repertoire' report={errors.path}  name='path' data={userData}  update={setUserData}/>
                            <Input disable={true}  label='Alias du repertoire' report={errors.alias}  name='alias' data={userData}  update={setUserData}/>
                            <Input type={"password"}  label='Nouveau mot de passe' report={errors.password}  name='password' data={userData}  update={setUserData}/>
                            <div className="mt-2">
                                {isSubmitLoading == true && <div className="text-center">
                                    <BeatLoader />
                                </div>}
                                <button disabled={isSubmitLoading} type="submit" className="btn btn-primary">Enregistrer</button>
                            </div>
                        </form>
                    </Wrapper>
                </div>
            </div>}
        </Layout>
    )
}

export default PasswordBorneAgence;