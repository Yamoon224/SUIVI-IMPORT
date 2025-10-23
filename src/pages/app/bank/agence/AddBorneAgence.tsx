import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom"
import Layout from "../../../template/Layout";
import Wrapper from "../../../component/Wrapper";
import Input from "../../../component/Input";
import { BeatLoader } from "react-spinners";
import httpClient, { encodeData, writeErrors } from "../../../hooks/httpClient";
import myRoute from "../../../hooks/myRoute";
import noNetWork, { Toast, problemOccur } from "../../../component/AlertReport";
import { HttpStatusCode } from "axios";


const AddBorneAgence = () => {
    const {agence} = useParams();
    const [userData, setUserData] = useState({
        libelle: '',
        path: '',
        alias: '',
        password: '',
    })
    const [errors, setErrors] = useState({
        libelle: undefined,
        path: undefined,
        alias: undefined,
        password: undefined
    });

    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const onSubmit = (e: React.FormEvent) =>{
        e.preventDefault();
        setIsSubmitLoading(true);
        setErrors(writeErrors({...errors}, {}));
        httpClient.post(myRoute.addBorneAgence.replace("{codeAgence}", agence ?? ""), encodeData(userData))
        .then(res => {
            setIsSubmitLoading(false);
            setUserData({
                libelle: '',
                path: '',
                alias: '',
                password: ''
            })
            
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

    if(notFound == true){
        return <Navigate to={"/banking/agence"} />
    }
    
    return(
        <Layout title={"Ajouter une borne dans l'agence: " + agence}>
           
            <div className="row">
                <div className="col-md-10 col-lg-8">
                    <Wrapper title="Ajout de borne">
                        <div className="text-right">
                            <Link className="btn btn-link" to={"/banking/agence/"+ agence +"/bornes"}>Bornes</Link>
                        </div>
                        <form onSubmit={onSubmit}>
                            <Input  label='Nom de la borne' report={errors.libelle}  name='libelle' data={userData}  update={setUserData}/>
                            <Input  label='Chemin du repertoire' report={errors.path}  name='path' data={userData}  update={setUserData}/>
                            <Input  label='Alias du repertoire' report={errors.alias}  name='alias' data={userData}  update={setUserData}/>
                            <Input  label='Mot de passe' type="password" report={errors.password}  name='password' data={userData}  update={setUserData}/>
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

export default AddBorneAgence;