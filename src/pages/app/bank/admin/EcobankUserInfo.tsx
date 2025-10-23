import React, { useEffect, useState } from "react";
import Layout from "../../../template/Layout";
import { BeatLoader } from "react-spinners";
import Wrapper from "../../../component/Wrapper";
import { Link, Navigate, useParams } from "react-router-dom";
import Input from "../../../component/Input";
import Select from "../../../component/Select";
import httpClient, { encodeData, writeErrors } from "../../../hooks/httpClient";
import myRoute from "../../../hooks/myRoute";
import noNetWork, { Toast, problemOccur } from "../../../component/AlertReport";
import { HttpStatusCode } from "axios";
import SwitchButton from "../../../component/SwitchButton";


const EcobankUserInfo = () => {
    const [userData, setUserData] = useState({
        nom: '',
        prenom: '',
        email: '',
        role: '',
        username: '',
        status: 0 
    })

    const [roles, setRoles] = useState([]);

    const [errors, setErrors] = useState({
        nom: undefined,
        prenom: undefined,
        email: undefined,
        role: undefined,
        username: undefined
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [userNotFound, setUserNotFound] = useState(false);

    const {userId} = useParams();
    useEffect(() => {
        httpClient.get(myRoute.infoUserEcobank.replace('{userId}', userId == undefined ? "0": userId))
        .then(res => {
            setIsLoading(false);
            const utilisateur: any = res.data.user;
            setUserData({
                nom: utilisateur.nom,
                prenom: utilisateur.prenom,
                email: utilisateur.email,
                role: utilisateur.role.id,
                username: utilisateur.username,
                status: utilisateur.status
            })
            
            setRoles(res.data.roles) 
        })
        .catch(err => {
            setIsLoading(false);
            if(err.response == undefined){
                noNetWork();
            }else{
                if(err.response.status == HttpStatusCode.NotFound){
                    setUserNotFound(true);
                }else{
                    problemOccur();
                }
                
            }
        })
    }, [])

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitLoading(true);
        httpClient.post(myRoute.editionUserEcobank, encodeData(userData))
        .then(res => {
            setIsSubmitLoading(false);
            const utilisateur: any = res.data;
            setUserData({
                nom: utilisateur.nom,
                prenom: utilisateur.prenom,
                email: utilisateur.email,
                role: utilisateur.role.id,
                username: utilisateur.username,
                status: utilisateur.status
            })
            setErrors({
                nom: undefined,
                prenom: undefined,
                email: undefined,
                role: undefined,
                username: undefined
            })
            Toast.fire();
        })
        .catch(err => {
            setIsSubmitLoading(false);
            if(err.response == undefined){
                noNetWork();
            }else{
                if(err.response.status == HttpStatusCode.BadRequest){
                    const errs = writeErrors({...errors}, err.response.data);
                    setErrors(errs);
                }else{
                    problemOccur();
                }
            }
        })
    }

    if(userNotFound == true){
        return <Navigate to={"/suivi-import/utilisateurs"} />
    }

    return(
        <Layout title="Information utilisateur de SO'3G">
            {isLoading == true && <div className="text-center">
                <BeatLoader />
            </div>}
            {isLoading == false && <div className="row">
                <div className="col-md-10 col-lg-8">
                    <Wrapper title="Edition des informations">
                        <div className="text-right">
                            <Link className="btn btn-link" to={"/suivi-import/utilisateurs"}>Les utilisateus</Link>
                        </div>
                        <SwitchButton url={myRoute.changeStatusUser.replace("{userId}", userId ?? "")} value={userData.status == 1} />
                        <form onSubmit={onSubmit}>
                            <Input  label='Nom' report={errors.nom}  name='nom' data={userData}  update={setUserData}/>
                            <Input  label='Prenoms' report={errors.prenom}  name='prenom' data={userData}  update={setUserData}/>
                            <Input disable={true}  label='Nom utilisateur' report={errors.username}  name='username' data={userData}  update={setUserData}/>
                            <Input  label='Email' type="email" report={errors.email}  name='email' data={userData}  update={setUserData}/>
                            <Select data={roles} fieldNames={['libelle']} report={errors.role} label="Role" name="role" state={userData} update={setUserData}   />
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

export default EcobankUserInfo;