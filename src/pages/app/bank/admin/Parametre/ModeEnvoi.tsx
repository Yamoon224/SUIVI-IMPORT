import { FormEvent, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import Wrapper from "../../../../component/Wrapper";
import httpClient, { encodeData, writeErrors } from "../../../../hooks/httpClient";
import Input from "../../../../component/Input";
import { Link } from "react-router-dom";
import Pagination from "../../../../component/Pagination";
import noNetWork, { Toast, ToastNotFound, ToastOperation, problemOccur } from "../../../../component/AlertReport";
import myRoute from "../../../../hooks/myRoute";
import { HttpStatusCode } from "axios";
import Layout from "../../../../template/Layout";

const ModeEnvoi = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAddLoading, setIsAddLoading] = useState(false);
    const [modes, setModes] = useState<any>({});
    const [page, setPage] = useState('0');
    const [idBanque, setIdBanque] = useState(0);
    const [banqueAdd, setbanqueAdd] = useState({
        intitule: ''
    });
    const [errors, setErrors] = useState({
        intitule: undefined
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
        httpClient.get(myRoute.listModeEnvoie.replace("{page}", page))
            .then(res => {
                setModes(res.data);
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
                intitule: ''
            });
            setTitle('Ajout de banque');
            setIdBanque(0);
            setErrors(writeErrors({ ...errors }, {}));
        }
        setChoice(target);
    }

    const onEdit = (data: any) => {
        setbanqueAdd({
            intitule: data.intitule
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
                ? myRoute.addModeEnvoie
                : myRoute.editModeEnvoie.replace("{id}", idBanque.toString());

        httpClient
            .post(route, banqueAdd, {
                headers: { "Content-Type": "application/json" },
            })
            .then((res) => {
                setIsAddLoading(false);
                Toast.fire();

                if (choice === menu.add) {
                    setbanqueAdd({ intitule: "" });
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
                        .post(myRoute.removeModeEnvoie.replace("{id}", id.toString()))
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
        <Layout title="Les modes envois">
            {isLoading == true && <div className="text-center">
                <BeatLoader />
            </div>}
            {isLoading == false && <div className="row">
                {(menu.add == choice || menu.edit == choice) && <div className="col-md-8 col-lg-5">
                    <Wrapper title={title}>
                        <div className="text-right"><button type="button" onClick={() => onChoice(menu.list)} className="btn btn-link">Les Modes envois</button></div>
                        <form onSubmit={onAddOrEdit}>
                            <Input label='Intitule Envoie' report={errors.intitule} name='intitule' data={banqueAdd} update={setbanqueAdd} required />
                            <div className="mt-2">
                                {isAddLoading == true && <div className="text-center">
                                    <BeatLoader />
                                </div>}
                                <button type="submit" className="btn btn-primary">Enregistrer</button>
                            </div>
                        </form>
                    </Wrapper>
                </div>}
                {menu.list == choice && <div className="col-6">
                    <Wrapper title="Liste des Modes Envois">
                        <div className="text-right mb-2">
                            <button type="button" onClick={() => onChoice(menu.add)} className="btn btn-primary text-right">Ajouter Mode Envoi</button>
                        </div>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Intitule Envoie</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modes?.content?.map((mode: any) => {

                                        return (
                                            <tr key={mode.id}>
                                                <td>{mode.intitule}</td>
                                                <td className="text-right">
                                                    <Link to={"#"} onClick={() => onEdit(mode)} className="text-success"><i className="fa fa-eyedropper"></i> </Link>
                                                    <Link to={"#"} onClick={() => onRemove(mode.id)} className="text-danger"><i className="fa fa-trash"></i> </Link>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <Pagination update={setPage} paginator={modes} />
                    </Wrapper>
                </div>}
            </div>}
        </Layout>
    );
}
export default ModeEnvoi;