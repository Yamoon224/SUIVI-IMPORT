import React, { useEffect, useState } from "react";
import { HttpStatusCode } from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import httpClient, { writeErrors } from "../../../../hooks/httpClient";
import myRoute from "../../../../hooks/myRoute";
import noNetWork, { problemOccur } from "../../../../component/AlertReport";
import Layout from "../../../../template/Layout";
import Wrapper from "../../../../component/Wrapper";
import Input from "../../../../component/Input";
import { BeatLoader } from "react-spinners";
import AutoComplete from "../../../../component/AutoComplete";
import AsyncSelect from "react-select/async";

const EnregistrerArticle = () => {

  const [articleData, setArticleData] = useState({
    codeFamille: "",
    libelleFamille: "",
    referenceArticle: "",
    designationArticle: "",
    suiviStock: "",
    fournisseurPrincipal: "",
    departement: "",
    familleCentrale: "",
    uniteVente: "",

  });

  const [errors, setErrors] = useState({
    codeFamille: undefined,
    libelleFamille: undefined,
    referenceArticle: undefined,
    designationArticle: undefined,
    suiviStock: undefined,
    fournisseurPrincipal: undefined,
    departement: undefined,
    familleCentrale: undefined,
    uniteVente: undefined,
  });

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fournisseurs, setFournisseurs] = useState<any[]>([]);
  const [departementOptions, setDepartementOptions] = useState<string[]>([]);
  const [familleCentraleOptions, setFamilleCentraleOptions] = useState<string[]>([]);
  const [uniteVenteOptions, setUniteVenteOptions] = useState<string[]>([]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   httpClient.get(myRoute.listeFournisseur)
  //     .then((res) => {
  //       setFournisseurs(res?.data || []);
  //       setIsLoading(false);
  //     })
  //     .catch((err) => {
  //       if (!err.response) {
  //         noNetWork();
  //       } else {
  //         problemOccur();
  //       }
  //     });
  // }, []);

  const loadFournisseurs = (inputValue: string, callback: any) => {
    httpClient
      .get(myRoute.listeFournisseur)
      .then((res) => {
        const fournisseurs = (res?.data || [])
          .filter((f: any) =>
            f.intituleFournisseur.toLowerCase().includes(inputValue.toLowerCase())
          )
          .map((f: any) => ({
            label: `${f.intituleFournisseur} (${f.codeFournisseur})`,
            value: f.intituleFournisseur, // 🔹 On garde le nom (String) pour le backend
          }));
        callback(fournisseurs);
      })
      .catch(() => callback([]));
  };

  const handleFournisseurChange = (selectedCode: string) => {
    const fournisseur = fournisseurs.find(f => f.codeFournisseur === selectedCode);
    setArticleData(prev => ({
      ...prev,
      fournisseurPrincipal: fournisseur ? fournisseur.intituleFournisseur : "",
    }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setArticleData((prev: any) => ({
      ...prev,
      [name]: value?.value || "",
    }));
  };

  const loadDepartements = (inputValue: string, callback: any) => {
    httpClient
      .get(myRoute.listeDepartement)
      .then((res) => {
        const departements = (res?.data || [])
          .filter((d: string) =>
            d.toLowerCase().includes(inputValue.toLowerCase())
          )
          .map((d: string) => ({ label: d, value: d }));
        callback(departements);
      })
      .catch(() => callback([]));
  };

  const loadFamilles = (inputValue: string, callback: any) => {
    httpClient
      .get(myRoute.listeFamille)
      .then((res) => {
        const familles = (res?.data || [])
          .filter((f: string) =>
            f.toLowerCase().includes(inputValue.toLowerCase())
          )
          .map((f: string) => ({ label: f, value: f }));
        callback(familles);
      })
      .catch(() => callback([]));
  };

  const loadUnites = (inputValue: string, callback: any) => {
    httpClient
      .get(myRoute.listeUnite)
      .then((res) => {
        const unites = (res?.data || [])
          .filter((u: string) =>
            u.toLowerCase().includes(inputValue.toLowerCase())
          )
          .map((u: string) => ({ label: u, value: u }));
        callback(unites);
      })
      .catch(() => callback([]));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    setErrors({
      codeFamille: undefined,
      libelleFamille: undefined,
      referenceArticle: undefined,
      designationArticle: undefined,
      suiviStock: undefined,
      fournisseurPrincipal: undefined,
      departement: undefined,
      familleCentrale: undefined,
      uniteVente: undefined,
    });

    httpClient
      .post(myRoute.creerArticle, articleData)
      .then(() => {
        setErrors({
          codeFamille: undefined,
          libelleFamille: undefined,
          referenceArticle: undefined,
          designationArticle: undefined,
          suiviStock: undefined,
          fournisseurPrincipal: undefined,
          departement: undefined,
          familleCentrale: undefined,
          uniteVente: undefined,
        });
        setArticleData({
          codeFamille: "",
          libelleFamille: "",
          referenceArticle: "",
          designationArticle: "",
          suiviStock: "",
          fournisseurPrincipal: "",
          departement: "",
          familleCentrale: "",
          uniteVente: "",
        });
        setIsSubmitLoading(false);
        Swal.fire({
          title: "Création Article",
          text: "L'article a été créé avec succès.",
          icon: "success",
          backdrop: false,
        });
      })
      .catch((err) => {
        setIsSubmitLoading(false);
        if (!err.response) {
          noNetWork();
        } else if (err.response.status === HttpStatusCode.BadRequest) {
          const errs = writeErrors({ ...errors }, err.response.data);
          setErrors(errs);
        } else {
          problemOccur();
        }
      });
  };


  return (
    <Layout title="Enregistrer un article">
      <div className="row">
        <div className="col-md-10 col-lg-8">
          <Wrapper title="Nouvel article">
            <div className="text-right mb-3">
              <Link className="btn btn-link" to="/suivi-import/liste-article">
                Liste des articles
              </Link>
            </div>
            <form onSubmit={onSubmit}>
              <Input
                label="Code Famille"
                name="codeFamille"
                data={articleData}
                update={setArticleData}
                report={errors.codeFamille}
                required
              />
              <Input
                label="Libellé Famille"
                name="libelleFamille"
                data={articleData}
                update={setArticleData}
                report={errors.libelleFamille}
                required
              />
              <Input
                label="Référence Article"
                name="referenceArticle"
                data={articleData}
                update={setArticleData}
                report={errors.referenceArticle}
                required
              />
              <Input
                label="Désignation"
                name="designationArticle"
                data={articleData}
                update={setArticleData}
                report={errors.designationArticle}
                required
              />
              <Input
                label="Suivi Stock"
                name="suiviStock"
                data={articleData}
                update={setArticleData}
                report={errors.suiviStock}
                required
              />
              <div className="mt-3">
                <label>Fournisseur Principal *</label>
                <AsyncSelect
                  cacheOptions
                  loadOptions={loadFournisseurs}
                  defaultOptions
                  onChange={(value) => handleSelectChange("fournisseurPrincipal", value)}
                  isDisabled={isSubmitLoading}
                  placeholder="Rechercher un fournisseur..."
                />
              </div>

              {/* <AutoComplete
                label="Choisir le fournisseur principal *"
                name="fournisseurPrincipal"
                value={articleData.fournisseurPrincipal}
                onChange={handleFournisseurChange}
                options={fournisseurs}
                displayField={(f) => `${f.codeFournisseur} - ${f.intituleFournisseur}`}
                valueField="codeFournisseur"
                placeholder="Rechercher un fournisseur..."
                report={errors.fournisseurPrincipal}
                disabled={isSubmitLoading}
                required
              /> */}
              <div className="mt-3">
                <label>Département *</label>
                <AsyncSelect
                  cacheOptions
                  loadOptions={loadDepartements}
                  defaultOptions
                  onChange={(value) => handleSelectChange("departement", value)}
                  isDisabled={isSubmitLoading}
                  placeholder="Sélectionner un département..."
                />
              </div>

              <div className="mt-3">
                <label>Famille Centrale *</label>
                <AsyncSelect
                  cacheOptions
                  loadOptions={loadFamilles}
                  defaultOptions
                  onChange={(value) => handleSelectChange("familleCentrale", value)}
                  isDisabled={isSubmitLoading}
                  placeholder="Sélectionner une famille centrale..."
                />
              </div>

              <div className="mt-3">
                <label>Unité de Vente *</label>
                <AsyncSelect
                  cacheOptions
                  loadOptions={loadUnites}
                  defaultOptions
                  onChange={(value) => handleSelectChange("uniteVente", value)}
                  isDisabled={isSubmitLoading}
                  placeholder="Sélectionner une unité de vente..."
                />
              </div>
              <div className="mt-3">
                {isSubmitLoading && (
                  <div className="text-center mb-2">
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
      </div>
    </Layout>
  );
};

export default EnregistrerArticle;
