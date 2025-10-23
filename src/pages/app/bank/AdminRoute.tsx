import MyLink from "../../component/MyLink";

const AdminRoute = () => {

    return (
        <>
            <li className="active">
                <a href="#admiUser" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i className="fa fa-users yellow_color"></i> <span>Gestion des utilisateurs</span></a>
                <ul className="collapse list-unstyled" id="admiUser">
                    <MyLink label="Liste des utilsateurs" link="/suivi-import/utilisateurs" />
                    <MyLink label="Creation de compte utilisateur" link="/suivi-import/creer-utilisateurs" />
                </ul>
            </li>
            <li className="active">
                <a href="#fournisseur" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i className="fa fa-users yellow_color"></i> <span>Gestion des fournisseurs</span></a>
                <ul className="collapse list-unstyled" id="fournisseur">
                    <MyLink label="Liste des fournisseurs" link="/suivi-import/liste-fournisseurs" />
                    <MyLink label="Creation d'un fournisseur" link="/suivi-import/creer-fournisseur" />
                </ul>
            </li>
                <li className="active">
                    <a href="#transitaire" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i className="fa fa-users yellow_color"></i> <span>Gestion des transitaires</span></a>
                    <ul className="collapse list-unstyled" id="transitaire">
                        <MyLink label="Liste des transitaires" link="/suivi-import/liste-fournisseurs" />
                        <MyLink label="Creation d'un transitaire" link="/suivi-import/creer-fournisseur" />
                    </ul>
               </li>
            <li className="active">
                <a href="#agence" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i className="fa fa-tag yellow_color"></i> <span>Gestion des articles</span></a>
                <ul className="collapse list-unstyled" id="agence">
                    <MyLink label="Liste des articles" link="/suivi-import/liste-article" />
                    <MyLink label="Enregister un article" link="/suivi-import/creer-article" />
                </ul>
            </li>
            <li className="active">
                <a
                    href="#parametres"
                    data-toggle="collapse"
                    aria-expanded="false"
                    className="dropdown-toggle"
                >
                    <i className="fa fa-cog yellow_color"></i>
                    <span>Gestion des Paramètres</span>
                </a>

                <ul className="collapse list-unstyled" id="parametres">
                    <MyLink label="Liste des banques" link="/suivi-import/parametre/banques" />
                    <MyLink label="Liste des Incoterms" link="/suivi-import/parametre/incoterm" />
                    <MyLink label="Liste des Modes d’Envoi" link="/suivi-import/parametre/envoie" />
                    <MyLink label="Liste des départements" link="/suivi-import/parametre/departement" />
                    <MyLink label="Liste des dévises" link="/suivi-import/parametre/devises" />
                    <MyLink label="Liste des modes Paiements" link="/suivi-import/parametre/modepaiements" />
                    <MyLink label="Liste des modes Transports" link="/suivi-import/parametre/modetransports" />
                    <MyLink label="Liste des Responsabilites Vendeurs" link="/suivi-import/parametre/responsabiliteVendeur" />
                    <MyLink label="Liste des Familles Centrales" link="/suivi-import/parametre/familleCentrale" />
                    <MyLink label="Liste des Unites de Ventes" link="/suivi-import/parametre/uniteVente" />
                    <MyLink label="Liste des Echéances" link="/suivi-import/parametre/echeance" />
                    <MyLink label="Liste des Types de Fournisseurs" link="/suivi-import/parametre/typeFournisseur" />
                </ul>
            </li>
        </>
    );
};

export default AdminRoute;