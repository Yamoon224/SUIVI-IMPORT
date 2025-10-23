import { useEffect, useState } from "react";
import httpClient from "../../../../hooks/httpClient";
import myRoute from "../../../../hooks/myRoute";
import noNetWork, { problemOccur, ToastOperation } from "../../../../component/AlertReport";
import Swal from "sweetalert2";
import Layout from "../../../../template/Layout";
import { BeatLoader } from "react-spinners";
import Wrapper from "../../../../component/Wrapper";
import Pagination from "../../../../component/Pagination";
import { Link } from "react-router-dom";
import Input from "../../../../component/Input";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

const ListeArticle = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<any>({});
  const [page, setPage] = useState('0');
  const [refresh, setRefresh] = useState(0);
  const [codeArticleFilter, setCodeArticleFilter] = useState('');

  useEffect(() => {
    setIsLoading(true);
    httpClient.get(myRoute.listeArticleAvecPagination.replace('{page}', page))
      .then(res => {
        console.log(res?.data);
        setArticles(res?.data);
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
  }, [refresh, page]);

  const onRemove = (id: number) => {
    ToastOperation.fire().then(choice => {
      if (choice.isConfirmed) {
        setIsLoading(true);
        httpClient.post(myRoute.supprimerArticle.replace("{id}", id.toString()))
          .then(() => {
            setIsLoading(false);
            Swal.fire({
              title: 'L\'article a été supprimé avec succès',
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

  const filteredArticles = (articles?.content || []).filter((f: any) =>
    codeArticleFilter === "" ||
    (f.codeFamille ?? "").toLowerCase().includes(codeArticleFilter.toLowerCase()) ||
    (f.libelleFamille ?? "").toLowerCase().includes(codeArticleFilter.toLowerCase())
  );

  const rechercheArticle = () => {
    setIsLoading(true);
    const url = `${myRoute.rechercheArticle}?valeur=${encodeURIComponent(codeArticleFilter)}`;
    fetch(url, { method: 'GET' })
      .then(async (response) => {
        setIsLoading(false);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Article non trouvé');
        }
        return response.json();
      })
      .then((data) => {
        setArticles(data); // ou data.content si c’est paginé
        Swal.fire({
          title: 'Article trouvé',
          icon: 'success',
          backdrop: false,
        });
      })
      .catch((error) => {
        Swal.fire({
          title: 'Erreur',
          text: error.message,
          icon: 'error',
          backdrop: false,
        });
      });
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(articles?.content || []);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Articles");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "articles.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Liste des articles", 14, 10);
    autoTable(doc, {
      head: [[
        "ID", "Code Famille", "Libellé Famille", "Référence Article",
        "Référence Fournisseur", "Désignation", "Suivi Stock", "Fournisseur Principal"
      ]],
      body: (articles?.content || []).map((article: any) => [
        article.id ?? "",
        article.codeFamille ?? "",
        article.libelleFamille ?? "",
        article.referenceArticle ?? "",
        article.afRefFourniss ?? "",
        article.designationArticle ?? "",
        article.suiviStock ?? "",
        article.fournisseurPrincipal ?? ""
      ]),
      startY: 20,
    });
    doc.save("articles.pdf");
  };

  return (
    <Layout title="Liste des articles">
      <Wrapper title="Recherche un article">
        <form onSubmit={e => e.preventDefault()} className="form-inline mb-3 align-items-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              rechercheArticle();
            }}
            className="flex items-center gap-2 flex-1"
          >
            <input
              type="text"
              className="form-control flex-1 p-2 border rounded"
              value={codeArticleFilter}
              onChange={(e) => setCodeArticleFilter(e.target.value)}
              placeholder="Saisir code article"
            />
            <button
              type="submit"
              style={{ backgroundColor: "#ff5722", color: "white", border: "none" }}
              className="btn btn-primary px-4 py-2 rounded"
            >
              Rechercher
            </button>
          </form>
          <button type="button"
            className="btn ml-2"
            style={{ backgroundColor: "#ff5722", color: "white", border: "none" }}
            onClick={exportExcel}>
            Exporter Excel
          </button>
          <button type="button"
            className="btn ml-2"
            style={{ backgroundColor: "#ff5722", color: "white", border: "none" }}
            onClick={exportPDF}>
            Exporter PDF
          </button>
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
            <Wrapper title="Les articles">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Code Famille</th>
                      <th>Libellé Famille</th>
                      <th>Référence</th>
                      <th>Code Fournisseur</th>
                      <th>Désignation</th>
                      <th>Stock</th>
                      <th>Fournisseur</th>
                      <th>familleCentrale</th>
                      <th>departement</th>
                      <th>uniteVente</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredArticles?.map((article: any) => (
                      <tr key={article.id}>
                        <td>{article.codeFamille ?? ""}</td>
                        <td>{article.libelleFamille ?? ""}</td>
                        <td>{article.referenceArticle ?? ""}</td>
                        <td>
                    {article.codeFournisseur ?? ""}
                  </td>
                        <td>{article.designationArticle ?? ""}</td>
                        <td>{article.suiviStock ?? ""}</td>
                        <td>{article.intituleFournisseur ?? ""}</td>
                        <td>{article.familleCentrale ?? ""}</td>
                        <td>{article.departement ?? ""}</td>
                         <td>{article.uniteVente ?? ""}</td>
                        <td className="text-right">
                          <Link to={`/suivi-import/article/${article.id}/selection-fournisseurs`}>
                            <button type="button"
                              className="btn-sm ml-2"
                              style={{ backgroundColor: "#ff5722", color: "white", border: "none" }}
                              title="Sélection Fournisseurs">
                              Fournisseurs
                            </button>
                          </Link>
                          <Link to={`/suivi-import/article/info/${article.id}`}>
                            <button type="button"
                              className="btn-sm ml-2"
                              style={{ backgroundColor: "#ff5722", color: "white", border: "none" }}
                              title="Voir Détails">
                              Détails
                            </button>
                          </Link>
                          <button onClick={() => onRemove(article.id)}
                            className="btn-sm ml-2"
                            style={{ backgroundColor: "#ff5722", color: "white", border: "none" }}
                            title="Supprimer">
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                    {articles?.content?.length === 0 && (
                      <tr>
                        <td colSpan={9} className="text-center">Aucun article trouvé</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination update={setPage} paginator={articles} />
            </Wrapper>
          </div>
        </div>
      }
    </Layout>
  );
}
export default ListeArticle;