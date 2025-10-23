import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import myRoute from "../../../../hooks/myRoute";
import httpClient, { encodeData, writeErrors } from "../../../../hooks/httpClient";
import { useEffect, useState } from "react";
import noNetWork, { problemOccur, Toast, ToastOperation } from "../../../../component/AlertReport";
import { HttpStatusCode } from "axios";
import Layout from "../../../../template/Layout";
import { BeatLoader } from "react-spinners";
import Wrapper from "../../../../component/Wrapper";
import Input from "../../../../component/Input";
import Swal from "sweetalert2";
import { Fournisseur } from "../../../../../types/Fournisseur";


const InfoFournisseur = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const { fournisseurId } = useParams();
    const navigate = useNavigate();

    const [centraleId, setCentraleId] = useState<number | null>(null);
    const [fournisseursCentrales, setFournisseursCentrales] = useState<Fournisseur[]>([]);
    const [fournisseursLoading, setFournisseursLoading] = useState(false);
    const [removingId, setRemovingId] = useState<number | null>(null);
    const [refresh, setRefresh] = useState(0);

    const [fournisseurData, setFournisseurData] = useState({
        id: 0,
        codeFournisseur: "",
        intituleFournisseur: "",
        dateCreation: "",
        nomContact: "",
        telephone: "",
        telecopie: "",
        email: "",
        siret: "",
        adresse: "",
        ville: "",
        pays: "",
        status: 0,
    });

    const [errors, setErrors] = useState({
        codeFournisseur: undefined,
        intituleFournisseur: undefined,
        dateCreation: undefined,
        nomContact: undefined,
        telephone: undefined,
        telecopie: undefined,
        email: undefined,
        siret: undefined,
        adresse: undefined,
        ville: undefined,
        pays: undefined,
    });

    useEffect(() => {
        if (!fournisseurId) return;
        setIsLoading(true);
        httpClient
            .get(myRoute.infoFournisseur.replace("{fournisseurId}", String(fournisseurId)))
            .then((res) => {
                const four = res.data || {};
                setFournisseurData((prev) => ({
                    ...prev,
                    id: four.id || 0,
                    codeFournisseur: four?.codeFournisseur || "",
                    intituleFournisseur: four?.intituleFournisseur || "",
                    dateCreation: four.dateCreation ? four.dateCreation.substring(0, 10) : "",
                    nomContact: four.nomContact || "",
                    telephone: four.telephone || "",
                    telecopie: four.telecopie || "",
                    email: four.email || "",
                    siret: four.siret || "",
                    adresse: four.adresse || "",
                    ville: four.ville || "",
                    pays: four.pays || "",
                    status: four.status ?? 0,
                }));
                const resolvedCentraleId =
                    four.centraleId ??
                    four.idCentrale ??
                    (four.centrale ? (four.centrale.id ?? null) : null) ??
                    null;
                setCentraleId(resolvedCentraleId);
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
                if (!err.response) {
                    noNetWork();
                } else if (err.response.status === HttpStatusCode.NotFound) {
                    setNotFound(true);
                } else {
                    problemOccur();
                }
            });
    }, [fournisseurId]);

    useEffect(() => {
        if (!fournisseurId) return;
        console.log("Chargement des fournisseurs de la centrale", fournisseurId);
        httpClient
            .get(myRoute.listefournisseurDefournisseurCentrale.replace("{idCentrale}", String(fournisseurId)))
            .then((res) => {
                console.log("Réponse API :", res?.data);
                setFournisseursCentrales(res.data.associations || []);
            })
            .catch((err) => console.error(err));
    }, [refresh, fournisseurId]);

    const onRemove = (id: number) => {
        ToastOperation.fire()
            .then(choice => {
                if (choice.isConfirmed) {
                    setIsLoading(true);
                    httpClient.post(myRoute.supprimerFournisseurDeCentrale.replace("{associationId}", id.toString()))
                        .then(res => {
                            console.log("Réponse API :", res?.data);
                            setIsLoading(false);
                            Swal.fire({
                                title: 'Fournisseur retiré de la centrale avec succès',
                                icon: 'success',
                                backdrop: false
                            });
                            setRefresh(refresh + 1);
                        })
                        .catch(err => {
                            setIsLoading(false);
                            if (err.response == undefined) {
                                noNetWork();
                            } else {
                                problemOccur();
                            }
                        });
                }
            });
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitLoading(true);
        setErrors(writeErrors({ ...errors }, {}));
        httpClient
            .post(myRoute.editionFournisseur, fournisseurData)
            .then((res) => {
                setIsSubmitLoading(false);
                Toast.fire({
                    icon: "success",
                    title: "Fournisseur modifié avec succès",
                });
            })
            .catch((err) => {
                setIsSubmitLoading(false);
                if (err.response == undefined) {
                    noNetWork();
                } else {
                    if (err.response.status == HttpStatusCode.BadRequest) {
                        setErrors(writeErrors({ ...errors }, err.response.data));
                    } else if (err.response.status == HttpStatusCode.NotFound) {
                        setNotFound(true);
                    } else {
                        problemOccur();
                    }
                }
            });
    };

    if (notFound) {
        return <Navigate to={"/suivi-import/liste-fournisseurs"} />;
    }

    return (
        <Layout title="Gestion des fournisseurs">
            {isLoading ? (
                <div className="text-center">
                    <BeatLoader />
                </div>
            ) : (
                // --- ROW PRINCIPALE : DEUX COLONNES ---
                <div className="row">
                    {/* colonne gauche : FORMULAIRE (inchangée) */}
                    <div className="col-md-7 col-lg-6">
                        <Wrapper title="Modifier le  fournisseur">
                            <div className="text-right mb-3">
                                <button
                                    type="button"
                                    className="btn ml-2"
                                    style={{ backgroundColor: "#ff5722", color: "white", border: "none" }}
                                    onClick={() => navigate("/suivi-import/liste-fournisseurs")}
                                >
                                    Liste des fournisseurs
                                </button>
                            </div>
                            <form onSubmit={onSubmit}>
                                <Input
                                    label="Code Fournisseur"
                                    name="codeFournisseur"
                                    data={fournisseurData}
                                    update={setFournisseurData}
                                    report={errors.codeFournisseur}
                                />
                                <Input
                                    label="Intitulé Fournisseur"
                                    name="intituleFournisseur"
                                    data={fournisseurData}
                                    update={setFournisseurData}
                                    report={errors.intituleFournisseur}
                                />
                                <Input
                                    label="Date de création"
                                    type="date"
                                    name="dateCreation"
                                    data={fournisseurData}
                                    update={setFournisseurData}
                                    report={errors.dateCreation}
                                />
                                <Input
                                    label="Nom Contact"
                                    name="nomContact"
                                    data={fournisseurData}
                                    update={setFournisseurData}
                                    report={errors.nomContact}
                                />
                                <Input
                                    label="Téléphone"
                                    name="telephone"
                                    data={fournisseurData}
                                    update={setFournisseurData}
                                    report={errors.telephone}
                                />
                                <Input
                                    label="Fax (Télécopie)"
                                    name="telecopie"
                                    data={fournisseurData}
                                    update={setFournisseurData}
                                    report={errors.telecopie}
                                />
                                <Input
                                    label="Email"
                                    type="email"
                                    name="email"
                                    data={fournisseurData}
                                    update={setFournisseurData}
                                    report={errors.email}
                                />
                                <Input
                                    label="N°CC"
                                    name="siret"
                                    data={fournisseurData}
                                    update={setFournisseurData}
                                    report={errors.siret}
                                />
                                <Input
                                    label="Adresse"
                                    name="adresse"
                                    data={fournisseurData}
                                    update={setFournisseurData}
                                    report={errors.adresse}
                                />
                                <Input
                                    label="Ville"
                                    name="ville"
                                    data={fournisseurData}
                                    update={setFournisseurData}
                                    report={errors.ville}
                                />
                                <Input
                                    label="Pays"
                                    name="pays"
                                    data={fournisseurData}
                                    update={setFournisseurData}
                                    report={errors.pays}
                                />
                                <div className="mt-3">
                                    {isSubmitLoading && (
                                        <div className="text-center mb-2">
                                            <BeatLoader />
                                        </div>
                                    )}
                                    <button disabled={isSubmitLoading} type="submit" className="btn btn-primary">
                                        Enregistrer
                                    </button>
                                </div>
                            </form>
                        </Wrapper>
                    </div>

                    {/* colonne droite : LISTE DES FOURNISSEURS DE LA CENTRALE (ou message si pas centrale) */}
                    <div className="col-md-5 col-lg-6">
                        <Wrapper title="Les fournisseurs de la centrale D'Achat">
                            {fournisseurId ? (
                                fournisseursLoading ? (
                                    <div className="text-center">
                                        <BeatLoader />
                                    </div>
                                ) : fournisseursCentrales.length === 0 ? (
                                    <p>Aucun fournisseur associé à cette centrale.</p>
                                ) : (
                                    <table className="table table-bordered table-hover">
                                        <thead className="thead-light">
                                            <tr>
                                                <th scope="col">Code fournisseur</th>
                                                <th scope="col">Intitulé du fournisseur</th>
                                                <th scope="col" className="text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fournisseursCentrales.map((f) => (
                                                <tr key={f.id}>
                                                    <td>{f.codeFournisseur}</td>
                                                    <td>{f.intituleFournisseur}</td>
                                                    <td className="text-center">
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            style={{ backgroundColor: "#ff5722", color: "white", border: "none" }}
                                                            disabled={removingId === f.id}
                                                            onClick={() => onRemove(f.id)}
                                                        >
                                                            {removingId === f.id ? "..." : "Supprimer"}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )
                            ) : (
                                <div className="alert alert-warning mt-2 mb-0">
                                    Vous n’êtes pas autorisé à avoir plusieurs fournisseurs.
                                </div>
                            )}
                        </Wrapper>
                    </div>

                </div>
            )}
        </Layout>
    );
};

export default InfoFournisseur;