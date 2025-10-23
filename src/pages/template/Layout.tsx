
import { FunctionComponent, useEffect, useState } from 'react';
import SideBar from './SideBar';
import TopBar from './TopBar';
import WebPage from './WebPage';
import BodyProps from '../../types/BodyProps';
import httpClient from '../hooks/httpClient';
import myRoute from '../hooks/myRoute';
import noNetWork from '../component/AlertReport';
import { HttpStatusCode } from 'axios';
import { Navigate } from 'react-router-dom';

const Layout: FunctionComponent<BodyProps> = ({title, children}) => {

    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [userData, setUserData] = useState({
        nom: '',
        prenom: '',
        username: '',
        role: ''
    });
   
    useEffect(() => {
        const tokenAuth = localStorage.getItem('authToken');
        httpClient.get(myRoute.myProfile, {
            headers: {
                "Authorization": tokenAuth ?  "Bearer " + tokenAuth: "" ,
            }
        })
        .then(res => {        
            setUserData({
                nom: res.data.nom,
                prenom: res.data.prenom,
                username: res.data.username,
                role: res.data.role.libelle
            });
            
        })
        .catch(err => {
            if(err.response == undefined){
                noNetWork();
            }else{
                if(err.response.status == HttpStatusCode.Unauthorized){
                    localStorage.clear();
                    setIsAuthenticated(false);
                }
            }
            
        });
    }, [])

    if(isAuthenticated == false){
        return <Navigate to={"/"} />
    }
    return(
        <div className="full_container">
            <div className="inner_container">
                <SideBar userData={userData} />
                <div id="content">
                    <TopBar userData={userData}/>
                    <WebPage title={title}>
                        {children}
                    </WebPage>
                </div>
            </div>
        </div>
    );
}
export default Layout;