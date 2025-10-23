import { useState } from 'react'
import reactLogo from './assets/react.svg'
import Layout from './pages/template/Layout';
import SideBar from './pages/template/SideBar';
import TopBar from './pages/template/TopBar';
import { Route, Routes } from 'react-router-dom';
import BankRoute from './pages/app/bank/BankRoute';
import Login from './pages/app/generic/Login';
import ProtectedRoute from './pages/app/generic/ProtectedRoute';
import Index from './pages/app/generic/Index';
import Profil from './pages/app/generic/Profil';
import Disconnect from './pages/app/generic/Disconnect';
import EcobankUser from './pages/app/bank/admin/EcobankUsers';
import EcobankUserCreation from './pages/app/bank/admin/EcobankUserCreation';
import EcobankUserInfo from './pages/app/bank/admin/EcobankUserInfo';
import Agence from './pages/app/bank/agence/Agence';
import AgenceCreation from './pages/app/bank/agence/AgenceCreation';
import UserAgence from './pages/app/bank/agence/UserAgence';
import CreateUserAgence from './pages/app/bank/agence/CreateUserAgence';
import InfoUserAgence from './pages/app/bank/agence/InfoUserAgence';
import BorneAgence from './pages/app/bank/agence/BorneAgence';
import AddBorneAgence from './pages/app/bank/agence/AddBorneAgence';
import InfoBorne from './pages/app/bank/agence/InfoBorne';
import CompteAgence from './pages/app/bank/agence/CompteAgence';
import AddCompteAgence from './pages/app/bank/agence/AddCompteAgence';
import InfoCompteAgence from './pages/app/bank/agence/InfoCompteAgence';
import ListNewRemise from './pages/app/bank/validateur/ListNewRemise';
import InfoRemiseValidator from './pages/app/bank/validateur/InfoRemise';
import ListMotif from './pages/app/bank/It/ListMotif';
import ListBanque from './pages/app/bank/It/ListBanque';
import RemiseRejete from './pages/app/bank/correcteur/ListeFournisseurPourCommande';
import InfoRemise from './pages/app/bank/correcteur/InfoRemise';
import Correction from './pages/app/bank/correcteur/Correction';
import ListReadyIntegration from './pages/app/bank/integrateur/ListReadyIntegration';
import SessionCreation from './pages/app/bank/It/SessionCreation';
import TentativeLoginCreation from './pages/app/bank/It/TentativeLoginCreation';
import InfoRemiseIntegrateur from './pages/app/bank/integrateur/InfoRemiseIntegrateur';
import Audit from './pages/app/bank/It/Audit';
import RapportBank from './pages/app/bank/rapport/RapportBank';
import TrackCheck from './pages/app/bank/rapport/TrackCheck';
import IntegrationWebClearing from './pages/app/bank/It/IntegrationWebClearing';
import PasswordBorneAgence from './pages/app/bank/agence/PasswordBorneAgence';
import GenerateLotFile from './pages/app/bank/integrateur/GenerateLotFile';
import ListeFournisseur from './pages/app/bank/admin/fournisseur/ListeFournisseur';
import EnregistrerFournisseur from './pages/app/bank/admin/fournisseur/EnregistrerFournisseur';
import InfoFournisseur from './pages/app/bank/admin/fournisseur/InfoFournisseur';
import ListeClient from './pages/app/bank/admin/article/ListeArticle';
import EnregistrerArticle from './pages/app/bank/admin/article/EnregistrerArticle';
import InfoClient from './pages/app/bank/admin/article/InfoArticle';
import ListeArticle from './pages/app/bank/admin/article/ListeArticle';
import InfoArticle from './pages/app/bank/admin/article/InfoArticle';
import FournisseurArticle from './pages/app/bank/admin/article/FournisseurArticle';
import EnregistrerAcheteur from './pages/app/bank/admin/acheteur/ListeIncoterm';
import FournisseurCentrale from './pages/app/bank/admin/fournisseur/FournisseurCentrale';
import CreateCommande from './pages/app/bank/correcteur/CreateCommande';
import CreateLigneCommande from './pages/app/bank/correcteur/CreateLigneCommande';
import ListeCommande from './pages/app/bank/correcteur/ListeCommande';
import ListeIncoterm from './pages/app/bank/admin/acheteur/ListeIncoterm';
import ListeFournisseurPourCommande from './pages/app/bank/correcteur/ListeFournisseurPourCommande';
import ModeEnvoi from './pages/app/bank/admin/Parametre/ModeEnvoi';
import Departement from './pages/app/bank/admin/Parametre/Departement';
import Devise from './pages/app/bank/admin/Parametre/Devise';
import ModePaiement from './pages/app/bank/admin/Parametre/ModePaiement';
import ModeTransport from './pages/app/bank/admin/Parametre/ModeTransport';
import ResponsabiliteVendeur from './pages/app/bank/admin/Parametre/ResponsabiliteVendeur';
import FamilleCentrale from './pages/app/bank/admin/Parametre/FamilleCentrale';
import UniteVente from './pages/app/bank/admin/Parametre/UniteVente';
import Echeance from './pages/app/bank/admin/Parametre/Echeance';
import TypeFournisseur from './pages/app/bank/admin/Parametre/TypeFournisseur';


