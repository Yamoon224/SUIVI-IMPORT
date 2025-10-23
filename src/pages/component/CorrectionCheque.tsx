import React, { useState } from "react";
import httpClient, { fetchImgR, fetchImgV } from "../hooks/httpClient";
import CheckEtat from "./CheckEtat";
import InputCheque from "./InputCheque";

const CorrectionCheque = ({ cheques, remise, ETAPE, setEtape, onRemise, updateChecks, updateRemise }: any) => {
    const [currentNumberCheque, setCurrentNumberCheque] = useState<number>(0);
    const [check, setCheck] = useState(cheques[currentNumberCheque]);
    const nbreCheques: number = check.remise.nbreCheques;

    const [showPrev, setShowPrev] = useState<boolean>(true);
    const [showNext, setShowNext] = useState<boolean>(true);


    // variable loading cheques
    const [isImgRLoading, setIsImgRLoading] = useState(true);
    const [isImgVLoading, setIsImgVLoading] = useState(true);
    const [imgR, setImgR] = useState<any>(null);
    const [imgV, setImgV] = useState<any>(null);

    // get cheque R and V
    const getImg = (uri: string) => {
        setIsImgRLoading(true);
        httpClient.get(fetchImgR(uri))
            .then(res => {
                setIsImgRLoading(false);
                setImgR(res.data);
            })
            .catch(err => {
                setIsImgRLoading(false);
                setImgR("/images/notfound.png");
            })

        setIsImgVLoading(true);
        httpClient.get(fetchImgV(uri))
            .then(res => {
                setIsImgVLoading(false);
                setImgV(res.data);
            })
            .catch(err => {
                setIsImgVLoading(false);
                setImgV("/images/notfound.png");
            })

    }

    const onNext = () => {
        if (currentNumberCheque < nbreCheques && currentNumberCheque >= 0) {
            if (currentNumberCheque === nbreCheques - 1) {
                setCurrentNumberCheque(currentNumberCheque);
                setCheck(cheques[currentNumberCheque]);
                getImg(cheques[currentNumberCheque].uri);
                setShowPrev(true);
                setShowNext(false);
            }
            else {
                setCurrentNumberCheque(currentNumberCheque + 1);
                setCheck(cheques[currentNumberCheque + 1]);
                getImg(cheques[currentNumberCheque + 1].uri);
                setShowNext(true);
                if (currentNumberCheque + 1 === nbreCheques - 1) {
                    setShowPrev(true);
                    setShowNext(false);
                }
            }
        }
    }

    const onPrev = () => {
        if (currentNumberCheque < nbreCheques && currentNumberCheque >= 0) {
            if (currentNumberCheque === 0) {
                setCurrentNumberCheque(0);
                setCheck(cheques[0]);
                getImg(cheques[0].uri);
                setShowPrev(false);
                setShowNext(true);
            }
            else {
                setCurrentNumberCheque(currentNumberCheque - 1);
                setCheck(cheques[currentNumberCheque - 1]);
                getImg(cheques[currentNumberCheque - 1].uri);
                setShowPrev(true);

                if (currentNumberCheque - 1 === 0) {
                    setShowPrev(false);
                    setShowNext(true);
                }
            }
        }
    }

    return <>
        <div className="card mt-4">
            <h5 className="card-header">
                Cheque #{currentNumberCheque + 1}: <br />
                <small>Sequence du cheque de la remise: {check?.sequenceRemise}</small>
            </h5>
            <div className="card-body">
                <div>
                    <div className="text-right">
                        <button type="button" onClick={onRemise} className="btn btn-outline-primary">{"< Remise"}</button>
                    </div>
                    <CheckEtat etat={check?.etat} />
                </div>
                <InputCheque setCheck={setCheck} updateRemise={updateRemise} getImg={getImg} updateChecks={updateChecks} check={check} remise={remise} isImgRLoading={isImgRLoading} isImgVLoading={isImgVLoading} imgR={imgR} imgV={imgV} />

                {showPrev && <button type="button" onClick={onPrev} className="btn btn-primary float-left mr-2">{"< Precedent"}</button>}
                {showNext && <button type="button" onClick={onNext} className="btn btn-primary float-left">{"Suivant >"}</button>}
            </div>

        </div>
    </>
}

export default CorrectionCheque;