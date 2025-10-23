import React, { useEffect, useState } from 'react'
import Layout from '../../../template/Layout'
import Wrapper from '../../../component/Wrapper'
import Input from '../../../component/Input'
import { BeatLoader } from 'react-spinners'
import httpClient, { encodeData } from '../../../hooks/httpClient'
import myRoute from '../../../hooks/myRoute'
import noNetWork, { Toast, problemOccur } from '../../../component/AlertReport'
import { HttpStatusCode } from 'axios'

const SessionCreation = () => {
  const [dataSession, setDataSession] = useState({ temps: "" });
  const [errorSession, setErrorSession] = useState({ temps: undefined })

  const [dataInactivite, setDataInactivite] = useState({ temps: "" });
  const [errorInactivite, setErrorInactivite] = useState({ temps: undefined })

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const menu = {
    session: 0,
    inactivity: 1
  };

  const [choice, setChoice] = useState(0);

  useEffect(() => {
    httpClient.get(myRoute.sessionSettings)
    .then(res => {
      setIsLoading(false);
      setDataSession({
        temps: res.data.session_time
      })

      setDataInactivite({temps: res.data.inactivity_time});
      
    })
    .catch(err => {
      setIsLoading(false);
      if(err.response == undefined){
        noNetWork();
      }else{
        problemOccur();
      }
    })
  }, [])

  // Soumission de session
  const onSubmitSession = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    setChoice(menu.session);
    setErrorSession({temps: undefined});
    httpClient.post(myRoute.updateSettings, encodeData({
      valeur: dataSession.temps,
      code: 'session_time'
    }))
    .then(res => {
      setIsSubmitLoading(false);
      Toast.fire();
    })
    .catch(err => {
      setIsSubmitLoading(false);
      if(err.response == undefined){
        noNetWork();
      }else{
        if(err.response.status == HttpStatusCode.BadRequest){
          setErrorSession({temps: err.response.data.valeur ??  err.response.data.code});
        }else{
          problemOccur();
        }
      }
    })
  }

  // soumission de temps d'inactivite
  const onSubmitInactivite = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    setChoice(menu.inactivity);
    httpClient.post(myRoute.updateSettings, encodeData({
      valeur: dataInactivite.temps,
      code: 'inactivity_time'
    }))
    .then(res => {
      setIsSubmitLoading(false);
      Toast.fire();
    })
    .catch(err => {
      setIsSubmitLoading(false);
      if(err.response == undefined){
        noNetWork();
      }else{
        if(err.response.status == HttpStatusCode.BadRequest){
          setErrorInactivite({temps: err.response.data.valeur ??  err.response.data.code});
        }else{
          problemOccur();
        }
      }
    })

  }
  return (
    <Layout title="Session et temps d'inactivité">
      {isLoading == true &&
        <div className='text-center'>
          <BeatLoader />
        </div>
      }
      {isLoading == false &&
        <>
           <div className="row">
            <div className="col-md-10 col-lg-8">
              <Wrapper title='Session de connexion'>

                <form onSubmit={onSubmitSession} >
                  <p>
                    Veuillez définir un temps session en minute. Le temps de session permettra de déterminer la durée de
                    vie de la session lorsqu'un utilisateur se connecte à la plateforme.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Input label='Temps session (min)' type='text' name='temps' data={dataSession} update={setDataSession} report={errorSession.temps} />

                    <div className='mb-3 ml-4'>
                      {(isSubmitLoading && choice == menu.session) && <BeatLoader/>}
                      <button disabled={isSubmitLoading && choice == menu.session} type='submit' className='btn btn-primary'>Enregistrer</button>
                    </div>
                  </div>
                </form>
              </Wrapper>
            </div>
          </div>

          <div className="row">
            <div className="col-md-10 col-lg-8">
              <Wrapper title="Temps d'inactivité">

                <form onSubmit={onSubmitInactivite} >
                  <p>
                    Veuillez définir le temps d'inactivité en minute. Le temps d'inactivité permettra de savoir de combien de temps un utilisateur n'est pas actif sur la plateforme.
                    Lorsque le temps d'inactivité est atteint, l'utilisateur est automatiquement déconnecté.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Input label="Temps d'inactivite" type='text' name='temps' data={dataInactivite} update={setDataInactivite} report={errorInactivite.temps} />

                    <div className='mb-3 ml-4'>
                      {(isSubmitLoading && choice == menu.inactivity) && <BeatLoader/>}
                      <button disabled={isSubmitLoading && choice == menu.inactivity} type='submit' className='btn btn-primary'>Enregistrer</button>
                    </div>
                  </div>
                </form>
              </Wrapper>
            </div>
          </div>
        </>
      
      }
    </Layout>
  )
}

export default SessionCreation
