import { useEffect, useState } from "react";
import Rapport from "../../../component/Rapport";
import Wrapper from "../../../component/Wrapper";
import Layout from "../../../template/Layout";
import Input from "../../../component/Input";
import httpClient, { encodeData, writeErrors } from "../../../hooks/httpClient";
import myRoute from "../../../hooks/myRoute";
import Select from "../../../component/Select";
import noNetWork, { problemOccur } from "../../../component/AlertReport";
import { HttpStatusCode } from "axios";
import { BeatLoader } from "react-spinners";
import DownloadRapport from "./DownloadRapport";
import Radio from "../../../component/Radio";
import { grouping } from "../../../hooks/helper";



const RapportBank = ({}) => {

    const DATE_TYPE = {
        consume: 0,
        injectedWebclearing: 1
    };

    const [rapport, setRapport] = useState({
        remise: '',
        agenceRemettant: '',
        compteRemettant: '',
        banqueRemettant: '',
        banqueDebiteur: '',
        agenceDebiteur: '',
        compteDebiteur: '',
        numeroCheck: '',
        etatCheck: '',
        dateScanStart: '',
        dateScanEnd: ''
    })
    const [errors, setErrors] = useState({
        remise: undefined,
        agenceRemettant: undefined,
        compteRemettant: undefined,
        banqueRemettant: undefined,
        banqueDebiteur: undefined,
        agenceDebiteur: undefined,
        compteDebiteur: undefined,
        numeroCheck: undefined,
        etatCheck: undefined,
        dateScanStart: undefined,
        dateScanEnd: undefined
    })



    const groupBy = {
        debit_bank: "codeBanque",
        debit_agence: "codeAgence",
        debit_account: "referenceClient",
        debit_monant: "montant",
        etat: "etat",
    }

    const radios = [
        {id: "db", value: groupBy.debit_bank, label: "Banque debitrice"},
        {id: "da", value: groupBy.debit_agence, label: "Agence debitrice"},
        {id: "dc", value: groupBy.debit_account, label: "Compte debiteur"},
        {id: "dm", value: groupBy.debit_monant, label: "Montant"},
        {id: "de", value: groupBy.etat, label: "etat"}
    ]
    

    const [sort, setSort] = useState({
        value: groupBy.debit_bank 
    })

    const [etats, setEtats] = useState([]);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [notFound, setNotFound] = useState(null);
    const [checks, setChecks] = useState([]);
    const [find, setFind] = useState(false);
    const [output, setOutput] = useState([]);

    useEffect(() => {
        httpClient.get(myRoute.dataRapport)
        .then(res => {
            setEtats(res.data.etats)
        })
        .catch(err => {
           
        })
    }, [])

    
    const onSubmitRapport = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitLoading(true);
        setFind(false);
        setErrors(writeErrors({...errors}, {}));
        setNotFound(null);
        httpClient.post(myRoute.findRapport, encodeData(rapport))
        .then(res => {
            setIsSubmitLoading(false);    
            setChecks(res.data)
            setFind(true);    
            let val = [...res.data];
            let result = grouping(val, sort.value)
            setOutput(result);
            
            
        })
        .catch(err => {
          
            setIsSubmitLoading(false);
            if(err.response == undefined){
                noNetWork();
            }else{
                if(err.response.status == HttpStatusCode.BadRequest){
                    setErrors(writeErrors({...errors}, err.response.data));
                }else if(err.response.status == HttpStatusCode.NotFound){
                    setNotFound(err.response.data);
                }else{
                    problemOccur();
                }                
            }
        })
    }

    
    
    
    
    return(
        <Layout title='Raports'>
           
            <Wrapper title="Rapport">
                {find == true && <DownloadRapport data={output}/>}
                <form  onSubmit={onSubmitRapport} className="row">
                    {notFound != null && 
                        <div className="col-12 alert alert-danger">
                            {notFound}
                        </div>
                    }
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12">
                                <h5>Zone remise</h5>
                                <div className="row mb-2">
                                    <div className="col-md-4">
                                        <Input data={rapport} update={setRapport} name="dateScanStart" report={errors.dateScanStart} type="date" label="Date de scan" />
                                    </div>
                                    <div className="col-md-4">
                                        <Input data={rapport} update={setRapport} name="dateScanEnd" report={errors.dateScanEnd} type="date" label="Date fin" />
                                    </div>
                                    <div className="col-md-4">
                                        <Input data={rapport} update={setRapport} name="remise" report={errors.remise} label="Reference la remise (Facultatif)" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mt-2">
                                <h5>Remettant</h5>
                                <div className="row mb-2">
                                    <div className="col-md-4">
                                        <Input data={rapport} update={setRapport} name="banqueRemettant" report={errors.banqueRemettant} label="Banque (Facultatif)" />
                                    </div>
                                    <div className="col-md-4">
                                        <Input data={rapport} update={setRapport} name="agenceRemettant" report={errors.banqueRemettant} label="Agence (Facultatif)" />
                                    </div>
                                    <div className="col-md-4">
                                        <Input data={rapport} update={setRapport} name="compteRemettant" report={errors.compteRemettant} label="Numero de compte (Facultatif)" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mt-2">
                                <h5>Debiteur</h5>
                                <div className="row mb-2">
                                    <div className="col-md-4">
                                        <Input data={rapport} update={setRapport} name="banqueDebiteur" report={errors.banqueDebiteur} label="Banque (Facultatif)" />
                                    </div>
                                    <div className="col-md-4">
                                        <Input data={rapport} update={setRapport} name="agenceDebiteur" report={errors.agenceDebiteur} label="Agence (Facultatif)" />
                                    </div>
                                    <div className="col-md-4">
                                        <Input data={rapport} update={setRapport} name="compteDebiteur" report={errors.compteDebiteur}  label="Numero de compte (Facultatif)" />
                                    </div>
                                    <div className="col-md-4">
                                        <Input data={rapport} update={setRapport} name="numeroCheck" report={errors.numeroCheck}  label="Numero de cheque (Facultatif)" />
                                    </div>
                                    <div className="col-md-4">
                                        <Select data={etats} state={rapport} update={setRapport} id="etat" report={errors.etatCheck} name="etatCheck" fieldNames={['libelle']}  label="Etat du cheque (Facultatif)" />
                                        
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mt-2">
                                <h5>Regrouper par</h5>
                                <div className="row">
                                    <div className="col-md-6">
                                       <Radio dataset={radios} data={sort} update={setSort} name={"value"}  />
                                       
                                    </div>
                                    
                                </div>
                            </div>
                            <div className="col-12 mt-2">
                                {isSubmitLoading == true && <div>
                                        <BeatLoader />
                                    </div>}
                                <button disabled={isSubmitLoading} type="submit" className="btn btn-lg btn-primary">Rechercher</button>
                            </div>
                        </div>
                    </div>
                </form>
            </Wrapper>
        </Layout>
    );
}
export default RapportBank;