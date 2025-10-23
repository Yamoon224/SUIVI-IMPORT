import { useEffect, useState } from "react";
import Layout from "../../../template/Layout";
import { BeatLoader } from "react-spinners";
import Wrapper from "../../../component/Wrapper";
import Pagination from "../../../component/Pagination";
import httpClient from "../../../hooks/httpClient";
import myRoute from "../../../hooks/myRoute";
import noNetWork, { problemOccur } from "../../../component/AlertReport";
import { HttpStatusCode } from "axios";
import moment from "moment";
import AuditEtat from "../../../component/AuditEtat";


const Audit = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState('0');
    const [audits, setAudits] =  useState<any>({});

    useEffect(() => {
        httpClient.get(myRoute.audit.replace("{page}", page))
        .then(res => {
            console.log(res.data);
            
            setAudits(res.data);
            setIsLoading(false);
        })
        .catch(err => {
            setIsLoading(false);
            if(err.response == undefined){
                noNetWork();
            }else{
                problemOccur();
            }
           
        })
    }, [page])
    return(
        <Layout title="Les activites des utilisateurs">
            {isLoading == true && <div className="text-center">
                <BeatLoader />
            </div>}
            {isLoading == false && <div>
                    <Wrapper title="Piste audit">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Etat</th>
                                        <th>Actions</th>
                                        <th>Objects</th>
                                        <th>Utilisateurs</th>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    {audits?.content?.map((audit : any) => {

                                        return(
                                            <tr key={audit.id}>
                                                <td>{moment(audit.dateCreation).format('DD/MM/YYYY HH:mm')}</td>
                                                <td><AuditEtat status={audit.status} /></td>
                                                <td>{audit.libelle}</td>
                                                <td>{audit.objet}</td>
                                                <td><span>{audit.user?.username}</span></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <Pagination update={setPage} paginator={audits} />
                    </Wrapper>
            </div>}
        </Layout>
    )
}
export default Audit;