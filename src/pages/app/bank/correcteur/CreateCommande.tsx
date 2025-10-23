import { useEffect, useState } from "react";
import httpClient, { encodeData, writeErrors } from "../../../hooks/httpClient";
import myRoute from "../../../hooks/myRoute";
import noNetWork, { problemOccur } from "../../../component/AlertReport";
import Swal from "sweetalert2";
import { HttpStatusCode } from "axios";
import Layout from "../../../template/Layout";
import { BeatLoader } from "react-spinners";
import Wrapper from "../../../component/Wrapper";
import Input from "../../../component/Input";
import { useNavigate, useParams } from "react-router-dom";

const CreateCommande = () => {

    const [errors, setErrors] = useState<any>({});
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { fournisseurId } = useParams();
    const [incoterms, setIncoterms] = useState<any[]>([]);
    const [fournisseurs, setFournisseurs] = useState<any[]>([]);
    const [refresh, setRefresh] = useState(0);
    const [page] = useState("0");
    const [fournisseur, setFournisseur] = useState<any>({});
    const [commandeData, setCommandeData] = useState({
        numeroDai: "",
        numeroCommande: "",
        numeroProforma: "",
        dateProforma: "",
        incoterm: "",
        modeEnvoi: "",
        clientDestinataire: "",
        dateLivraisonSouhaitee: "",
        dateEtd: "",
        dateEta: "",
        fournisseurId: fournisseurId || "",
        devise: "",
    });

    // Chargement des incoterms
    useEffect(() => {
        setIsLoading(true);
        httpClient
            .get(myRoute.listeIncoterm.replace("{page}", page))
            .then((res) => {
                setIncoterms(res.data?.content ?? res.data ?? []);
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
                if (!err.response) noNetWork();
                else problemOccur();
            });
    }, [refresh, page]);

    useEffect(() => {
        if (!fournisseurId) return;
        const url = myRoute.infoFournisseur.replace("{fournisseurId}", fournisseurId);
        console.log("🔍 URL appelée :", url);
        httpClient
            .get(url)
            .then((res) => {
                console.log("✅ Fournisseur récupéré :", res.data);
                setFournisseur(res.data);
            })
            .catch((err) => {
                console.error("❌ Erreur lors de la récupération du fournisseur :", err);
                if (!err.response) noNetWork();
                else problemOccur();
            });
    }, [fournisseurId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCommandeData({ ...commandeData, [name]: value });
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitLoading(true);
        setErrors(writeErrors({ ...errors }, {}));

        httpClient
            .post(myRoute.creerCommande, commandeData)
            .then((res) => {
                const createdCommande = res.data;
                const commandeId = createdCommande.id;

                setCommandeData({
                    numeroDai: "",
                    numeroCommande: "",
                    numeroProforma: "",
                    dateProforma: "",
                    incoterm: "",
                    modeEnvoi: "",
                    clientDestinataire: "",
                    dateLivraisonSouhaitee: "",
                    dateEtd: "",
                    dateEta: "",
                    fournisseurId: fournisseurId || "",
                    devise: "",
                });

                Swal.fire({
                    title: "Commande enregistrée",
                    text: "La commande a été enregistrée avec succès.",
                    icon: "success",
                }).then(() => {
                    navigate(`/suivi-import/creerLigneCommande/${commandeId}`);
                });
            })
            .catch((err) => {
                setIsSubmitLoading(false);
                if (!err.response) noNetWork();
                else if (err.response.status === HttpStatusCode.BadRequest) {
                    const errs = writeErrors({ ...errors }, err.response.data);
                    setErrors(errs);
                } else problemOccur();
            });
    };

    return (
        <Layout title="Gestion des commandes">
            <div className="col-md-10 col-lg-8">
                <Wrapper title="Nouvelle commande">
                    <form onSubmit={onSubmit}>
                        <Input
                            label="Numéro DAI"
                            report={errors.numeroDai}
                            name="numeroDai"
                            data={commandeData}
                            update={setCommandeData}
                        />
                        <Input
                            label="Numéro commande"
                            report={errors.numeroCommande}
                            name="numeroCommande"
                            data={commandeData}
                            update={setCommandeData}
                        />
                        <Input
                            label="Numéro proforma"
                            report={errors.numeroProforma}
                            name="numeroProforma"
                            data={commandeData}
                            update={setCommandeData}
                        />
                        <Input
                            label="Date Commande proforma"
                            type="date"
                            report={errors.dateProforma}
                            name="dateProforma"
                            data={commandeData}
                            update={setCommandeData}
                        />

                        {/* Liste déroulante Incoterm */}
                        <div className="mt-3">
                            <label>Incoterm *</label>
                            {isLoading ? (
                                <div className="text-center">
                                    <BeatLoader size={8} />
                                </div>
                            ) : (
                                <select
                                    className="form-control"
                                    name="incoterm"
                                    value={commandeData.incoterm}
                                    onChange={handleChange}
                                    disabled={isSubmitLoading}
                                    required
                                >
                                    <option value="">-- Sélectionner un incoterm --</option>
                                    {incoterms.map((item: any) => (
                                        <option key={item.id} value={item.incoterm}>
                                            {item.incoterm} - {item.signification}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {errors.incoterm && (
                                <div className="text-danger small">{errors.incoterm}</div>
                            )}
                        </div>
                          <div className="mt-3">
                    <label>Devise *</label>
                    <select
                      className="form-control"
                      name="devise"
                      value={commandeData.devise}
                      onChange={(e) =>
                        setCommandeData({ ...commandeData, devise: e.target.value })
                      }
                      disabled={isLoading}
                      required
                    >
                      <option value="">-- Sélectionner la devise --</option>
                      <option value="XOF">XOF</option>
                      <option value="EURO">EURO</option>
                      <option value="USD">USD</option>
                    </select>
                    {errors.devise && (
                      <div className="text-danger small">{errors.devise}</div>
                    )}
                  </div>
                        {/* Fournisseur affiché en lecture seule */}
                        <Input
                            label="Code fournisseur"
                            name="codeFournisseur"
                            data={{ codeFournisseur: fournisseur?.codeFournisseur }}
                            update={() => { }}
                            disable={true}
                        />

                        <Input
                            label="Intitulé fournisseur"
                            name="intituleFournisseur"
                            data={{ intituleFournisseur: fournisseur?.intituleFournisseur }}
                            update={() => { }}
                            disable={true}
                        />
{/* 
                        <Input
                            label="Mode envoi"
                            report={errors.modeEnvoi}
                            name="modeEnvoi"
                            data={commandeData}
                            update={setCommandeData}
                        /> */}
                        <Input
                            label="Client destinataire"
                            report={errors.clientDestinataire}
                            name="clientDestinataire"
                            data={commandeData}
                            update={setCommandeData}
                        />
                        <Input
                            label="Date livraison souhaitée"
                            type="date"
                            report={errors.dateLivraisonSouhaitee}
                            name="dateLivraisonSouhaitee"
                            data={commandeData}
                            update={setCommandeData}
                        />
                        <Input
                            label="Date ETD"
                            type="date"
                            report={errors.dateEtd}
                            name="dateEtd"
                            data={commandeData}
                            update={setCommandeData}
                        />
                        <Input
                            label="Date ETA"
                            type="date"
                            report={errors.dateEta}
                            name="dateEta"
                            data={commandeData}
                            update={setCommandeData}
                        />

                        <div className="mt-2">
                            {isSubmitLoading && (
                                <div className="text-center">
                                    <BeatLoader />
                                </div>
                            )}
                            <button
                                disabled={isSubmitLoading}
                                type="submit"
                                className="btn btn-primary"
                            >
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </Wrapper>
            </div>
        </Layout>
    );
};

export default CreateCommande;