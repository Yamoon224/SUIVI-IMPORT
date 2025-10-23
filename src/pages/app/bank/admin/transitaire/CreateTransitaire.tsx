import React, { useState } from "react";

import { HttpStatusCode } from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import httpClient, { encodeData, writeErrors } from "../../../../hooks/httpClient";
import myRoute from "../../../../hooks/myRoute";
import noNetWork, { problemOccur } from "../../../../component/AlertReport";
import Layout from "../../../../template/Layout";
import Wrapper from "../../../../component/Wrapper";
import Input from "../../../../component/Input";
import { BeatLoader } from "react-spinners";

const CreateTransitaire = () => {
    const [fournisseurData, setFournisseurData] = useState({
        codeFournisseur: '',
        intituleFournisseur: '',
        telecopie: '',
        email: '',
        siret: '',
        adresse: '',
        codePostal: '',
        ville: '',
        pays: '',
        modePaiement: 'VIREMENT',
        echeance: '',
        iban: '',
        bic: '',
        contactEmail: '',
        contactFonction: '',
        contactPrenoms: '',
        contactNom: '',
        devise: 'XOF',
    });

    const [errors, setErrors] = useState({
        codeFournisseur: undefined,
        intituleFournisseur: undefined,
        codePostal: undefined,
        telecopie: undefined,
        email: undefined,
        siret: undefined,
        adresse: undefined,
        ville: undefined,
        pays: undefined,
        modePaiement: undefined,
        echeance: undefined,
        iban: undefined,
        bic: undefined,
        contactEmail: undefined,
        contactFonction: undefined,
        contactPrenoms: undefined,
        contactNom: undefined,
        devise: undefined,
    });

    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const navigate = useNavigate();
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitLoading(true);
        httpClient.post(myRoute.creerFournisseur, fournisseurData)
            .then((res) => {
                const createdFournisseur = res.data;
                setErrors({
                    codeFournisseur: undefined,
                    intituleFournisseur: undefined,
                    codePostal: undefined,
                    telecopie: undefined,
                    email: undefined,
                    siret: undefined,
                    adresse: undefined,
                    ville: undefined,
                    pays: undefined,
                    modePaiement: undefined,
                    echeance: undefined,
                    iban: undefined,
                    bic: undefined,
                    contactEmail: undefined,
                    contactFonction: undefined,
                    contactPrenoms: undefined,
                    contactNom: undefined,
                    devise: undefined,
                });

                setFournisseurData({
                    codeFournisseur: '',
                    intituleFournisseur: '',
                    codePostal: '',
                    telecopie: '',
                    email: '',
                    siret: '',
                    adresse: '',
                    ville: '',
                    pays: '',
                    modePaiement: 'VIREMENT',
                    echeance: '',
                    iban: '',
                    bic: '',
                    contactEmail: '',
                    contactFonction: '',
                    contactPrenoms: '',
                    contactNom: '',
                    devise: 'XOF',
                });
                setIsSubmitLoading(false);
                Swal.fire({
                    title: "Création Transitaire",
                    text: "Le transitaire a été créé avec succès.",
                    icon: "success",
                    backdrop: false,
                });
                if (createdFournisseur.type === "CENTRALE") {
                    navigate(`/suivi-import/fournisseurCentrale/${createdFournisseur.id}/fournisseur`);
                }
            })
            .catch((err) => {
                setIsSubmitLoading(false);
                if (err.response == undefined) {
                    noNetWork();
                } else {
                    if (err.response.status === HttpStatusCode.BadRequest) {
                        const errs = writeErrors({ ...errors }, err.response.data);
                        setErrors(errs);
                    } else {
                        problemOccur();
                    }
                }
            });
    };

    return (
        <Layout title="Enregistrer un transitaire">
            <div className="row">
                <div className="col-md-10 col-lg-8">
                    <Wrapper title="Nouveau fournisseur">
                        <div className="text-right mb-3">
                            <Link className="btn btn-link" to="/suivi-import/liste-fournisseurs">Liste des transitaires</Link>
                        </div>
                        <form onSubmit={onSubmit}>
                            {/* Champs existants */}
                            <Input label="Code Fournisseur" name="codeFournisseur" data={fournisseurData} update={setFournisseurData} report={errors.codeFournisseur} />
                            <Input label="Intitulé Fournisseur" name="intituleFournisseur" data={fournisseurData} update={setFournisseurData} report={errors.intituleFournisseur} />
                            <Input label="Code Postal" name="codePostal" data={fournisseurData} update={setFournisseurData} report={errors.codePostal} />
                            <Input label="Fax (Télécopie)" name="telecopie" data={fournisseurData} update={setFournisseurData} report={errors.telecopie} />
                            <Input label="Email" type="email" name="email" data={fournisseurData} update={setFournisseurData} report={errors.email} />
                            <Input label="N° CC" name="siret" data={fournisseurData} update={setFournisseurData} report={errors.siret} />
                            <Input label="Adresse" name="adresse" data={fournisseurData} update={setFournisseurData} report={errors.adresse} />
                            <Input label="Ville" name="ville" data={fournisseurData} update={setFournisseurData} report={errors.ville} />
                            <Input label="Pays" name="pays" data={fournisseurData} update={setFournisseurData} report={errors.pays} />
                            <Input label="Échéance" name="echeance" data={fournisseurData} update={setFournisseurData} report={errors.echeance} />

                            {/* Nouveaux champs */}
                            <div className="form-group mb-3">
                                <label>Mode de paiement</label>
                                <select
                                    className="form-control"
                                    name="modePaiement"
                                    value={fournisseurData.modePaiement}
                                    onChange={(e) => setFournisseurData({ ...fournisseurData, modePaiement: e.target.value })}
                                >
                                    <option value="VIREMENT">Virement</option>
                                    <option value="CHEQUE">Chèque</option>
                                    <option value="ESPECE">Espèce</option>
                                    {/* Ajouter d'autres modes si nécessaires */}
                                </select>
                                {errors.modePaiement && <div className="text-danger">{errors.modePaiement}</div>}
                            </div>

                            <hr />

                            {/* Partie 2 : Coordonnées du fournisseur */}
                            <h5>Coordonnées du fournisseur</h5>

                            <Input label="IBAN" name="iban" data={fournisseurData} update={setFournisseurData} report={errors.iban} />
                            <Input label="BIC" name="bic" data={fournisseurData} update={setFournisseurData} report={errors.bic} />
                            <Input label="Email" type="email" name="contactEmail" data={fournisseurData} update={setFournisseurData} report={errors.contactEmail} />
                            <Input label="Fonction" name="contactFonction" data={fournisseurData} update={setFournisseurData} report={errors.contactFonction} />
                            <Input label="Prénoms" name="contactPrenoms" data={fournisseurData} update={setFournisseurData} report={errors.contactPrenoms} />
                            <Input label="Nom" name="contactNom" data={fournisseurData} update={setFournisseurData} report={errors.contactNom} />

                            <div className="form-group mb-3">
                                <label>Devise</label>
                                <select
                                    className="form-control"
                                    name="devise"
                                    value={fournisseurData.devise}
                                    onChange={(e) => setFournisseurData({ ...fournisseurData, devise: e.target.value })}
                                >
                                    <option value="XOF">Franc CFA</option>
                                    <option value="EUR">Euro</option>
                                    <option value="USD">Dollar</option>
                                    {/* Ajouter d'autres devises si nécessaires */}
                                </select>
                                {errors.devise && <div className="text-danger">{errors.devise}</div>}
                            </div>

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
            </div>
        </Layout>

    );
};

export default CreateTransitaire;
