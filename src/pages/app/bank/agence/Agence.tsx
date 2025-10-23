import React, { useEffect, useState } from "react";
import httpClient, { encodeData, writeErrors } from "../../../hooks/httpClient";
import myRoute from "../../../hooks/myRoute";
import noNetWork, { Toast, problemOccur } from "../../../component/AlertReport";
import Layout from "../../../template/Layout";
import { BeatLoader } from "react-spinners";
import Wrapper from "../../../component/Wrapper";
import moment from "moment";
import Pagination from "../../../component/Pagination";
import { Link } from "react-router-dom";
import Input from "../../../component/Input";
import { HttpStatusCode } from "axios";


const Agence = () => {
    
    const [agences, setAgences] = useState<any>({});
    const [page, setPage] = useState('0');
    const [isLoading, setIsLoading] = useState(true);
    const menu = {
        list: 0,
        edit: 1
    }

    const [userData, setUserData] = useState({
        codeAgence: '',
        libelle: ''
    });

    const [errors, setErrors] = useState({
        codeAgence: undefined,
        libelle: undefined
    });
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    const [choice, setChoice] = useState(menu.list);
    const [info, setInfo] = useState<any>({});
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        httpClient.get(myRoute.listAgence.replace("{page}", page))
        .then(res => {
            setIsLoading(false);
            setAgences(res.data)
        })
        .catch(err => {
            setIsLoading(false);
            if(err.response == undefined){
                noNetWork();
            }else{
                problemOccur();
            }
        })
    }, [page, attempt])

    function onEditSubmit(e: React.FormEvent){
        e.preventDefault();
        setIsSubmitLoading(true);
        httpClient.post(myRoute.editAgence, encodeData(userData))
        .then(res => {
            setIsSubmitLoading(false);
            Toast.fire();
        })
        .catch(err => {
            setIsSubmitLoading(false);
            if(err.response == undefined){
                noNetWork();
            }else{
                if(err.response.status == HttpStatusCode.NotFound){
                    Toast.fire({
                        icon: 'error',
                        text: 'L\'agence n\'existe pas',
                        title: 'Non trouve'
                    });
                    chooseList();
                }
                else if(err.response.status == HttpStatusCode.BadRequest){
                    setErrors(writeErrors({...errors}, err.response.data))
                }else{
                    problemOccur();
                }
            }
        })
    }

    function chooseEdit(agence: any){
        setChoice(menu.edit);
        setInfo(agence);
        setUserData({
            codeAgence: agence.code,
            libelle: agence.libelle
        });
        setErrors(writeErrors({...errors}, {}));
    }

    function chooseList(){
        setChoice(menu.list);
        setAttempt(attempt + 1);
        setIsLoading(true);
    }


    return(
        <Layout title="Tous les agences">
            {isLoading == true &&
                <div className="text-center">
                    <BeatLoader/>
                </div>
            }
            {isLoading == false &&
                <div className="row">
                    {choice == menu.list &&<div className="col-12">
                         <Wrapper title="Les agences">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Code</th>
                                            <th>Nom</th>
                                            <th>Date creat.</th>
                                            <th className="text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {agences?.content?.map((agence : any) => {
                                            
                                            return(
                                                <tr key={agence.id}>
                                                    <td>{agence.code}</td>
                                                    <td>{agence.libelle}</td>
                                                    <td>{moment(agence.dateCreation).format("DD/MM/YYYY")}</td>
                                                    <td className="text-right">
                                                        <Link className="text-success" to={"/banking/agence/"+ agence.code +"/info"}><i className="fa fa-eye mr-1"></i></Link>
                                                        <Link onClick={() => chooseEdit(agence)} className="text-success" to={"#"}><i className="fa fa-eyedropper"></i></Link>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination update={setPage} paginator={agences} />
                        </Wrapper>
                    </div>}
                    {choice == menu.edit && 
                        <div className="col-md-10 col-lg-8">
                            <Wrapper title="Edition d'agence">
                                <div className="text-right">
                                    <button onClick={() => chooseList()} type="button" className="btn btn-link">Agences</button>
                                </div>
                                <form onSubmit={onEditSubmit}>
                                    <Input disable  label='Code agence' report={errors.codeAgence}  name='codeAgence' data={userData}  update={setUserData}/>
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
                    }
                    
                </div>
            }
        </Layout>
    );
}

export default Agence;