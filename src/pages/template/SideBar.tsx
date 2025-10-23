import { useEffect } from "react";
import MyLink from "../component/MyLink";
import AdminRoute from "../app/bank/AdminRoute";
import ValidateurRoute from "../app/bank/ValidateurRoute";
import ItRoute from "../app/bank/ItRoute";
import CorrecteurRoute from "../app/bank/CorrecteurRoute";
import IntegrateurRoute from "../app/bank/IntegrateurRoute";
import SupervisorRoute from "../app/bank/SupervisorRoute";


const SideBar = ({ userData }: any) => {

   return (
      <>
         <nav id="sidebar">
            <div className="sidebar_blog_1">
               <div className="sidebar-header">
                  <div className="logo_section">
                     <a href="/suivi-import/">
                        {/* <img className="logo_icon img-responsive" src="/images/logo/logo_icon.png" alt="#" /> */}
                     </a>
                  </div>
               </div>
               <div className="sidebar_user_info">
                  <div className="icon_setting"></div>
                  <div className="user_profle_side">
                     <div className="user_img">
                        {/* <img className="img-responsive" src="/images/layout_img/user_img.jpg" alt="#" /> */}
                     </div>
                     <div className="user_info">
                        <h6>{userData.username}</h6>
                        <p><span className="online_animation"></span> {userData.role}</p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="sidebar_blog_2">
               <h4>General</h4>
               <ul className="list-unstyled components">
                  <li className="active">
                     <a href="#dashboard" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i className="fa fa-dashboard yellow_color"></i> <span>Dashboard</span></a>
                     <ul className="collapse list-unstyled" id="dashboard">
                        <MyLink label="Dashboard" link="/suivi-import/" />
                        <MyLink label="Mon profil" link="/suivi-import/profil" />
                        <MyLink label="Deconnexion" link="/deconnection" />
                     </ul>
                  </li>
                  {userData.role.toUpperCase() == 'ADMIN' && <AdminRoute />}
                  {/* {userData.role.toUpperCase() == 'LOGISTICIEN' && <ValidateurRoute />}*/}
                  {userData.role.toUpperCase() == 'IT' && <ItRoute />}
                  {userData.role.toUpperCase() == 'LOGISTICIEN' && <CorrecteurRoute />}
                  {userData.role.toUpperCase() == 'COMPTABLE' && <IntegrateurRoute/>}
                  {userData.role.toUpperCase() == 'SUPERVISEUR' && <SupervisorRoute/>}
                  {/*<li><a href="widgets.html"><i className="fa fa-clock-o orange_color"></i> <span>Widgets</span></a></li>*/}

               </ul>
            </div>
         </nav>
      </>
   );
};

export default SideBar;