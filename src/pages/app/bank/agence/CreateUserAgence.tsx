import { useEffect, useState } from "react";
import httpClient, { encodeData, writeErrors } from "../../../hooks/httpClient";
import myRoute from "../../../hooks/myRoute";
import noNetWork, { problemOccur } from "../../../component/AlertReport";
import Swal from "sweetalert2";
import { HttpStatusCode } from "axios";
import Layout from "../../../template/Layout";
import { BeatLoader } from "react-spinners";
import Wrapper from "../../../component/Wrapper";
import { Link, useParams } from "react-router-dom";
import Input from "../../../component/Input";
import Select from "../../../component/Select";


const CreateUserAgence = () => {

    const {agence} = useParams();

    const [userData, setUserData] = useState({
        nom: '',
        prenom: '',
        email: '',
        role: '',
        username: '' 
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
    const [passwordGenerated, setPasswordGenerated] = useState('');

    useEffect(() => {
        httpClient.get(myRoute.roleUsersAgence)
        .then(res => {
            setIsLoading(false);
            setRoles(res.data);
        })
        .catch(err => {
            setIsLoading(false);
            if(err.response == undefined){
                noNetWork();
            }else{
                problemOccur();
            }
            
        })
    }, [])

    const onSubmit = (e: React.FormEvent) =>{
        e.preventDefault();
        setIsSubmitLoading(true);
        setErrors(writeErrors({...errors}, {}));
        httpClient.post(myRoute.createUserAgence.replace("{code}", agence ?? ""), encodeData(userData))
        .then(res => {
           
            setUserData({
                nom: '',
                prenom: '',
                email: '',
                role: '',
                username: '' 
            })
            setIsSubmitLoading(false);
            Swal.fire({
                title: 'Creation de compte',
                text: 'Le compte a ete cree avec le mot de passe suivant: '+ res.data.passwordGenerated,
                icon: 'success'
            });
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

    return(
        <Layout title={"Enregistrer un utilisateur de l'agence: " + agence}>
            {isLoading == true && <div className="text-center">
                <BeatLoader />
            </div>}
            {isLoading == false && <div className="row">
                <div className="col-md-10 col-lg-8">
                    <Wrapper title="Nouveau utilisateur">
                        <div className="text-right">
                            <Link className="btn btn-link" to={"/banking/agence/"+ agence +"/info"}>utilisateurs</Link>
                        </div>
                        <form onSubmit={onSubmit}>
                            <Input  label='Nom' report={errors.nom}  name='nom' data={userData}  update={setUserData}/>
                            <Input  label='Prenoms' report={errors.prenom}  name='prenom' data={userData}  update={setUserData}/>
                            <Input  label='Nom utilisateur' report={errors.username}  name='username' data={userData}  update={setUserData}/>
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

export default CreateUserAgence;