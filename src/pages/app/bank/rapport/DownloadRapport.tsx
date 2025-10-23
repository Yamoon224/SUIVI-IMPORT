import React, { useEffect, useRef } from 'react';
import ReactToPrint from 'react-to-print';
import './rapport.css';
import CheckEtat from '../../../component/CheckEtat';
import moment from 'moment';

const DownloadRapport = ({ data }: any) => {
    const rapportRef = useRef(null);

    useEffect(() => {
        var printBtn = document.getElementById('printBtn');
        if (printBtn) {
            printBtn.click()
        }

    }, [data])

    return (
        <div className='d-none'>
            <ReactToPrint
                trigger={() => <button id='printBtn' className='d-none'>Print this out!</button>}
                content={() => rapportRef.current}
            />
            <div ref={rapportRef}>
                {
                    data.map((checks: any, index: number) => {

                        // calcul de la somme totale
                        let totalMontant = 0;

                        for (let i = 0; i < checks.length; i++) {
                            totalMontant += checks[i].montant;
                        }

                        return (
                            <>
                                <div className='page-break' key={index + "c"}>
                                    <div className=''>
                                        <span>
                                            <h2>
                                                Montant Total des cheques  : {totalMontant} cfa
                                            </h2>
                                        </span>
                                    </div>
                                    <table className='table'>
                                        <thead>
                                            <tr>
                                                <th>Numero de cheque</th>
                                                <th>Agence deb.</th>
                                                <th>Banque deb.</th>
                                                <th>Compte deb.</th>
                                                <th>Etat</th>
                                                <th>Montant</th>
                                                <th>Remise</th>
                                                {/* <th>Compte remettant</th> */}
                                                <th>Bénéficiare</th>
                                                <th>Agence scan</th>
                                                <th>Borne scan</th>
                                                <th>Date scan</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {checks.map((check: any) => {
                                                return (
                                                    <tr key={check.id + "s"}>
                                                        <td>{check.numeroCheque}</td>
                                                        <td>{check.codeAgence}</td>
                                                        <td>{check.codeBanque}</td>
                                                        <td>{check.referenceClient}</td>
                                                        <td>{check.etat}</td>
                                                        <td>{check.montant}</td>
                                                        <td>{check.remise.reference}</td>
                                                        {/* <td>{check.remise.compteRemettant.numeroCmpt}</td> */}
                                                        <td>{check.remise.compteRemettant.intitule}</td>
                                                        <td>{check.remise.agence.code}</td>
                                                        <td>{check.remise.borne.libelle}</td>
                                                        <td>{moment(check.dateCreation).format('DD/MM/YYYY HH:mm')}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div ></div>
                            </>
                        )
                    })

                }
            </div>
        </div>
    )
}
export default DownloadRapport;