import { Link } from "react-router-dom";

const AgenceMenu = ({codeAgence}: any) => {

    return(
        <div className="col-12 text-right mb-2">
            <Link className="btn btn-link " to={"/banking/agence/"+ codeAgence +"/info"}><i className="fa fa-users"></i> Utilisateurs</Link>
            <Link className="btn btn-link" to={"/banking/agence/"+ codeAgence +"/bornes"}><i className="fa fa-laptop"></i> Bornes</Link>
            <Link className="btn btn-link" to={"/banking/agence/"+ codeAgence +"/comptes"}><i className="fa fa-file"></i> Comptes</Link>
        </div>
    );
}
export default AgenceMenu;