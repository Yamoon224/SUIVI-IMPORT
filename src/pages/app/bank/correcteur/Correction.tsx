import { useEffect, useState } from "react";
import Layout from "../../../template/Layout";
import { Link, Navigate, useParams } from "react-router-dom";
import myRoute from "../../../hooks/myRoute";
import httpClient, { fetchImgR, fetchImgV } from "../../../hooks/httpClient";
import noNetWork, { ToastNotFound, problemOccur } from "../../../component/AlertReport";
import { HttpStatusCode } from "axios";
import { BeatLoader } from "react-spinners";
import Wrapper from "../../../component/Wrapper";
import RemiseEtat from "../../../component/RemiseEtat";
import LoadImage from "../../../component/LoadImage";
import CheckEtat from "../../../component/CheckEtat";
import CorrectionRemise from "../../../component/CorrectionRemise";
import CorrectionCheque from "../../../component/CorrectionCheque";


const Correction = () => {

    const ETAPE: { remise: string, cheque: string } = { remise: 'remise', cheque: 'cheque' };
    const [etape, setEtape] = useState<string>(ETAPE.remise);

    const [isLoading, setIsLoading] = useState(true);
    const [remise, setRemise] = useState<any>({});
    const [cheques, setCheques] = useState([]);
    const { remiseId } = useParams();
    const [noFound, setNoFound] = useState(false);

    const onCheque = () => {
        setEtape(ETAPE?.cheque);
    }

    const onRemise = () => {
        setEtape(ETAPE?.remise);
    }

    useEffect(() => {
        httpClient.get(myRoute.infoRemiseCorrecteur.replace("{remiseId}", remiseId ?? ''))
            .then(res => {
                setIsLoading(false);
                setRemise(res.data.remise);
                setCheques(res.data.cheques);
                if (res.data.user.role.libelle != "Correcteur" || res.data.remise.etat != 3) {
                    setNoFound(true);
                }

            })
            .catch(err => {
                setIsLoading(false);
                if (err.response == undefined) {
                    noNetWork();
                } else {
                    if (err.response.status == HttpStatusCode.NotFound) {
                        ToastNotFound.fire();
                        setNoFound(true);
                    } else {
                        problemOccur();
                    }
                }
            })
    }, []);

    if (noFound) {
        return <Navigate to={"/banking/correcteur/remise/rejete"} />
    }

    return (
        <Layout title="Correction de la remise">
            {isLoading == true &&
                <div className="text-center">
                    <BeatLoader />
                </div>
            }
            {(isLoading == false && remise?.id != null) && <div className="row">
                <div className="col-12">
                    <Wrapper title={remise ? 'Reference de la remise: ' + remise?.reference : "Remise"}>
                        {/* remise */}
                        {
                            etape === ETAPE.remise && <CorrectionRemise updateChecks={setCheques} updateRemise={setRemise} remise={remise} onCheque={onCheque} />
                        }

                        {/* cheque */}
                        {
                            etape === ETAPE.cheque && <CorrectionCheque updateChecks={setCheques} updateRemise={setRemise} remise={remise} ETAPE={ETAPE} setEtape={setEtape} onRemise={onRemise} cheques={cheques} />
                        }

                        <div className="mt-1">
                            {/* <Link className="btn btn-primary mr-2" to={"#"} onClick={onRemise}>Precedent</Link> */}
                            {/* <Link className="btn btn-primary" to={"#"} onClick={onCheque}>Cheques {'>'}</Link> */}
                        </div>
                    </Wrapper>
                </div>
            </div>}
        </Layout>
    )
}
export default Correction;