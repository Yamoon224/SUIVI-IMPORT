import React from "react";
import InputRemise from "./InputRemise";
import LoadImage from "./LoadImage";
import RemiseEtat from "./RemiseEtat";
import { Link } from "react-router-dom";

interface ICORRECTION {
    remise: {
        etat: string,
        uri: string,
        sequence: number,
        montant: number,
        nbreCheques: number,
        id: number,
        compteRemettant: {
            intitule: string,
            numeroCmpt: string,
            codeAgence: string
        },
    },
    onCheque: () => void,
    updateRemise?: any,
    updateChecks?: any

}
const CorrectionRemise = ({ remise, onCheque, updateRemise, updateChecks }: ICORRECTION) => {

    return <>
        <div className="card">
            <h5 className="card-header">
                Detail de la remise<br />
                <RemiseEtat etat={remise?.etat} />
            </h5>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-12 text-right">
                        <Link className="btn btn-outline-primary" to={"#"} onClick={onCheque}> {'Cheques >'}</Link>
                    </div>
                </div>
                <LoadImage uri={remise?.uri} />
                <InputRemise updateChecks={updateChecks} remise={remise} updateRemise={updateRemise} onCheque={onCheque} />

            </div>
        </div>
    </>
}

export default CorrectionRemise;