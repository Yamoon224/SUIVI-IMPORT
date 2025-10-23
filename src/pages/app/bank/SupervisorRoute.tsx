import MyLink from "../../component/MyLink";

const SupervisorRoute = () => {
    return (<>
        <li className="active">
            <a href="#supervisorVa" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i className="fa fa-dollar yellow_color"></i> <span>Gestion des remises</span></a>
            <ul className="collapse list-unstyled" id="supervisorVa">
                <MyLink label="Nouvelles remises" link="/banking/validation/newRemise"  />
                <MyLink label="Remises a valider" link="/banking/validation/integration"  />
            </ul>
        </li>
        <li className="active">
            <a href="#supervisorLot" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i className="fa fa-folder yellow_color"></i> <span>LOT</span></a>
            <ul className="collapse list-unstyled" id="supervisorLot">
                <MyLink label="Generation de fichiers lot" link="/banking/integrateur/lot/generation"  />
            </ul>
        </li>
        <li className="active">
            <a href="#rapportBank" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i className="fa fa-file yellow_color"></i> <span>Gestion des rapports</span></a>
            <ul className="collapse list-unstyled" id="rapportBank">
                <MyLink label="Faire un rapport" link="/banking/rapport/bank"  />
            </ul>
        </li>
    </>)
}

export default SupervisorRoute;