import { FormEvent, useEffect, useState } from "react";
import Layout from "../../../template/Layout";
import { BeatLoader } from "react-spinners";
import Wrapper from "../../../component/Wrapper";
import Input from "../../../component/Input";
import httpClient, { encodeData, writeErrors } from "../../../hooks/httpClient";
import myRoute from "../../../hooks/myRoute";
import noNetWork, { Toast, ToastNotFound, ToastOperation, problemOccur } from "../../../component/AlertReport";
import { HttpStatusCode } from "axios";
import Swal from "sweetalert2";
import Pagination from "../../../component/Pagination";
import { Link } from "react-router-dom";


const ListMotif = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAddLoading, setIsAddLoading] = useState(false);
    const [motifs, setMotifs] = useState<any>({});
    const [page, setPage] = useState('0');
    const [idMotif, setIdMotif] = useState(0);
    const [motifAdd, setMotifAdd] = useState({
        code: '',
        libelle: ''
    });
    const [errors, setErrors] = useState({
        code: undefined,
        libelle: undefined
    })

    const [refresh, setRefresh] = useState(0);
    const [menu, setMenu] = useState({
        list: 0,
        add: 1,
        edit: 2
    });
    const [choice, setChoice] = useState(menu.list);
    const [title, setTitle] = useState('');

    useEffect(() => {
        httpClient.get(myRoute.listMotif.replace("{page}", page))
        .then(res => {
            setMotifs(res.data);
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
    }, [refresh, page])


    const onChoice = (target: number) => {

        if(target == menu.add){
            setMotifAdd({
                code: '',
                libelle: ''
            });
            setTitle('Ajout de motif');
            setIdMotif(0);
            setErrors(writeErrors({...errors}, {}));
        }
        setChoice(target);
    }

    const onEdit = (data: any) => {
        setMotifAdd({
            code: data.code,
            libelle: data.libelle
        })
        setErrors(writeErrors({...errors}, {}));
        setIdMotif(data.id);
        setTitle('Edition de motif');
        setChoice(menu.edit);
    }


    const onAddMotif = (e: FormEvent) => {
        e.preventDefault();
        setIsAddLoading(true);
        setErrors(writeErrors({...errors}, {}));
        const route = choice == menu.add ? myRoute.addMotif : myRoute.editMotif.replace("{id}", idMotif.toString());
        httpClient.post(route, encodeData(motifAdd))
        .then(res => {
            setIsAddLoading(false);
            Toast.fire();
            if(menu.add == choice){
                setMotifAdd({
                    code: '',
                    libelle: ''
                });
            }
            
            const fresh = refresh + 1;
            setRefresh(fresh);
            
        })
        .catch(err => {
            setIsAddLoading(false);
            if(err.response == undefined){
                noNetWork();
            }else{
                if(err.response.status == HttpStatusCode.BadRequest){
                    setErrors(writeErrors({...errors}, err.response.data));
                }
                else if(err.response.status == HttpStatusCode.NotFound){
                    ToastNotFound.fire();
                }else{
                    problemOccur();
                }
            }
        })
    }

    const onRemove = (id: number) => {

        ToastOperation.fire()
        .then(res => {
            if(res.isConfirmed){
                setIsLoading(true);
                httpClient.post(myRoute.removeMotif.replace("{id}", id.toString()))
                .then(res => {
                    Toast.fire();
                    const fresh = refresh + 1;
                    setRefresh(fresh);
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
        <Layout title="Les motifs de rejets">
            {isLoading == true && <div className="text-center">
                <BeatLoader />
            </div>}
            {isLoading == false && <div className="row">
                {(menu.add == choice || menu.edit == choice)  && <div className="col-md-8 col-lg-5">
                    <Wrapper title={title}>
                        <div className="text-right"><button type="button" onClick={() => onChoice(menu.list)} className="btn btn-link">Les motifs</button></div>
                        <form onSubmit={onAddMotif}>
                            <Input  label='Code Motif' report={errors.code}  name='code' data={motifAdd}  update={setMotifAdd}/>
                            <Input  label='Libelle Motif' report={errors.libelle}  name='libelle' data={motifAdd}  update={setMotifAdd}/>
                            <div className="mt-2">
                                {isAddLoading == true && <div className="text-center">
                                    <BeatLoader />
                                </div>}
                                <button type="submit" className="btn btn-primary">Enregistrer</button>
                            </div>
                        </form>
                    </Wrapper>
                </div>}
                {menu.list == choice && <div className="col-12">
                    <Wrapper title="Liste des rejets">
                        <div className="text-right mb-2">
                            <button type="button" onClick={() => onChoice(menu.add)} className="btn btn-primary text-right">Ajouter un motif</button>
                        </div>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Code Motif</th>
                                        <th>Libelle Motif</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {motifs?.content?.map((motif : any) => {

                                        return(
                                            <tr key={motif.id}>
                                                <td>{motif.code}</td>
                                                <td>{motif.libelle}</td>
                                                <td className="text-right">
                                                    <Link to={"#"} onClick={() => onEdit(motif)} className="text-success"><i className="fa fa-eyedropper"></i> </Link>
                                                    <Link to={"#"} onClick={() => onRemove(motif.id)} className="text-danger"><i className="fa fa-trash"></i> </Link>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <Pagination update={setPage} paginator={motifs} />
                    </Wrapper>
                </div>}
            </div>}
        </Layout>
    );
}
export default ListMotif;