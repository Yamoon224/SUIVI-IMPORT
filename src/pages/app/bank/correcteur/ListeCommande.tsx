import { BeatLoader } from "react-spinners";
import Wrapper from "../../../component/Wrapper";
import Layout from "../../../template/Layout";
import Pagination from "../../../component/Pagination";
import autoTable from "jspdf-autotable";
import moment from "moment";
import jsPDF from "jspdf";
import Swal from "sweetalert2";
import noNetWork, { problemOccur, ToastOperation } from "../../../component/AlertReport";
import httpClient from "../../../hooks/httpClient";
import myRoute from "../../../hooks/myRoute";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const ListeCommande = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [commandes, setCommandes] = useState<any[]>([]);
    const [page, setPage] = useState('0');
    const [refresh, setRefresh] = useState(0);
    const [numeroCommandeFilter, setNumeroCommandeFilter] = useState('');

  useEffect(() => {
  setIsLoading(true);
  
  // Construire l’URL correctement
  const url = `${myRoute.listeCommandeAvecPagination}?page=${page}&size=5`;
  
  httpClient
    .get(url)
    .then((res) => {
      console.log("📦 Réponse API :", res.data);
      setCommandes(res.data.content);  // car ton backend renvoie un objet Page
    })
    .catch((err) => {
      if (!err.response) noNetWork();
      else problemOccur();
    })
    .finally(() => setIsLoading(false));
}, [refresh, page]);

    const onRemove = (id: number) => {
        ToastOperation.fire()
            .then(choice => {
                if (choice.isConfirmed) {
                    setIsLoading(true);
                    httpClient.post(myRoute.supprimerCommande.replace("{id}", id.toString()))
                        .then(() => {
                            setIsLoading(false);
                            Swal.fire({
                                title: 'Commande supprimée avec succès',
                                icon: 'success',
                                backdrop: false
                            });
                            setRefresh(refresh + 1);
                        })
                        .catch(err => {
                            setIsLoading(false);
                            if (err.response === undefined) noNetWork();
                            else problemOccur();
                        });
                }
            });
    };

    // Filtrage local
//    const filteredCommandes = (commandes?.commandes || []).filter((c: any) =>
//     numeroCommandeFilter === "" ||
//     (c.numeroCommande ?? "").toLowerCase().includes(numeroCommandeFilter.toLowerCase())
// );


    const filteredCommandes = commandes.filter((c: any) =>
        numeroCommandeFilter === "" ||
        (c.numeroCommande ?? "").toLowerCase().includes(numeroCommandeFilter.toLowerCase())
    );

    const exportCSV = () => {
        const ws = XLSX.utils.json_to_sheet(filteredCommandes);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Commandes");
        const csv = XLSX.write(wb, { bookType: "csv", type: "array" });
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "commandes.csv");
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Liste des commandes", 14, 10);
        autoTable(doc, {
            head: [["Numéro", "Date Proforma", "Incoterm", "Mode Envoi", "Client", "Statut"]],
            body: filteredCommandes.map((c: any) => [
                c.numeroCommande ?? "",
                c.dateProforma ? moment(c.dateProforma).format('DD/MM/YYYY') : "",
                c.incoterm ?? "",
                c.modeEnvoi ?? "",
                c.clientDestinataire ?? "",
                c.statut ?? ""
            ]),
            startY: 20,
        });
        doc.save("commandes.pdf");
    };

    return (
        <Layout title="Gestion des commandes">
            <Wrapper title="Liste des commandes">
                <form className="form-inline mb-3 align-items-center" onSubmit={e => e.preventDefault()}>
                    <div className="form-group flex items-center gap-2 w-full">
                        <input
                            type="text"
                            className="form-control flex-1 p-2 border rounded"
                            value={numeroCommandeFilter}
                            onChange={(e) => setNumeroCommandeFilter(e.target.value)}
                            placeholder="Rechercher par numéro de commande"
                        />
                        <button
                            type="button"
                            style={{ backgroundColor: "#ff5722", color: "white", border: "none" }}
                            className="btn px-4 py-2 rounded"
                            onClick={() => setRefresh(refresh + 1)}
                        >
                            Rechercher
                        </button>
                        <button
                            type="button"
                            className="btn ml-2"
                            style={{ backgroundColor: "#ff5722", color: "white", border: "none" }}
                            onClick={exportCSV}
                        >
                            Exporter Excel
                        </button>
                        <button
                            type="button"
                            className="btn ml-2"
                            style={{ backgroundColor: "#ff5722", color: "white", border: "none" }}
                            onClick={exportPDF}
                        >
                            Exporter PDF
                        </button>
                    </div>
                </form>
            </Wrapper>

            {isLoading &&
                <div className="text-center">
                    <BeatLoader />
                </div>
            }

            {!isLoading &&
                <div className="row">
                    <div className="col-12">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Numéro Commande</th>
                                        <th>Date Commande</th>
                                        <th>Devise</th>
                                        <th>Mode Envoi</th>
                                        <th>Client</th>
                                        <th>Statut</th>
                                        <th>Incoterm</th>
                                        <th>Numéero DAI</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCommandes.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="text-center">Aucune commande trouvée</td>
                                        </tr>
                                    ) : (
                                        filteredCommandes.map((commande: any) => (
                                            <tr key={commande.id}>
                                                <td>{commande.numeroCommande ?? ""}</td>
                                                <td>{commande.dateProforma ? moment(commande.dateProforma).format('DD/MM/YYYY') : ""}</td>
                                                <td>XOF </td>
                                                <td>{commande.modeEnvoi ?? ""}</td>
                                                <td>{commande.clientDestinataire ?? ""}</td>
                                                <td>{commande.statut ?? ""}</td>
                                                <td>{commande.incoterm ? commande.incoterm.signification : ""}</td>
                                               <td>{commande.numeroDai ?? ""}</td>
                                                <td className="text-right">
                                                    <Link to={`/suivi-import/creerLigneCommande/${commande.id}`}>
                                                        <button
                                                            className="btn-sm ml-1"
                                                            style={{ backgroundColor: "#ff5722", color: "white", border: "none" }}
                                                        >
                                                            Editer
                                                        </button>
                                                    </Link>
                                                    <Link to={`/suivi-import/creerLigneCommande/${commande.id}`}>
                                                        <button
                                                            className="btn-sm ml-1"
                                                            style={{ backgroundColor: "#06576cff", color: "white", border: "none" }}
                                                        >
                                                            Ajouter Lignes
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => onRemove(commande.id)}
                                                        className="btn-sm ml-1"
                                                        style={{ backgroundColor: "#ff5722", color: "white", border: "none" }}
                                                    >
                                                        Supprimer
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>

                            </table>
                        </div>
                        <Pagination update={setPage} paginator={commandes} />
                    </div>
                </div>
            }
        </Layout>
    );
};

export default ListeCommande