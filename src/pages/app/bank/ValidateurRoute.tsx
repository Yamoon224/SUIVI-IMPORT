import MyLink from "../../component/MyLink";


const ValidateurRoute = () => {

    return(
        <>
            <li className="active">
                <a href="#validateurRemise" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i className="fa fa-dollar yellow_color"></i> <span>Gestion des remises</span></a>
                <ul className="collapse list-unstyled" id="validateurRemise">
                    <MyLink label="Nouvelles remises" link="/banking/validation/newRemise"  />
                </ul>
            </li>
            <li className="active">
                <a href="#rapportBank" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i className="fa fa-file yellow_color"></i> <span>Gestion des rapports</span></a>
                <ul className="collapse list-unstyled" id="rapportBank">
                    <MyLink label="Faire un rapport" link="/banking/rapport/bank"  />
                </ul>
            </li>

           
        </>
    );
}

export default ValidateurRoute;