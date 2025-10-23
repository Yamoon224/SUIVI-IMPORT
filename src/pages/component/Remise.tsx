
const Remise = ({remise}: any) => {

    if(remise?.id == null){
        return null;
    }

    return(
        <div className='row mb-4'>
            <div className='col-md-3'>
                <div className='border-bottom'>
                    <div><small>Agence</small></div>
                    <div>{remise.compteRemettant.codeAgence}</div>
                </div>
                <br />
            </div>
            <div className='col-md-4'>
                <div className='border-bottom'>
                    <div><small>Numero de compte</small></div>
                    <div>{remise.compteRemettant.numeroCmpt}</div>
                </div>
                <br />
            </div>
            <div className='col-md-5'>
                <div className='border-bottom'>
                    <div><small>Nom du client</small></div>
                    <div>{remise.compteRemettant.intitule}</div>
                </div>
                <br />
            </div>
            <div className='col-md-3'>
                <div className='border-bottom'>
                    <div><small>Nombre d'instruction</small></div>
                    <div>{remise.nbreCheques}</div>
                </div>
                <br />
            </div>
            <div className='col-md-5'>
                <div className='border-bottom'>
                    <div><small>Montant</small></div>
                    <div>{remise.montant}</div>
                </div>
                <br />
            </div>
            <div className='col-md-4'>
                <div className='border-bottom'>
                    <div><small>Sequence</small></div>
                    <div>{remise.sequence}</div>
                </div>
                <br />
            </div>                
        </div>
    )
}

export default Remise;