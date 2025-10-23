
// ========================================
// 1. BonCommandePDF.tsx - Composant de visualisation/impression
// ========================================
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

interface LigneCommande {
  id: number;
  designation: string;
  uniteGestion: string;
  quantite: number;
  prixUnitaire: number;
  reference: string;
  referenceFournisseur: string;
}

interface CommandeInfo {
  numeroCommande: string;
  dateProforma: string;
  clientDestinataire: string;
  incoterm: string;
  modeEnvoi: string;
  statut: string;
}

interface BonCommandePDFProps {
  commande: CommandeInfo;
  lignes: LigneCommande[];
  entrepriseInfo?: {
    nom: string;
    adresse: string;
    telephone: string;
    compte: string;
  };
}

export const BonCommandePDF: React.FC<BonCommandePDFProps> = ({
  commande,
  lignes,
  entrepriseInfo = {
    nom: "SORIM HOLDING",
    adresse: "GRAND-BASSAM CITE DE LA PAIX",
    telephone: "+225 05 46 83 09 29 / 07 69 64 79 05",
    compte: "CI007 01064 900002729890 37"
  }
}) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const calculerMontantHT = (ligne: LigneCommande) => {
    return ligne.quantite * ligne.prixUnitaire;
  };

  const totalHT = lignes.reduce((acc, ligne) =>
    acc + calculerMontantHT(ligne), 0
  );

  return (
    <>
      {/* Bouton d'impression */}
      <button
        onClick={handlePrint}
        className="btn btn-outline-primary mb-3"
      >
        🖨️ Imprimer Bon de commande
      </button>

      {/* Composant à imprimer */}
      <div ref={componentRef} className="p-4 bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* En-tête */}
        <div style={{ border: '2px solid black', marginBottom: '16px' }}>
          <div style={{ backgroundColor: '#e5e7eb', padding: '8px', borderBottom: '2px solid black' }}>
            <h1 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px', margin: 0 }}>
              Bon de commande fournisseur import
            </h1>
          </div>

          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '8px' }}>
                  {entrepriseInfo.nom}
                </h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600 }}>Date: </span>
                  <span>{formatDate(commande.dateProforma)}</span>
                </div>
                <div style={{ marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600 }}>Numéro: </span>
                  <span>{commande.numeroCommande}</span>
                </div>
              </div>
            </div>

            {/* Informations de livraison */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', fontSize: '14px' }}>
              <div>
                <span style={{ fontWeight: 600, width: '140px', display: 'inline-block' }}>Client:</span>
                <span>{commande.clientDestinataire}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600, width: '140px', display: 'inline-block' }}>Incoterm:</span>
                <span>{commande.incoterm}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600, width: '140px', display: 'inline-block' }}>Mode d'envoi:</span>
                <span>{commande.modeEnvoi}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600, width: '140px', display: 'inline-block' }}>Statut:</span>
                <span>{commande.statut}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des produits */}
        <table style={{ width: '100%', border: '2px solid black', borderCollapse: 'collapse', marginBottom: '16px', fontSize: '12px' }}>
          <thead>
            <tr style={{ backgroundColor: '#e5e7eb', borderBottom: '2px solid black' }}>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left', fontWeight: 600 }}>Désignation</th>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center', fontWeight: 600, width: '100px' }}>U. Gest.</th>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center', fontWeight: 600, width: '80px' }}>Qté</th>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'right', fontWeight: 600, width: '120px' }}>PU</th>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center', fontWeight: 600, width: '120px' }}>Référence</th>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center', fontWeight: 600, width: '120px' }}>Réf. Fourn.</th>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'right', fontWeight: 600, width: '120px' }}>Mt HT</th>
            </tr>
          </thead>
          <tbody>
            {lignes.map((ligne, index) => (
              <tr key={ligne.id} style={{ borderBottom: index !== lignes.length - 1 ? '1px solid black' : 'none' }}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{ligne.designation}</td>
                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{ligne.uniteGestion}</td>
                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{formatNumber(ligne.quantite)}</td>
                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'right' }}>{formatNumber(ligne.prixUnitaire)}</td>
                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{ligne.reference || '-'}</td>
                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{ligne.referenceFournisseur || '-'}</td>
                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'right', fontWeight: 600 }}>
                  {formatNumber(calculerMontantHT(ligne))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div style={{ border: '2px solid black', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px' }}>
            <div style={{ width: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid black' }}>
                <span style={{ fontWeight: 600 }}>TOTAL HT</span>
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{formatNumber(totalHT)} FCFA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pied de page */}
        <div style={{ borderTop: '2px solid black', paddingTop: '16px', fontSize: '11px', textAlign: 'center' }}>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ fontWeight: 600 }}>COMPTE:</span> {entrepriseInfo.compte} /
            <span style={{ fontWeight: 600 }}> TEL:</span> {entrepriseInfo.telephone}
          </div>
          <div>
            <span style={{ fontWeight: 600 }}>SIEGE SOCIAL:</span> {entrepriseInfo.adresse}
          </div>
        </div>

        {/* Mention Sage */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '10px', color: '#6b7280' }}>
          <span>© Sage</span>
          <span>Page 1</span>
        </div>
      </div>

      {/* Styles pour l'impression */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          @page {
            size: A4;
            margin: 10mm;
          }
        }
      `}</style>
    </>
  );
};