import React, { useState } from 'react'
import Input from './Input';
import Select from './Select';
import { BeatLoader } from 'react-spinners';
import RapportListe from './RapportListe';

const Rapport = () => {
  const [data, setData] = useState({
    etat: '',
    date1: '',
    date2: '',
    reference:'',
    codeRemise :''
  });

  const [error, setError] = useState({
    etat: undefined,
    date1: undefined,
    date2: undefined,
    reference:undefined,
     codeRemise :undefined
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const ETAT = [{ id: 'rejeter', label: 'Rejeter' },
  { id: 'valider', label: 'valider' },
  { id: 'integrer', label: 'integrer' }];

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  return (
    <>
      <form onSubmit={onSubmit} className='row' >

        <div className="col-md-3">
          <Input label='Date début' type='date' name='date1' data={data} update={setData} report={error.date1} />
        </div>

        <div className="col-md-3">
          <Input label='Date fin' type='date' name='date2' data={data} update={setData} report={error.date2} />
        </div>

        <div className="col-md-3">
          <Input label='Code remise' type='text' name='codeRemise' data={data} update={setData} report={error.codeRemise} />
        </div>

        <div className="col-md-3">
          <Input label='Reference' type='text' name='reference' data={data} update={setData} report={error.reference} />
        </div>

        <div className="col-md-3">
          <Select label='Selectionnez un état' name='etat' state={data} update={setData} data={ETAT} fieldNames={['label']} />
        </div>

        <div className="col-md-12">
          {isSubmitLoading == true && <div className="text-center">
            <BeatLoader />
          </div>}
          <button disabled={isSubmitLoading} type="submit" className="btn btn-primary">Enregistrer</button>
        </div>
      </form>

      <div className='mt-5' />
      <RapportListe />
    </>
  )
}

export default Rapport
