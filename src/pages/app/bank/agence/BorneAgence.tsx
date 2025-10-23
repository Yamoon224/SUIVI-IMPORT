import { Link, Navigate, useParams } from "react-router-dom"
import Layout from "../../../template/Layout";
import AgenceMenu from "../../../component/AgenceMenu";
import Wrapper from "../../../component/Wrapper";
import { useEffect, useState } from "react";
import httpClient from "../../../hooks/httpClient";
import myRoute from "../../../hooks/myRoute";
import noNetWork, { Toast, ToastRemove, problemOccur } from "../../../component/AlertReport";
import { HttpStatusCode } from "axios";
import { BeatLoader } from "react-spinners";
import moment from "moment";
import Pagination from "../../../component/Pagination";


const BorneAgence = () => {
    const {agence} = useParams();
    const [bornes, setBornes] = useState<any>({});
    const [page, setPage] = useState('0');
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        httpClient.get(myRoute.listBorneAgence.replace("{codeAgence}", agence ?? '').replace("{page}", page))
        .then(res => {
            setBornes(res.data);
            setIsLoading(false);
            console.log(res.data);
            
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


    const onRemove = (borneId: any) => {

        ToastRemove.fire()
        .then(result => {
            if(result.isConfirmed){
                httpClient.post(myRoute.removeBorne.replace("{borneId}", borneId))
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
        <Layout title={"Gestion des bornes de l'agence: " + agence}>
            {isLoading == true && <div className="text-center">
                <BeatLoader />
            </div>}
            {isLoading == false && <div className="row">
                <AgenceMenu codeAgence={agence} />
                <div className="col-12">
                    <Wrapper title="Les bornes">
                        <div className="text-right mb-2">
                            <Link className="btn btn-primary" to={"/banking/agence/"+ agence +"/addBorne"}>Ajouter une borne</Link>
                        </div>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Repertoire</th>
                                        <th>Alias repertoire</th>
                                        <th>Date creation</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bornes?.content?.map((borne: any) => {

                                        return(
                                            <tr>
                                                <td>{borne.libelle}</td>
                                                <td>{borne.path}</td>
                                                <td>{borne.alias}</td>
                                                <td>{moment(borne.dateCreation).format('DD/MM/YYYY HH:mm')}</td>
                                                <td className="text-right">
                                                    <Link className="text-primary mr-1" to={"/banking/agence/"+ agence +"/borne/"+ borne.id + "/password"}>
                                                        <i className="fa fa-key" title="Edition mot de passe"></i> 
                                                    </Link>
                                                    <Link className="text-success mr-1" to={"/banking/agence/"+ agence +"/borne/"+ borne.id}>
                                                        <i className="fa fa-eyedropper"></i> 
                                                    </Link>
                                                    <Link onClick={() => onRemove(borne.id)} className="text-danger" to={"#"}>
                                                        <i className="fa fa-trash"></i> 
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <Pagination update={setPage} paginator={bornes} />
                    </Wrapper>
                </div>
            </div>}
        </Layout>
    );

}

export default BorneAgence;