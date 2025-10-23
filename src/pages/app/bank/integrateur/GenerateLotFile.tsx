import { useEffect, useState } from "react"
import Layout from "../../../template/Layout";
import { BeatLoader } from "react-spinners";
import Wrapper from "../../../component/Wrapper";
import httpClient from "../../../hooks/httpClient";
import myRoute from "../../../hooks/myRoute";
import noNetWork, { Toast } from "../../../component/AlertReport";

const GenerateLotFile = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [nb, setNb] = useState(0);
    const [user, setUser] = useState<any>({});
    useEffect(() => {
        httpClient.get(myRoute.nbRemiseLotGeneration)
        .then(res => {
            setNb(res.data.lot);
            setUser(res.data.user);
            setIsLoading(false);
        })
        .catch(err => {
            setIsLoading(false);
            setNb(-1);
            if (err.response == undefined) {
                noNetWork();
            }
            
        })
    }, [])


    const onGenerateLotRemise = () => {
        httpClient.post(myRoute.integrateRemiseValidation)
        .then(res => {
            setNb(0);
            Toast.fire();
        })
        .catch(err => {

        })
    }


    return(
       <Layout title="Generation de fichiers LOT">
            {isLoading == true && <div className="text-center">
                <BeatLoader />
            </div>
            }
            {(isLoading == false && nb != -1) && 
                <div>
                    <Wrapper title="Fichiers Lot">
                        <div className="text-center">
                        Bonjour {user.nom} {user.prenom}, vous avez <span className="font-weight-bold">{nb} remise(s)</span> à intégrer.
                        </div>
                        <div className="text-center mt-2">
                            <button type="button" onClick={() => onGenerateLotRemise()} className="btn btn-success">Generer le fichier lot</button>
                        </div>
                    </Wrapper>     
                </div>
                
            }
       </Layout>
    )
}

export default GenerateLotFile;