import { useNavigate, useParams } from "react-router-dom";
import Pagination from "../../../../component/Pagination";
import { useEffect, useState } from "react";
import httpClient from "../../../../hooks/httpClient";
import myRoute from "../../../../hooks/myRoute";
import noNetWork, { problemOccur } from "../../../../component/AlertReport";
import Swal from "sweetalert2";
import Layout from "../../../../template/Layout";
import { BeatLoader } from "react-spinners";
import Wrapper from "../../../../component/Wrapper";

interface Fournisseur {
  id: number;
  codeFournisseur?: string;
  intituleFournisseur?: string;
}

interface PaginatedFournisseur {
  content: Fournisseur[];
  totalPages: number;
  [key: string]: any;
}

interface FournisseurCentraleDto {
  fournisseurIds: number[];
}

const FournisseurCentrale = () => {
  const { fournisseurId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [fournisseurs, setFournisseurs] = useState<PaginatedFournisseur>({ content: [], totalPages: 0 });
  const [page, setPage] = useState<string>('0');
  const [selectedFournisseurIds, setSelectedFournisseurIds] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [codeFournisseurFilter, setCodeFournisseurFilter] = useState('');

     const filteredFournisseurs = (fournisseurs?.content || []).filter((f: any) =>
        codeFournisseurFilter === "" ||
        (f.codeFournisseur ?? "").toLowerCase().includes(codeFournisseurFilter.toLowerCase())
    );
  
  const rechercheFournisseur = () => {
    setIsLoading(true);
    const url = myRoute.rechercheFournisseur.replace("{codeFournisseur}", codeFournisseurFilter);

    fetch(url, { method: 'GET' })
      .then(async (response) => {
        setIsLoading(false);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Fournisseur non trouvé');
        }
        return response.json();
      })
      .then(data => {
        setFournisseurs(data);
        Swal.fire({
          title: 'Fournisseur trouvé',
          icon: 'success',
          backdrop: false
        });
      })
      .catch(error => {
        Swal.fire({
          title: 'Erreur',
          text: error.message,
          icon: 'error',
          backdrop: false
        });
      });
  };

  useEffect(() => {
    setIsLoading(true);
    httpClient
      .get<PaginatedFournisseur>(myRoute.listeFournisseurAvecPagination.replace("{page}", page))
      .then(res => {
        setFournisseurs(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        if (err.response === undefined) {
          noNetWork();
        } else {
          problemOccur();
        }
      });
  }, [page]);

   const handleCheckboxChange = (fournisseurId: number) => {
    setSelectedFournisseurIds(prevSelected => {
      if (prevSelected.includes(fournisseurId)) {
        return prevSelected.filter(id => id !== fournisseurId);
      } else {
        return [...prevSelected, fournisseurId];
      }
    });
  };

  const selectAll = () => {
    const allIds = fournisseurs.content.map(f => f.id);
    setSelectedFournisseurIds(allIds);
  };

  const deselectAll = () => setSelectedFournisseurIds([]);
  const handleSubmit = async () => {
    if (!fournisseurId) {
      problemOccur();
      return;
    }

    if (selectedFournisseurIds.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Attention",
        text: "Veuillez sélectionner au moins un fournisseur.",
        backdrop: false,
      });
      return;
    }

    setSubmitting(true);
    try {
      await httpClient.post<FournisseurCentraleDto>(
        myRoute.fournisseurDefournisseurCentrale.replace("{centraleId}", String(fournisseurId)),
        { fournisseursIds: selectedFournisseurIds }
      );
      Swal.fire({
        icon: "success",
        title: "Succès",
        text: "Fournisseurs associés à la centrale avec succès !",
        backdrop: false,
      }).then(() => {
        navigate("/suivi-import/liste-fournisseurs");
      });
    } catch (error: any) {
      if (error.response?.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Requête invalide",
          text: "Vérifiez les données envoyées.",
          backdrop: false,
        });
      } else {
        problemOccur();
        console.error("Erreur lors de l'association des fournisseurs:", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title={`Associer des Fournisseurs à la Centrale ${fournisseurId}`}>
      {isLoading && (
        <div className="text-center">
          <BeatLoader />
        </div>
      )}

      {!isLoading && (
        <>
          <div className="row">
            <div className="col-md-7 col-lg-6">
              <Wrapper title="Sélection des Fournisseurs">
                <form className="form-inline mb-3 align-items-center" onSubmit={e => e.preventDefault()}>

                  <div className="form-group flex items-center gap-2">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      rechercheFournisseur();
                    }}
                    className="flex items-center gap-2 w-full"
                  >
                    <input
                      type="text"
                      className="form-control flex-1 p-2 border rounded"
                      value={codeFournisseurFilter}
                      onChange={(e) => setCodeFournisseurFilter(e.target.value)}
                      placeholder="Saisir code Fournisseur"
                    />
                    <button
                      type="submit"
                      className="btn btn-primary px-4 py-2 rounded"
                    >
                      Rechercher
                    </button>
                  </form>
                </div>
                  <button type="button" className="btn ml-2"
                    style={{ backgroundColor: "#ff5722", color: "white", border: "none" }}
                    onClick={selectAll}>
                    Tout sélectionner
                  </button>
                  <button type="button" className="btn ml-2"
                    style={{ backgroundColor: "#ff5722", color: "white", border: "none" }}
                    onClick={deselectAll}>
                    Tout désélectionner
                  </button>
                </form>

                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Sélectionner</th>
                        <th>Code Fournisseur</th>
                        <th>Intitulé</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fournisseurs.content.length > 0 ? (
                        filteredFournisseurs.map((fournisseur: Fournisseur) => (
                          <tr key={fournisseur.id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedFournisseurIds.includes(fournisseur.id)}
                                onChange={() => handleCheckboxChange(fournisseur.id)}
                              />
                            </td>
                            <td>{fournisseur.codeFournisseur ?? ''}</td>
                            <td>{fournisseur.intituleFournisseur ?? ''}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="text-center">
                            Aucun fournisseur trouvé
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <Pagination update={setPage} paginator={fournisseurs} />
              </Wrapper>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary mt-3"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Enregistrement..." : "Enregistrer"}
          </button>
        </>
      )}
    </Layout>
  );
};
export default FournisseurCentrale;