import { FormEvent, useEffect, useState } from "react";
import Layout from "../../../template/Layout";
import { BeatLoader } from "react-spinners";
import Wrapper from "../../../component/Wrapper";
import httpClient, { encodeData, writeErrors } from "../../../hooks/httpClient";
import Input from "../../../component/Input";
import { Link } from "react-router-dom";
import Pagination from "../../../component/Pagination";
import noNetWork, { Toast, ToastNotFound, ToastOperation, problemOccur } from "../../../component/AlertReport";
import myRoute from "../../../hooks/myRoute";
import { HttpStatusCode } from "axios";


const ListBanque = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAddLoading, setIsAddLoading] = useState(false);
    const [banques, setBanques] = useState<any>({});
    const [page, setPage] = useState('0');
    const [idBanque, setIdBanque] = useState(0);
    const [banqueAdd, setbanqueAdd] = useState({
        numeroCompte: '',
        libelle: ''
    });
    const [errors, setErrors] = useState({
        numeroCompte: undefined,
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
        httpClient.get(myRoute.listBanque.replace("{page}", page))
            .then(res => {
                setBanques(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                setIsLoading(false);
                if (err.response == undefined) {
                    noNetWork();
                } else {
                    problemOccur();
                }
            })
    }, [refresh, page])

    const onChoice = (target: number) => {
        if (target == menu.add) {
            setbanqueAdd({
                numeroCompte: '',
                libelle: ''
            });
            setTitle('Ajout de banque');
            setIdBanque(0);
            setErrors(writeErrors({ ...errors }, {}));
        }
        setChoice(target);
    }

    const onEdit = (data: any) => {
        setbanqueAdd({
            numeroCompte: data.numeroCompte,
            libelle: data.libelle
        })
        setErrors(writeErrors({ ...errors }, {}));
        setIdBanque(data.id);
        setTitle('Edition de banque');
        setChoice(menu.edit);
    }


    const onAddOrEdit = (e: FormEvent) => {
        e.preventDefault();
        setIsAddLoading(true);
        setErrors(writeErrors({ ...errors }, {}));

        const route =
            choice === menu.add
                ? myRoute.addBanque
                : myRoute.editBanque.replace("{id}", idBanque.toString());

        httpClient
            .post(route, banqueAdd, {
                headers: { "Content-Type": "application/json" },
            })
            .then((res) => {
                setIsAddLoading(false);
                Toast.fire();

                if (choice === menu.add) {
                    setbanqueAdd({ numeroCompte: "", libelle: "" });
                }

                setRefresh((r) => r + 1);
            })
            .catch((err) => {
                setIsAddLoading(false);
                if (!err.response) noNetWork();
                else if (err.response.status === HttpStatusCode.BadRequest)
                    setErrors(writeErrors({ ...errors }, err.response.data));
                else if (err.response.status === HttpStatusCode.NotFound)
                    ToastNotFound.fire();
                else problemOccur();
            });
    };

    const onRemove = (id: number) => {
        ToastOperation.fire()
            .then((res) => {
                if (res.isConfirmed) {
                    setIsLoading(true);

                    httpClient
                        .post(myRoute.removeBanque.replace("{id}", id.toString()))
                        .then(() => {
                            Toast.fire();
                            setRefresh((prev) => prev + 1);
                        })
                        .catch((err) => {
                            setIsLoading(false);
                            if (!err.response) {
                                noNetWork();
                            } else {
                                problemOccur();
                            }
                        });
                }
            });
    };


    return (
        <Layout title="Les banques">
            {isLoading == true && <div className="text-center">
                <BeatLoader />
            </div>}
            {isLoading == false && <div className="row">
                {(menu.add == choice || menu.edit == choice) && <div className="col-md-8 col-lg-5">
                    <Wrapper title={title}>
                        <div className="text-right"><button type="button" onClick={() => onChoice(menu.list)} className="btn btn-link">Les banques</button></div>
                        <form onSubmit={onAddOrEdit}>
                            <Input label='Numero de Compte Bancaire' report={errors.numeroCompte} name='numeroCompte' data={banqueAdd} update={setbanqueAdd} required />
                            <Input label='Nom de la banque' report={errors.libelle} name='libelle' data={banqueAdd} update={setbanqueAdd} required />
                            <div className="mt-2">
                                {isAddLoading == true && <div className="text-center">
                                    <BeatLoader />
                                </div>}
                                <button type="submit" className="btn btn-primary">Enregistrer</button>
                            </div>
                        </form>
                    </Wrapper>
                </div>}
                {menu.list == choice && <div className="col-9">
                    <Wrapper title="Liste des banques">
                        <div className="text-right mb-2">
                            <button type="button" onClick={() => onChoice(menu.add)} className="btn btn-primary text-right">Ajouter de banque</button>
                        </div>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Numéro de Compte Bancaire</th>
                                        <th>Nom de la banque</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {banques?.content?.map((banque: any) => {

                                        return (
                                            <tr key={banque.id}>
                                                <td>{banque.numeroCompte}</td>
                                                <td>{banque.libelle}</td>
                                                <td className="text-right">
                                                    <Link to={"#"} onClick={() => onEdit(banque)} className="text-success"><i className="fa fa-eyedropper"></i> </Link>
                                                    <Link to={"#"} onClick={() => onRemove(banque.id)} className="text-danger"><i className="fa fa-trash"></i> </Link>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <Pagination update={setPage} paginator={banques} />
                    </Wrapper>
                </div>}
            </div>}
        </Layout>
    );
}
export default ListBanque;