function App() {

  return (
    <Routes>
      <Route path='/suivi-import/*' element={
        <ProtectedRoute>
          <Routes>
            <Route index path='/' element={<Index />} />
            <Route path='/profil' element={<Profil />} />
            <Route path='/utilisateurs' element={<EcobankUser />} />
            <Route path='/creer-utilisateurs' element={<EcobankUserCreation />} />
            <Route path='/info/:userId/utilisateur' element={<EcobankUserInfo />} />
            <Route path='/agence' element={<Agence />} />
            <Route path='/agence/creer' element={<AgenceCreation />} />
            <Route path='/agence/:agence/info' element={<UserAgence />} />
            <Route path='/agence/:agence/userCreate' element={<CreateUserAgence />} />
            <Route path='/agence/:agence/info/:userId/utilisateur' element={<InfoUserAgence />} />
            <Route path='/agence/:agence/bornes' element={<BorneAgence />} />
            <Route path='/agence/:agence/addBorne' element={<AddBorneAgence />} />
            <Route path='/agence/:agence/borne/:borneId' element={<InfoBorne />} />
            <Route path='/agence/:agence/borne/:borneId/password' element={<PasswordBorneAgence />} />
            <Route path='/agence/:agence/comptes' element={<CompteAgence />} />
            <Route path='/agence/:agence/addCompte' element={<AddCompteAgence />} />
            <Route path='/agence/:agence/compte/:compteId' element={<InfoCompteAgence />} />

            {/* Fournisseur*/}
            <Route path='/liste-fournisseurs' element={<ListeFournisseur />} />
            <Route path='/liste-fournisseurs-pour-creer-commande' element={<ListeFournisseurPourCommande />} />
            <Route path='/liste-fournisseurs/:page' element={<ListeFournisseur />} />
            <Route path='/creer-fournisseur' element={<EnregistrerFournisseur />} />
            <Route path='/info/:fournisseurId/fournisseur' element={<InfoFournisseur />} />
            <Route path='/fournisseurCentrale/:fournisseurId/fournisseur' element={<FournisseurCentrale />} />

            {/*Article*/}
            <Route path='/liste-article' element={<ListeArticle />} />
            <Route path='/liste-article/:page' element={<ListeArticle />} />
            <Route path='/creer-article' element={<EnregistrerArticle />} />
            <Route path='/article/info/:articleId' element={<InfoArticle />} />
            <Route path='/article/:articleId/selection-fournisseurs' element={<FournisseurArticle />} />

            {/* Acheteur*/}
            <Route path='/creer-acheteur' element={<EnregistrerAcheteur />} />

            {/* Validateur*/}
            <Route path='/validation/newRemise' element={<ListNewRemise />} />
            <Route path='/validation/integration' element={<ListReadyIntegration />} />
            <Route path='/validation/remise/:remiseId/info' element={<InfoRemiseValidator />} />
            <Route path='/integrateur/validation/remise/:remiseId/info' element={<InfoRemiseIntegrateur />} />
            <Route path='/integrateur/lot/generation' element={<GenerateLotFile />} />

         
            {/* session et inactivité */}
            <Route path='/parametre/session-inactivite' element={<SessionCreation />} />
            <Route path='/parametre/tentative-login' element={<TentativeLoginCreation />} />

            {/** Integration dans web */}
            <Route path='/parametre/integration' element={<IntegrationWebClearing />} />

            {/** correction */}
            <Route path='/correcteur/remise/rejete' element={<RemiseRejete />} />
            <Route path='/correcteur/remise/:remiseId/info' element={<InfoRemise />} />
            {<Route path='/correcteur/remise/:remiseId/corriger' element={<Correction />} />}

            {/* Audit */}
            <Route path='/audit' element={<Audit />} />

            {/* Rapport */}
            <Route path='/rapport/bank' element={<RapportBank />} />
            {/* Suivi des cheques */}
            <Route path='/suivi/check' element={<TrackCheck />} />

            {/* Suivi de commande */}
            <Route path='/creerCommande/:fournisseurId' element={<CreateCommande />} />
            <Route path='/listeCommande' element={<ListeCommande />} />
            <Route path='/creerLigneCommande/:commandeId' element={<CreateLigneCommande />} />

            {/* parametres */}
            <Route path='/parametre/envoie' element={<ModeEnvoi />} />
            <Route path='/parametre/departement' element={<Departement />} />
            <Route path='/parametre/incoterm' element={<ListeIncoterm />} />
            <Route path='/parametre/banques' element={<ListBanque />} />
            <Route path='/parametre/devises' element={<Devise />} />
            <Route path='/parametre/modepaiements' element={<ModePaiement />} />
            <Route path='/parametre/modetransports' element={<ModeTransport />} />
            <Route path='/parametre/modetransports' element={<ModeTransport />} />
            <Route path='/parametre/responsabiliteVendeur' element={<ResponsabiliteVendeur />} />
            <Route path='/parametre/familleCentrale' element={<FamilleCentrale />} />
            <Route path='/parametre/uniteVente' element={<UniteVente />} />
            <Route path='/parametre/echeance' element={<Echeance />} />
            <Route path='/parametre/typeFournisseur' element={<TypeFournisseur />} />

            <Route path='*' element={<div>not found404</div>} />
          </Routes>
        </ProtectedRoute>
      } />
      <Route path="/" element={<Login />} />
      <Route path="/deconnection" element={<Disconnect />} />
    </Routes>
  );
}

export default App
