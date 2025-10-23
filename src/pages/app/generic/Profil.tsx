import { HttpStatusCode } from "axios";
import React, { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import Swal from "sweetalert2";
import noNetWork, { problemOccur } from "../../component/AlertReport";
import Input from "../../component/Input";
import Wrapper from "../../component/Wrapper";
import httpClient, { encodeData, writeErrors } from "../../hooks/httpClient";
import myRoute from "../../hooks/myRoute";
import Layout from "../../template/Layout";


const Profil = () => {

    const [userData, setUserData] = useState({
        nom: '',
        prenom: '',
        username: '',
        adresse: '',
        email: '',
        role: '',
    });

    const [input, setInput] = useState({
        password: ''
    });

    const [errors, setErrors] = useState({
        password: undefined
    })

    const menu = {
        profil: 1,
        password: 2
    };
    const [choice, setChoice] = useState(menu.profil);

    const[changeLoad, setChangeLoad] = useState(false);

    

    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        httpClient.get(myRoute.myProfile)
        .then(res => {   
            setUserData({
                nom: res.data.nom,
                prenom: res.data.prenom,
                username: res.data.username,
                adresse: res.data.adresse ?? '',
                email: res.data.email ?? '',
                role: res.data.role.libelle
            });
            setIsLoading(false);
            
        })
        .catch(err => {
            setIsLoading(false);
            if(err.response == undefined){
                noNetWork();
            }else{
                if(err.response.status == HttpStatusCode.Unauthorized){
                    localStorage.clear();
                }else{
                    problemOccur();
                }
            }
            
        });
    }, [])

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setChangeLoad(true);
        setErrors(writeErrors({...errors}, {}));
        httpClient.post(myRoute.changePassword, encodeData(input))
        .then(res => {
            setChangeLoad(false);
            Swal.fire({
                title: 'Edition de mot de passe',
                text: 'Le mot de passe a ete modifie',
                icon: 'success'
            });
            setInput({
                password: ''
            })
            
        })
        .catch(err => {
            setChangeLoad(false);
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
        <Layout title="Mon profil">
            {isLoading == true && <div className="text-center">
                    <BeatLoader />
                </div>}
            {isLoading == false && <div className="row">
                <div className="col-md-10 col-lg-8">
                    <Wrapper title="Mon profil">
                        <div>
                            <div className="text-right">
                                {(choice == menu.profil && userData.role == "Admin") && <button onClick={() => {setChoice(menu.password); setInput({password: ''}); setErrors({password: undefined})}} type="button" className="btn btn-link">Modifier mot de passe</button>}
                                {choice == menu.password && <button onClick={() => {setChoice(menu.profil)}} type="button" className="btn btn-link">Profil</button>}
                            </div>
                        </div>
                        {choice == menu.password && <form onSubmit={onSubmit}>
                            <Input type="password" label='Mot de passe' report={errors.password} name='password' data={input}  update={setInput}/>
                            {changeLoad == true && <div className="text-center">
                                <BeatLoader />
                            </div>}
                            <div className="text-center">
                                <button disabled={changeLoad} type="submit" className="btn btn-primary">Enregistrer</button>
                            </div>
                        </form>}
                        {choice == menu.profil && <div>
                            <Input disable={true} label='Nom utilisateur'  name='username' data={userData}  update={setUserData}/>
                            <Input disable={true} label='Nom'  name='nom' data={userData}  update={setUserData}/>
                            <Input disable={true} label='Prenoms'  name='prenom' data={userData}  update={setUserData}/>
                            <Input disable={true} label='Email'  name='email' data={userData}  update={setUserData}/>
                            <Input disable={true} label='Adresse'  name='adresse' data={userData}  update={setUserData}/>
                            <Input disable={true} label='Role'  name='role' data={userData}  update={setUserData}/>
                        </div>}
                        <hr/>
                    </Wrapper>
                </div>
            </div>}
        </Layout>
    );
}

export default Profil;