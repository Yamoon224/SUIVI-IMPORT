import { BeatLoader } from "react-spinners";
import Layout from "../../../template/Layout";
import { useEffect, useState } from "react";
import Wrapper from "../../../component/Wrapper";
import httpClient from "../../../hooks/httpClient";
import myRoute from "../../../hooks/myRoute";
import noNetWork, { problemOccur } from "../../../component/AlertReport";
import Pagination from "../../../component/Pagination";
import moment from "moment";

const TrackCheck = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState('0');
    const [checksActivities, setChecksActivities] = useState<any>({});
    useEffect(() => {
        httpClient.get(myRoute.suiviCheck.replace("{page}", page))
        .then(res => {
            console.log(res.data);
            setIsLoading(false);
            setChecksActivities(res.data)
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

    return(
        <Layout title="Suivi des cheques">
             {isLoading == true && <div className="text-center">
                <BeatLoader />
            </div>}
            {isLoading == false && <div className="row">
                <div className="col-12">
                    <Wrapper title="Les actions sur les cheques">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Numero du cheque</th>
                                        <th>Code Agence</th>
                                        <th>Code Banque</th>
                                        <th>Numero de compte</th>
                                        <th>Rib</th>
                                        <th>Montant</th>
                                        <th>Remise</th>
                                        <th>Etat</th>
                                        <th>Utilisateur</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {checksActivities?.content?.map((checkActivity: any) => {

                                        return(
                                            <tr key={checkActivity.id}>
                                                <td>{checkActivity.cheque.numeroCheque}</td>
                                                <td>{checkActivity.cheque.codeAgence}</td>
                                                <td>{checkActivity.cheque.codeBanque}</td>
                                                <td>{checkActivity.cheque.referenceClient}</td>
                                                <td>{checkActivity.cheque.rib}</td>
                                                <td>{checkActivity.cheque.montant}</td>
                                                <td>{checkActivity.cheque.remise.reference}</td>
                                                <td>{checkActivity.etat}</td>
                                                <td>{checkActivity.user.username}</td>
                                                <td>{moment(checkActivity.dateCreation).format("DD/MM/YYYY HH:mm")}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <Pagination update={setPage} paginator={checksActivities} />
                    </Wrapper>
                </div>
            </div>}
        </Layout>
    )
}
export default TrackCheck;