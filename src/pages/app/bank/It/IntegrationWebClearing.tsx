import { FormEvent, useEffect, useState } from "react";
import Layout from "../../../template/Layout";
import { BeatLoader } from "react-spinners";
import Wrapper from "../../../component/Wrapper";
import Input from "../../../component/Input";
import httpClient, { encodeData } from "../../../hooks/httpClient";
import myRoute from "../../../hooks/myRoute";
import noNetWork, { Toast, problemOccur } from "../../../component/AlertReport";
import { HttpStatusCode } from "axios";


const IntegrationWebClearing = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({
        unc: '',
        path: '',
        uri: '',
        port: 81
    });

    const [error, setError] = useState<any>({
        unc: undefined,
        path: undefined
    });


    useEffect(()=> {
        httpClient.get(myRoute.integrationSetting)
        .then(res => {
            setIsLoading(false);
            setData({
                unc: res.data.unc_remote_folder_integration,
                path: res.data.path_remote_folder_integration,
                uri: res.data.uri_remote_app_integration,
                port: res.data.port_remote_app_integration
            });
        })
        .catch(err => {
            setIsLoading(false);
            if(err.response == undefined){
                noNetWork();
            }else{
                problemOccur();
            }
        })
    }, [])


    const onSubmit = (e: FormEvent) =>{
        e.preventDefault();
        setError({});
        httpClient.post(myRoute.integrationSettingUpdate, encodeData(data))
        .then(res => {
            Toast.fire();
        })
        .catch(err => {
            if(err.response == undefined){
                noNetWork();
            }else{
                if(err.response.status == HttpStatusCode.BadRequest){
                    setError(err.response.data);
                }else{
                    problemOccur();
                }
            }
        })
    }

    return(
        <>
            <Layout title="Integration dans la telecompense">
            {isLoading == true &&
                <div className='text-center'>
                    <BeatLoader />
                </div>
            }
            {isLoading == false &&
                <div className="row">
                    <div className="col-md-10 col-lg-8">
                        <Wrapper title='Repertoire distant du serveur de telecompense'>
                            <form onSubmit={onSubmit}>
                                <div>
                                    <p>URI du Service d'integration des cheques dans la telecompense <br/>
                                        Exemple: http://127.0.0.1
                                    </p>
                                    <Input label='Uri du service integrateur' type='text' name='uri' data={data} update={setData} report={error.uri} />
                                </div>
                                <div>
                                    <p>Port du Service d'integration des cheques dans la telecompense <br/>
                                        Exemple: 81
                                    </p>
                                    <Input label='port du service integrateur' type='number' name='port' data={data} update={setData} report={error.port} />
                                </div>
                                <div>
                                    <p>Repertoire partage du serveur de telecompense format unc. <br/>
                                        Exemple: \\127.0.0.1\share
                                    </p>
                                    <Input label='UNC du repertoire' type='text' name='unc' data={data} update={setData} report={error.unc} />
                                </div>
                                <div>
                                    <p>Le chemin reel du repertoire partage <br/>
                                        Exemple: D:\share
                                    </p>
                                    <Input label='Chemin absolu du repertoire' type='text' name='path' data={data} update={setData} report={error.path} />
                                </div>
                                <div className="mt-2">
                                    <button type="submit" className="btn btn-primary">Enregistrer</button>
                                </div>
                            </form>
                        </Wrapper>
                    </div>
                </div>
            }
            </Layout>
        </>
    )
}
export default IntegrationWebClearing;