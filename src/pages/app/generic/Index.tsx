import { useEffect, useState } from "react";
import Card from "../../component/Card";
import Layout from "../../template/Layout";
import httpClient from "../../hooks/httpClient";
import myRoute from "../../hooks/myRoute";
import noNetWork, { problemOccur } from "../../component/AlertReport";
import { HttpStatusCode } from "axios";


const Index = ({ }) => {
    // Nombre de nouvelle remise | remise rejete | remise valide | remise integer

    const [stats, setStats] = useState({
        newRemise: 0,
        remiseRejete: 0,
        remiseValide: 0,
        remiseIntegre: 0
    });

    useEffect(() => {
        const tokenAuth = localStorage.getItem("authToken");
        httpClient.get(myRoute.home, {
            headers: {
               "Authorization": "Bearer "+ tokenAuth
            }
        })
        .then(res => {
            setStats(res.data);
        })
        .catch(err => {
            if(err.response == undefined){
                noNetWork();
            }else{
               problemOccur();
               console.log(err);
               
            }
        })
    }, [])

    return (
        <Layout title="Bienvue sur le dashboard">
            <div className="row column1">
                <Card title={"Commandes en cours"} number={stats.newRemise} fa="fa-truck-loading" colorStyle={"#FF9800"} />
                <Card title={"Commandes archivées"} number={stats.remiseRejete} fa="fa-archive" colorStyle={"red"} />
                <Card title={"Commandes Livrées"} number={stats.remiseValide} fa="fa-check-circle" colorStyle={"green"} />
                <Card title={"Commandes Soldées"} number={stats.remiseIntegre} fa="fa-money" colorStyle={"#0089FA"} />
                <Card title={"Nombre d'articles"} number={stats.remiseIntegre} fa="fa-boxe" colorStyle={"#fa7900ff"} />
                <Card title={"Nombre de fournisseurs"} number={stats.remiseIntegre} fa="fa-user" colorStyle={"#c800faff"} />
                <Card title={"Chiffre d'affaires"} number={stats.remiseIntegre} fa="fa-money" colorStyle={"#006cfaff"} />
            </div>
        </Layout>
    );
}
export default Index;