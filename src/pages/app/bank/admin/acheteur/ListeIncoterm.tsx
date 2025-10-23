import { FormEvent, useEffect, useState } from "react";
import myRoute from "../../../../hooks/myRoute";
import httpClient, { writeErrors } from "../../../../hooks/httpClient";
import noNetWork, {
  problemOccur,
  Toast,
  ToastNotFound,
  ToastOperation,
} from "../../../../component/AlertReport";
import { HttpStatusCode } from "axios";
import Layout from "../../../../template/Layout";
import { BeatLoader } from "react-spinners";
import Wrapper from "../../../../component/Wrapper";
import { Link } from "react-router-dom";
import Input from "../../../../component/Input";
import Pagination from "../../../../component/Pagination";

const ListeIncoterm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAddLoading, setIsAddLoading] = useState(false);
  const [incoterms, setIncoterms] = useState<any>({});
  const [page, setPage] = useState("0");
  const [idIncoterm, setIdIncoterm] = useState(0);
  const [incotermAdd, setIncotermAdd] = useState({
    incoterm: "",
    signification: "",
    modeTransport: "",
    responsableVendeur: "",
  });
  const [errors, setErrors] = useState({
    incoterm: undefined,
    signification: undefined,
    modeTransport: undefined,
    responsableVendeur: undefined,
  });
  const [refresh, setRefresh] = useState(0);
  const [menu] = useState({
    list: 0,
    add: 1,
    edit: 2,
  });
  const [choice, setChoice] = useState(menu.list);
  const [title, setTitle] = useState("");

  // Charger la liste des incoterms
  useEffect(() => {
    setIsLoading(true);
    httpClient
      .get(myRoute.listeIncoterm.replace("{page}", page))
      .then((res) => {
        setIncoterms(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        if (!err.response) noNetWork();
        else problemOccur();
      });
  }, [refresh, page]);

  // Changement de mode (ajout, édition, liste)
  const onChoice = (target: number) => {
    if (target === menu.add) {
      setIncotermAdd({
        incoterm: "",
        signification: "",
        modeTransport: "",
        responsableVendeur: "",
      });
      setTitle("Ajout d’un Incoterm");
      setIdIncoterm(0);
      setErrors(writeErrors({ ...errors }, {}));
    }
    setChoice(target);
  };

  // Charger les données dans le formulaire pour modification
  const onEdit = (data: any) => {
    setIncotermAdd({
      incoterm: data.incoterm,
      signification: data.signification,
      modeTransport: data.modeTransport,
      responsableVendeur: data.responsableVendeur,
    });
    setErrors(writeErrors({ ...errors }, {}));
    setIdIncoterm(data.id);
    setTitle("Édition d’un Incoterm");
    setChoice(menu.edit);
  };

  // Enregistrer ou modifier un incoterm
  const onAddOrEdit = (e: FormEvent) => {
    e.preventDefault();
    setIsAddLoading(true);
    setErrors(writeErrors({ ...errors }, {}));

    const route =
      choice === menu.add
        ? myRoute.addIncoterm
        : myRoute.editIncoterm.replace("{id}", idIncoterm.toString());

    httpClient
      .post(route, incotermAdd, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        setIsAddLoading(false);
        Toast.fire();

        if (choice === menu.add) {
          setIncotermAdd({
            incoterm: "",
            signification: "",
            modeTransport: "",
            responsableVendeur: "",
          });
        }

        setRefresh((r) => r + 1);
      })
      .catch((err) => {
        setIsAddLoading(false);
        if (!err.response) noNetWork();
        else if (err.response.status === HttpStatusCode.BadRequest)
          setErrors(writeErrors({ ...errors }, err.response.data));
        else if (err.response.status === HttpStatusCode.NotFound)
          ToastNotFound.fire();
        else problemOccur();
      });
  };

  // Suppression d’un incoterm
  const onRemove = (id: number) => {
    ToastOperation.fire().then((res) => {
      if (res.isConfirmed) {
        setIsLoading(true);
        httpClient
          .post(myRoute.removeIncoterm.replace("{id}", id.toString()))
          .then(() => {
            Toast.fire();
            setRefresh((prev) => prev + 1);
          })
          .catch((err) => {
            setIsLoading(false);
            if (!err.response) noNetWork();
            else problemOccur();
          });
      }
    });
  };

  return (
    <Layout title="Gestion des Incoterms">
      {isLoading && (
        <div className="text-center">
          <BeatLoader />
        </div>
      )}
      {!isLoading && (
        <div className="row">
          {(menu.add === choice || menu.edit === choice) && (
            <div className="col-md-8 col-lg-5">
              <Wrapper title={title}>
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => onChoice(menu.list)}
                    className="btn btn-link"
                  >
                    Retour à la liste
                  </button>
                </div>
                <form onSubmit={onAddOrEdit}>
                  <Input
                    label="Code Incoterm"
                    report={errors.incoterm}
                    name="incoterm"
                    data={incotermAdd}
                    update={setIncotermAdd}
                    required
                  />
                  <Input
                    label="Signification"
                    report={errors.signification}
                    name="signification"
                    data={incotermAdd}
                    update={setIncotermAdd}
                    required
                  />
                  <div className="mt-3">
                    <label>Mode de Transport *</label>
                    <select
                      className="form-control"
                      name="modeTransport"
                      value={incotermAdd.modeTransport}
                      onChange={(e) =>
                        setIncotermAdd({ ...incotermAdd, modeTransport: e.target.value })
                      }
                      disabled={isAddLoading}
                      required
                    >
                      <option value="">-- Sélectionner un mode de transport --</option>
                      <option value="MARITIME">Maritime</option>
                      <option value="AERIEN">Aérien</option>
                      <option value="ROUTIER">Routier</option>
                      <option value="EXPRESS">Express</option>
                      <option value="TOUS">Tous</option>
                    </select>
                    {errors.modeTransport && (
                      <div className="text-danger small">{errors.modeTransport}</div>
                    )}
                  </div>

                  <Input
                    label="Responsabilité du vendeur"
                    report={errors.responsableVendeur}
                    name="responsableVendeur"
                    data={incotermAdd}
                    update={setIncotermAdd}
                    required
                  />

                  <div className="mt-3 text-center">
                    {isAddLoading && <BeatLoader />}
                    <button type="submit" className="btn btn-primary mt-2">
                      Enregistrer
                    </button>
                  </div>
                </form>
              </Wrapper>
            </div>
          )}

          {menu.list === choice && (
            <div className="col-9">
              <Wrapper title="Liste des Incoterms">
                <div className="text-right mb-2">
                  <button
                    type="button"
                    onClick={() => onChoice(menu.add)}
                    className="btn btn-primary"
                  >
                    Ajouter un Incoterm
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Incoterm</th>
                        <th>Signification</th>
                        <th>Mode de transport</th>
                        <th>Responsabilité vendeur</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incoterms?.content?.map((incoterm: any) => (
                        <tr key={incoterm.id}>
                          <td>{incoterm.intercoterm}</td>
                          <td>{incoterm.signification}</td>
                          <td>{incoterm.modeTransport}</td>
                          <td>{incoterm.responsableVendeur}</td>
                          <td className="text-right">
                            <Link
                              to="#"
                              onClick={() => onEdit(incoterm)}
                              className="text-success mx-2"
                            >
                              <i className="fa fa-edit"></i>
                            </Link>
                            <Link
                              to="#"
                              onClick={() => onRemove(incoterm.id)}
                              className="text-danger"
                            >
                              <i className="fa fa-trash"></i>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination update={setPage} paginator={incoterms} />
              </Wrapper>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default ListeIncoterm;
