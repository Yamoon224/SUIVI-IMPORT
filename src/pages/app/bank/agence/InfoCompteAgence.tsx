import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import httpClient, { encodeData, writeErrors } from "../../../hooks/httpClient";
import myRoute from "../../../hooks/myRoute";
import noNetWork, { Toast, problemOccur } from "../../../component/AlertReport";
import { HttpStatusCode } from "axios";
import Layout from "../../../template/Layout";
import Wrapper from "../../../component/Wrapper";
import Input from "../../../component/Input";
import { BeatLoader } from "react-spinners";


const InfoCompteAgence = () => {

    const {agence} = useParams();
    const {compteId} = useParams();
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

    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        httpClient.get(myRoute.infoCompteAgence.replace("{codeAgence}", agence ?? '').replace("{compteId}", compteId ?? ""))
        .then(res => {
            setUserData({
                codeAgence: res.data.codeAgence,
                numeroCmpt: res.data.numeroCmpt,
                intitule: res.data.intitule,
                adresse: res.data.adresse
            });
            setIsLoading(false);
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

    const onSubmit = (e: React.FormEvent) =>{
        e.preventDefault();
        setIsSubmitLoading(true);
        setErrors(writeErrors({...errors}, {}));
        httpClient.post(myRoute.editCompteAgence.replace("{codeAgence}", agence ?? "").replace("{compteId}", compteId ?? ""), encodeData(userData))
        .then(res => {
            setIsSubmitLoading(false);
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

    if(notFound == true){
        return <Navigate to={"/banking/agence/"+ agence +"/comptes"} />
    }
    
    return(
        <Layout title={"information d'un compte de l'agence: " + agence}>
            {isLoading == true && <div className="text-center">
                <BeatLoader />
            </div>}
            {isLoading == false && <div className="row">
                <div className="col-md-10 col-lg-8">
                    <Wrapper title="Edition du compte remettant">
                        <div className="text-right">
                            <Link className="btn btn-link" to={"/banking/agence/"+ agence +"/comptes"}>Comptes</Link>
                        </div>
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
            </div>}
        </Layout>
    )
}

export default InfoCompteAgence;