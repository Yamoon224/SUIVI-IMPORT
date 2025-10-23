import * as React from "react";
import { useState, useEffect } from "react";
import Layout from "../../../template/Layout";
import Wrapper from "../../../component/Wrapper";
import { Autocomplete, TextField, Stack, CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import Input from "../../../component/Input";
import myRoute from "../../../hooks/myRoute";
import httpClient from "../../../hooks/httpClient";
import noNetWork, { problemOccur } from "../../../component/AlertReport";
import { useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";

interface ArticleType {
  id: number;
  codeFamille: string;
  libelle: string;
  code: string;
}

interface LigneType {
  article: string;
  quantite: number | "";
  prixUnitaire: number | "";
  uniteGestion: string;
  reference: string;
}

const CreateLigneCommande = () => {
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [articleChoisi, setArticleChoisi] = useState<ArticleType | null>(null);
  const [lignesCommande, setLignesCommande] = useState<any[]>([]);
  const [lignes, setLignes] = useState<LigneType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFournisseurs, setIsLoadingFournisseurs] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const { commandeId } = useParams();
  const [removingId, setRemovingId] = useState<number | null>(null);

  const [ligneData, setLigneData] = useState<LigneType>({
    article: "",
    quantite: "",
    prixUnitaire: "",
    uniteGestion: "",
    reference: "",
  });

  useEffect(() => {
    setIsLoading(true);
    httpClient.get(myRoute.listeArticle)
      .then(res => {
        const articlesFormates = (res.data || []).map((a: any) => ({
          id: a.id,
          codeFamille: a.codeFamille,
          libelle: a.designationArticle || a.libelleFamille || a.referenceArticle || 'Article sans nom',
        }));
        setArticles(articlesFormates);
      })
      .catch((err) => {
        if (err.response === undefined) noNetWork();
        else problemOccur();
      })
      .finally(() => setIsLoading(false));
  }, [refresh]);

  // ➕ Ajouter une ligne
  const ajouterLigne = () => {
    if (!articleChoisi) {
      Swal.fire("Erreur", "Veuillez sélectionner un article et un fournisseur", "error");
      return;
    }
    setLignes([
      ...lignes,
      {
        ...ligneData,
        article: articleChoisi.libelle,
      },
    ]);

    // reset
    setArticleChoisi(null);
    setLigneData({
      article: "",
      quantite: "",
      prixUnitaire: "",
      uniteGestion: "",
      reference: "",
    });
  };

  // 💾 Enregistrer commande
  const enregistrerCommande = () => {
    if (lignes.length === 0) {
      Swal.fire("Erreur", "Aucune ligne à enregistrer", "error");
      return;
    }
    setIsLoading(true);
    // Préparer les données à envoyer au backend
    const lignesPayload = lignes.map((ligne) => ({
      articleId: articles.find(a => a.libelle === ligne.article)?.id,
      designation: ligne.article,
      uniteGestion: ligne.uniteGestion,
      quantite: Number(ligne.quantite),
      prixUnitaire: Number(ligne.prixUnitaire),
      reference: ligne.reference,
    }));

    httpClient
      .post(myRoute.creerLigneCommande.replace("{commandeId}", String(commandeId)), lignesPayload)
      .then(() => {
        Swal.fire("Succès", "Les lignes ont été enregistrées avec succès !", "success");
        setLignes([]);
      })
      .catch((err) => {
        console.error("Erreur enregistrement ligne commande :", err);
        if (!err.response) {
          noNetWork();
        } else {
          problemOccur();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    httpClient.get(myRoute.listeLigneCommande.replace("{commandeId}", String(commandeId)))
      .then(res => {
        console.log(res.data);
        setLignesCommande(res.data);
      })
      .catch(err => {
        if (err.response === undefined) noNetWork();
        else problemOccur();
      })
      .finally(() => setIsLoading(false));
  }, [refresh]);

  const onRemove = (id: number) => {
    setRemovingId(id);
    setTimeout(() => {
      setLignesCommande((prev) => prev.filter((ligne) => ligne.id !== id));
      setRemovingId(null);
    }, 800); // petit délai visuel
  };

  const imprimerBonCommande = () => {
    window.print();
  };

  return (
       <Layout title="Gestion de la ligne de commande">
      <div className="row">
        <div className="col-md-5 col-lg-6">
          <Wrapper title="Nouvelle ligne de commande">
            {isLoading && <div className="text-center mb-3">Chargement des articles...</div>}

            {/* 🔸 Sélection article */}
            <Stack spacing={2} sx={{ width: 300, mb: 3 }}>
              <Autocomplete
                options={articles}
                getOptionLabel={(option) => `${option.codeFamille} - ${option.libelle}`}
                value={articleChoisi}
                onChange={(event, newValue) => setArticleChoisi(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sélectionner un article"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoading ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Stack>

            {/* 🔸 Formulaire ligne */}
            {articleChoisi && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input data={ligneData} update={setLigneData} name="uniteGestion" label="Unité de gestion" placeholder="Unité de gestion" type="text" required />
                <Input data={ligneData} update={setLigneData} name="quantite" label="Quantité" placeholder="Quantité" type="number" required />
                <Input data={ligneData} update={setLigneData} name="prixUnitaire" label="Prix unitaire" placeholder="Prix unitaire" type="number" required />
                <Input data={ligneData} update={setLigneData} name="reference" label="Référence" placeholder="Référence" type="text" />
              </div>
            )}

            {/* 🔸 Bouton ajouter ligne */}
            {articleChoisi && (
              <button className="btn btn-success mb-3" onClick={ajouterLigne}>
                Ajouter la ligne
              </button>
            )}

            {/* 🔸 Tableau des lignes ajoutées */}
            {lignes.length > 0 && (
              <div className="mb-4">
                <h5>Lignes ajoutées</h5>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Article</th>
                      <th>Quantité</th>
                      <th>Prix unitaire</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lignes.map((ligne, index) => (
                      <tr key={index}>
                        <td>{ligne.article}</td>
                        <td>{ligne.quantite}</td>
                        <td>{ligne.prixUnitaire}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 🔸 Enregistrer commande */}
            {lignes.length > 0 && (
              <button className="btn btn-primary" onClick={enregistrerCommande} disabled={isLoading}>
                Enregistrer la commande
              </button>
            )}
          </Wrapper>
        </div>

      
        <div className="col-md-5 col-lg-6">
          <Wrapper title="Les lignes de la commande">
            {/* 🔘 Bouton Imprimer */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="m-0">Détails des lignes</h5>
              <button
                className="btn btn-sm"
                style={{ backgroundColor: "#2298ff", color: "white", border: "none" }}
                onClick={() => imprimerBonCommande()}
              >
                🖨️ Imprimer Bon de commande
              </button>
            </div>
            {isLoading ? (
              <div className="text-center">
                <BeatLoader />
              </div>
            ) : lignesCommande.length === 0 ? (
              <p>Aucune ligne Commande associée à cette commande.</p>
            ) : (
              <table className="table table-bordered table-hover">
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Désignation</th>
                    <th scope="col">Quantité</th>
                    <th scope="col">Prix unitaire</th>
                    <th scope="col" className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lignesCommande.map((ligne) => (
                    <tr key={ligne.id}>
                      <td>{ligne.designation}</td>
                      <td>{ligne.quantite} {ligne.uniteGestion}</td>
                      <td>{ligne.prixUnitaire} FCFA</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-danger"
                          style={{ backgroundColor: "#ff5722", color: "white", border: "none" }}
                          disabled={removingId === ligne.id}
                          onClick={() => onRemove(ligne.id)}
                        >
                          {removingId === ligne.id ? "..." : "Supprimer"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Wrapper>
        </div>
      </div>
    </Layout>
  );
};

export default CreateLigneCommande;
