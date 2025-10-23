import { Link } from "react-router-dom";


const TopBar = ({userData}: any) => {

    return(
        <div className="topbar">
            <nav className="navbar navbar-expand-lg navbar-light">
            <div className="full">
                <button type="button" id="sidebarCollapse" className="sidebar_toggle"><i className="fa fa-bars"></i></button>
                <div className="logo_section">
                    <a href="/suivi-import/">
                        {/* <img className="img-responsive" src="/images/logo/logo.png" alt="#" /> */}
                        </a>
                </div>
                <div className="right_topbar">
                    <div className="icon_info">
                        {/* <ul>
                        <li><a href="#"><i className="fa fa-bell-o"></i><span className="badge">2</span></a></li>
                        <li><a href="#"><i className="fa fa-question-circle"></i></a></li>
                        <li><a href="#"><i className="fa fa-envelope-o"></i><span className="badge">3</span></a></li>
                        </ul> */}
                        <ul className="user_profile_dd">
                        <li>
                            <a className="dropdown-toggle" data-toggle="dropdown"><i className="fa fa-user"></i><span className="name_user">{userData.nom + " " + userData.prenom}</span></a>
                            <div className="dropdown-menu">
                                <Link className="dropdown-item" to="/suivi-import/profil">Mon Profil</Link>

                                <Link className="dropdown-item" to={"/deconnection"}><span>Deconnexion</span> <i className="fa fa-sign-out"></i></Link>
                            </div>
                        </li>
                        </ul>
                    </div>
                </div>
            </div>
            </nav>
        </div>
    );
}
export default TopBar;