import { Link, Navigate, useParams } from "react-router-dom";
import Layout from "../../../template/Layout";
import { BeatLoader } from "react-spinners";
import Wrapper from "../../../component/Wrapper";
import Input from "../../../component/Input";
import Select from "../../../component/Select";
import React, { useEffect, useState } from "react";
import httpClient, { encodeData, writeErrors } from "../../../hooks/httpClient";
import myRoute from "../../../hooks/myRoute";
import noNetWork, { Toast, problemOccur } from "../../../component/AlertReport";
import { HttpStatusCode } from "axios";
import SwitchButton from "../../../component/SwitchButton";


const InfoUserAgence = () => {
    const {agence} = useParams();
    const {userId} = useParams();
    const [userData, setUserData] = useState({
        nom: '',
        prenom: '',
        email: '',
        role: '',
        username: '',
        status: 0
    })

    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const [errors, setErrors] = useState({
        nom: undefined,
        prenom: undefined,
        email: undefined,
        role: undefined,
        username: undefined
    });

    useEffect(() => {
        httpClient.get(myRoute.infoUserAgence.replace('{code}', agence ?? '').replace('{userId}', userId ?? ''))
        .then(res => {
            setIsLoading(false);
            const user = res.data.userData.user;
            setRoles(res.data.roles)
            
            setUserData({
                email: user.email,
                nom: user.nom,
                prenom: user.prenom,
                role: user.role.id,
                username: user.username,
                status: user.status
            })
            
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

    }, []);

    const onSubmit = (e: React.FormEvent) =>{
        e.preventDefault();
        setIsSubmitLoading(true);
        setErrors(writeErrors({...errors}, {}));
        httpClient.post(myRoute.editUserAgence.replace("{code}", agence??''), encodeData(userData))
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
        return <Navigate to={"/banking/agence/" + agence +"/info"} />
    }

    return(
        <Layout title={"Edition d'utilisateur de l'agence: " + agence}>
            {isLoading == true && <div className="text-center">
                <BeatLoader />
            </div>}
            {isLoading == false && <div className="row">
                <div className="col-md-10 col-lg-8">
                    <Wrapper title="Information utilisateur">
                        <div className="text-right">
                            <Link className="btn btn-link" to={"/banking/agence/"+ agence +"/info"}>utilisateurs</Link>
                        </div>
                        <SwitchButton url={myRoute.changeStatusUser.replace("{userId}", userId ?? "")} value={userData.status == 1} />
                        <form onSubmit={onSubmit}>
                            <Input  label='Nom' report={errors.nom}  name='nom' data={userData}  update={setUserData}/>
                            <Input  label='Prenoms' report={errors.prenom}  name='prenom' data={userData}  update={setUserData}/>
                            <Input disable label='Nom utilisateur' report={errors.username}  name='username' data={userData}  update={setUserData}/>
                            <Input  label='Email' type="email" report={errors.email}  name='email' data={userData}  update={setUserData}/>
                            <Select disable  data={roles} fieldNames={['libelle']} report={errors.role} label="Role" name="role" state={userData} update={setUserData}   />
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
    );
}

export default InfoUserAgence;