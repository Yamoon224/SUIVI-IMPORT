import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import myRoute from "../../../../hooks/myRoute";
import httpClient, { writeErrors } from "../../../../hooks/httpClient";
import { useEffect, useState } from "react";
import noNetWork, { problemOccur, Toast, ToastOperation } from "../../../../component/AlertReport";
import { HttpStatusCode } from "axios";
import Layout from "../../../../template/Layout";
import { BeatLoader } from "react-spinners";
import Wrapper from "../../../../component/Wrapper";
import Input from "../../../../component/Input";
import { Fournisseur } from "../../../../../types/Fournisseur";
import Swal from "sweetalert2";

const InfoArticle = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const { articleId } = useParams();
    const [fournisseurArticles, setFournisseurArticles] = useState<Fournisseur[]>([]);
    const [fournisseursLoading, setFournisseursLoading] = useState(false);
    const [removingId, setRemovingId] = useState<number | null>(null);
    const [refresh, setRefresh] = useState(0);
     const navigate = useNavigate();

    const [articleData, setArticleData] = useState({
        id: 0,
        codeFamille: '',
        libelleFamille: '',
        referenceArticle: '',
        afRefFourniss: '',
        designationArticle: '',
        suiviStock: '',
        fournisseurPrincipal: '',
    });

    const [errors, setErrors] = useState({
        codeFamille: undefined,
        libelleFamille: undefined,
        referenceArticle: undefined,
        afRefFourniss: undefined,
        designationArticle: undefined,
        suiviStock: undefined,
        fournisseurPrincipal: undefined,
    });

    useEffect(() => {
        if (!articleId) return;

        setIsLoading(true);

        httpClient.get(myRoute.infoArticle.replace('{articleId}', articleId))
            .then(res => {
                const art = res.data || {};
                setArticleData({
                    id: art.id || 0,
                    codeFamille: art.codeFamille || '',
                    libelleFamille: art.libelleFamille || '',
                    referenceArticle: art.referenceArticle || '',
                    afRefFourniss: art.afRefFourniss || '',
                    designationArticle: art.designationArticle || '',
                    suiviStock: art.suiviStock || '',
                    fournisseurPrincipal: art.fournisseurPrincipal || '',
                });
                setIsLoading(false);
            })
            .catch(err => {
                setIsLoading(false);
                if (!err.response) {
                    noNetWork();
                } else if (err.response.status === HttpStatusCode.NotFound) {
                    setNotFound(true);
                } else {
                    problemOccur();
                }
            });
    }, [articleId]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitLoading(true);
        setErrors(writeErrors({ ...errors }, {}));

        httpClient.post(myRoute.editionArticle, articleData)
            .then(res => {
                setIsSubmitLoading(false);
                Toast.fire({
                    icon: 'success',
                    title: 'Article modifié avec succès'
                });
            })
            .catch(err => {
                setIsSubmitLoading(false);
                if (!err.response) {
                    noNetWork();
                } else if (err.response.status === HttpStatusCode.BadRequest) {
                    setErrors(writeErrors({ ...errors }, err.response.data));
                } else if (err.response.status === HttpStatusCode.NotFound) {
                    setNotFound(true);
                } else {
                    problemOccur();
                }
            });
    };

        useEffect(() => {
        if (!articleId) return;
        console.log("Chargement des fournisseurs de l'article", articleId);
        httpClient
            .get(myRoute.listeFournisseursArticle.replace("{articleId}", String(articleId)))
            .then((res) => {
                console.log("Réponse API :", res?.data);
                setFournisseurArticles(res.data.associations || []);
            })
            .catch((err) => console.error(err));
    }, [refresh, articleId]);
    
    const onRemove = (id: number) => {
        ToastOperation.fire()
            .then(choice => {
                if (choice.isConfirmed) {
                    setIsLoading(true);
                    httpClient.post(myRoute.supprimerFournisseurArticle.replace("{associationId}", id.toString()))
                        .then(res => {
                            console.log("Réponse API :", res?.data);
                            setIsLoading(false);
                            Swal.fire({
                                title: 'Fournisseur retiré de l/article avec succès',
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

    if (notFound) {
        return <Navigate to={"/suivi-import/liste-article"} />;
    }

    return (
        <Layout title="Gestion des articles">
            {isLoading ? (
                <div className="text-center">
                    <BeatLoader />
                </div>
            ) : (
                <div className="row">
                    <div className="col-md-7 col-lg-6">
                        <Wrapper title="Modifier un article">
                              <div className="text-right mb-3">
                                <button
                                    type="button"
                                    className="btn ml-2"
                                    style={{ backgroundColor: "#ff5722", color: "white", border: "none" }}
                                    onClick={() => navigate("/suivi-import/liste-article")}
                                >
                                   Liste des articles
                                </button>
                            </div>
                            <form onSubmit={onSubmit}>
                                <Input label="Code Famille" name="codeFamille" data={articleData} update={setArticleData} report={errors.codeFamille} />
                                <Input label="Libellé Famille" name="libelleFamille" data={articleData} update={setArticleData} report={errors.libelleFamille} />
                                <Input label="Référence Article" name="referenceArticle" data={articleData} update={setArticleData} report={errors.referenceArticle} />
                                <Input label="Référence Fournisseur" name="afRefFourniss" data={articleData} update={setArticleData} report={errors.afRefFourniss} />
                                <Input label="Désignation" name="designationArticle" data={articleData} update={setArticleData} report={errors.designationArticle} />
                                <Input label="Suivi Stock" name="suiviStock" data={articleData} update={setArticleData} report={errors.suiviStock} />
                                <Input label="Fournisseur Principal" name="fournisseurPrincipal" data={articleData} update={setArticleData} report={errors.fournisseurPrincipal} />
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

                      {/* colonne droite : LISTE DES FOURNISSEURS DE L'ARTICLE(ou message si pas centrale) */}
                    <div className="col-md-5 col-lg-6">
                        <Wrapper title="Les fournisseurs de l'article ">
                            {articleId ? (
                                fournisseursLoading ? (
                                    <div className="text-center">
                                        <BeatLoader />
                                    </div>
                                ) : fournisseurArticles.length === 0 ? (
                                    <p>Aucun fournisseur associé à cet article.</p>
                                ) : (
                                    <table className="table table-bordered table-hover">
                                        <thead className="thead-light">
                                            <tr>
                                                <th scope="col">Code</th>
                                                <th scope="col">Intitulé</th>
                                                <th scope="col" className="text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fournisseurArticles.map((f) => (
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

export default InfoArticle;
