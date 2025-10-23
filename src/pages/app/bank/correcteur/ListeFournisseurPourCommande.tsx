import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import moment from 'moment';
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import httpClient from "../../../hooks/httpClient";
import myRoute from "../../../hooks/myRoute";
import noNetWork, { problemOccur } from "../../../component/AlertReport";
import Layout from "../../../template/Layout";
import Wrapper from "../../../component/Wrapper";
import Pagination from "../../../component/Pagination";


const ListeFournisseurPourCommande = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [fournisseurs, setFournisseurs] = useState<any>({});
    const [page, setPage] = useState('0');
    const [refresh, setRefresh] = useState(0);
    const [codeFournisseurFilter, setCodeFournisseurFilter] = useState('');
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        setIsLoading(true);
        httpClient.get(myRoute.listeFournisseurAvecPagination.replace('{page}', page))
            .then(res => {
                setFournisseurs(res.data);
                setIsLoading(false);
            }).catch(err => {
                setIsLoading(false);
                if (err.response === undefined) {
                    noNetWork();
                } else {
                    problemOccur();
                }
            });
    }, [refresh, page]);

    const filteredFournisseurs = (fournisseurs?.content || []).filter((f: any) =>
        codeFournisseurFilter === "" ||
        (f.codeFournisseur ?? "").toLowerCase().includes(codeFournisseurFilter.toLowerCase()) ||
        (f.intituleFournisseur ?? "").toLowerCase().includes(codeFournisseurFilter.toLowerCase())
    );

    const rechercheFournisseur = () => {
        if (!codeFournisseurFilter.trim()) {
            Swal.fire({
                title: 'Attention',
                text: 'Veuillez saisir un code ou un intitulé de fournisseur à rechercher.',
                icon: 'warning',
                backdrop: false
            });
            return;
        }

        setIsLoading(true);
        const url = myRoute.rechercheFournisseur.replace("{valeur}", encodeURIComponent(codeFournisseurFilter));

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
                setFournisseurs([data]);

                Swal.fire({
                    title: 'Fournisseur trouvé',
                    text: `Résultat : ${data.intituleFournisseur}`,
                    icon: 'success',
                    backdrop: false
                });
            })
            .catch(error => {
                setIsLoading(false);
                Swal.fire({
                    title: 'Erreur',
                    text: error.message,
                    icon: 'error',
                    backdrop: false
                });
            });
    };


    // Export CSV
    const exportCSV = () => {
        const ws = XLSX.utils.json_to_sheet(filteredFournisseurs);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Fournisseurs");
        const csv = XLSX.write(wb, { bookType: "csv", type: "array" });
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "fournisseurs.csv");
    };

    // Export PDF
    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Liste des fournisseurs", 14, 10);
        autoTable(doc, {
            head: [[
                "Code Fournisseur", "Intitulé", "Date Création", "Nom Contact", "Téléphone",
                "Fax", "Email", "SIRET", "Adresse", "Ville", "Pays"
            ]],
            body: filteredFournisseurs.map((f: any) => [
                f.codeFournisseur ?? "",
                f.intituleFournisseur ?? "",
                f.dateCreation ? moment(f.dateCreation).format('DD/MM/YYYY') : "",
                f.nomContact ?? "",
                f.telephone ?? "",
                f.telecopie ?? "",
                f.email ?? "",
                f.siret ?? "",
                f.adresse ?? "",
                f.ville ?? "",
                f.pays ?? ""
            ]),
            startY: 20,
        });
        doc.save("fournisseurs.pdf");
    };

    return (
        <Layout title="Gestions des fournisseurs">
            <Wrapper title="La liste des fournisseurs">
                <form className="form-inline mb-3 align-items-center" onSubmit={e => e.preventDefault()}>
                    <div className="form-group flex items-center gap-2 w-full">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                rechercheFournisseur();
                            }}
                            className="flex items-center gap-2 flex-1"
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
                                style={{ backgroundColor: "#ff5722", color: "white", border: "none" }}
                                className="btn btn-primary px-4 py-2 rounded"
                            >
                                Rechercher
                            </button>
                        </form>
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
                                        <th>Code</th>
                                        <th>Intitulé</th>
                                        <th>Téléphone</th>
                                        <th>Email</th>
                                        <th>N° CC</th>
                                        <th>Ville</th>
                                        <th>Pays</th>
                                        <th>Type</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredFournisseurs.map((fournisseur: any) => (
                                        <tr key={fournisseur.id}>
                                            <td>{fournisseur.codeFournisseur ?? ""}</td>
                                            <td>{fournisseur.intituleFournisseur ?? ""}</td>
                                            <td>{fournisseur.telephone ?? ""}</td>
                                            <td>{fournisseur.email ?? ""}</td>
                                            <td>{fournisseur.siret ?? ""}</td>
                                            <td>{fournisseur.ville ?? ""}</td>
                                            <td>{fournisseur.pays ?? ""}</td>
                                            <td>{fournisseur.type ?? ""}</td>
                                            <td className="text-right">
                                                <Link to={"/suivi-import/creerCommande/" + fournisseur.id }>
                                                    <button type="button"
                                                        className="btn-sm ml-1"
                                                        style={{ backgroundColor: "#06576cff", color: "white", border: "none" }}
                                                        title="Enregistrer commande">
                                                        Ajouter commande
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredFournisseurs.length === 0 && (
                                        <tr>
                                            <td colSpan={12} className="text-center">Aucun fournisseur trouvé</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination update={setPage} paginator={fournisseurs} />
                    </div>
                </div>
            }
        </Layout>
    );
}
export default ListeFournisseurPourCommande;