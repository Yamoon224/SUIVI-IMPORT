import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import myRoute from "../../../hooks/myRoute";
import httpClient from "../../../hooks/httpClient";
import noNetWork, { Toast, ToastRemove, problemOccur } from "../../../component/AlertReport";
import { HttpStatusCode } from "axios";
import Layout from "../../../template/Layout";
import { BeatLoader } from "react-spinners";
import AgenceMenu from "../../../component/AgenceMenu";
import Wrapper from "../../../component/Wrapper";
import moment from "moment";
import Pagination from "../../../component/Pagination";



const CompteAgence = () => {
    const {agence} = useParams();
    const [comptes, setComptes] = useState<any>({});
    const [page, setPage] = useState('0');
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        httpClient.get(myRoute.listCompteAgence.replace("{codeAgence}", agence ?? '').replace("{page}", page))
        .then(res => {
            setComptes(res.data);
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
    }, [page, refresh])


    const onRemove = (compteId: any) => {

        ToastRemove.fire()
        .then(result => {
            if(result.isConfirmed){
                httpClient.post(myRoute.removeCompte.replace("{compteId}", compteId))
                .then(res => {
                    
                    const refres = refresh + 1;
                    setIsLoading(true);
                    setRefresh(refres);
                    Toast.fire();
                })
                .catch(err => {
                    if(err.response == undefined){
                        noNetWork();
                    }else{
                        problemOccur();
                    }
                })
            }
        })
        .catch(err => {

        })
    }


    if(notFound == true){
        return <Navigate to={"/banking/agence"} />
    }

    return(
        <Layout title={"Gestion des comptes de l'agence: " + agence}>
            {isLoading == true && <div className="text-center">
                <BeatLoader />
            </div>}
            {isLoading == false && <div className="row">
                <AgenceMenu codeAgence={agence} />
                <div className="col-12">
                    <Wrapper title="Les comptes remettants">
                        <div className="text-right mb-2">
                            <Link className="btn btn-primary" to={"/banking/agence/"+ agence +"/addCompte"}>Ajouter un compte</Link>
                        </div>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Code Agence</th>
                                        <th>Numero du compte</th>
                                        <th>Intitule</th>
                                        <th>Adresse</th>
                                        <th>Date creation</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comptes?.content?.map((compte: any) => {

                                        return(
                                            <tr key={compte.id}>
                                                <td>{compte.codeAgence}</td>
                                                <td>{compte.numeroCmpt}</td>
                                                <td>{compte.intitule}</td>
                                                <td>{compte.adresse}</td>
                                                <td>{moment(compte.dateCreation).format('DD/MM/YYYY HH:mm')}</td>
                                                <td className="text-right">
                                                    <Link className="text-success mr-1" to={"/banking/agence/"+ agence +"/compte/"+ compte.id}>
                                                        <i className="fa fa-eyedropper"></i> 
                                                    </Link>
                                                    <Link onClick={() => onRemove(compte.id)} className="text-danger" to={"#"}>
                                                        <i className="fa fa-trash"></i> 
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <Pagination update={setPage} paginator={comptes} />
                    </Wrapper>
                </div>
            </div>}
        </Layout>
    );

};

export default CompteAgence;