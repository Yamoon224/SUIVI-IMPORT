import { useEffect, useState } from "react";
import Pagination from "../../../component/Pagination";
import Layout from "../../../template/Layout";
import Wrapper from "../../../component/Wrapper";
import { BeatLoader } from "react-spinners";
import httpClient from "../../../hooks/httpClient";
import myRoute from "../../../hooks/myRoute";
import moment from 'moment';
import noNetWork, { Toast, ToastOperation, problemOccur } from "../../../component/AlertReport";
import MyLink from "../../../component/MyLink";
import { Link } from "react-router-dom";
import { HttpStatusCode } from "axios";
import Swal from "sweetalert2";

const EcobankUser = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState<any>({});
    const [page, setPage] = useState('0');
    useEffect(() => {
        httpClient.get(myRoute.listUsersEcobank.replace('{page}', page))
        .then(res => {
            setIsLoading(false);
            setUsers(res.data);
            
            
        }).catch(err => {
            setIsLoading(false);
            if(err.response == undefined){
                noNetWork();
            }else{
                problemOccur();
            }
        })
    }, [page]);


    const onResetPassword = (userId: number) => {
        ToastOperation.fire()
        .then(choice => {
            if(choice.isConfirmed){
                setIsLoading(true);
                httpClient.post(myRoute.resetPassword.replace("{userId}", userId.toString()))
                .then(res => {
                    setIsLoading(false);
                    Swal.fire({
                        title: 'Mot de passe reinitialise',
                        text: 'Nouveau mot de passe: '+ res.data.password,
                        icon: 'success',
                        backdrop: false
                    });
                })
                .catch(err => {
                    setIsLoading(false);
                    if(err.response == undefined){
                        noNetWork();
                    }else{
                       problemOccur();
                        
                    }
                })
            
            }
        })
    }

    return(
        <Layout title="Les utilisateurs de SO'3G">
            
            {isLoading == true &&
                <div className="text-center">
                    <BeatLoader/>
                </div>
            }
            {isLoading == false &&
                <div className="row">
                    <div className="col-12">
                        <Wrapper title="Les utilsateurs">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Nom</th>
                                            <th>Prenoms</th>
                                            <th>Nom utilisateur</th>
                                            <th>Privilege</th>
                                            <th>Status</th>
                                            <th>Date creation</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users?.content?.map((user: any) => {

                                            return(
                                                <tr key={user.id}>
                                                    <td>{user.nom}</td>
                                                    <td>{user.prenom}</td>
                                                    <td>{user.username}</td>
                                                    <td><span className="badge badge-warning">{user.role.libelle}</span></td>
                                                    <td>{user.status == 1 ? <span className="badge badge-primary">Active</span>: <span className="badge badge-danger">Desactive</span>}</td>
                                                    <td>{moment(user.dateCreation).format('DD/MM/YYYY HH:mm')}</td>
                                                    <td>
                                                        <Link className="text-success" to={"/suivi-import/info/"+ user.id +"/utilisateur"}><i className="fa fa-eye"></i> </Link>
                                                        <Link className="text-success" onClick={() => onResetPassword(user.id)} title="Reinitialiser mot de passe" to={"#"}><i className="fa fa-key"></i></Link>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination update={setPage} paginator={users} />
                        </Wrapper>
                    </div>
                </div>
            }
            
        </Layout>
    )
};

export default EcobankUser;