import React, { useEffect, useState } from 'react'
import Layout from '../../../template/Layout'
import Wrapper from '../../../component/Wrapper'
import Input from '../../../component/Input'
import httpClient, { encodeData, writeErrors } from '../../../hooks/httpClient'
import myRoute from '../../../hooks/myRoute'
import noNetWork, { Toast, problemOccur } from '../../../component/AlertReport'
import { BeatLoader } from 'react-spinners'
import { HttpStatusCode } from 'axios'

const TentativeLoginCreation = () => {

  const [data, setData] = useState({ temps: ""});
  const [error, setError] = useState({ temps: undefined })


  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);


  useEffect(() => {
    httpClient.get(myRoute.attemptConnectionSetting)
    .then(res => {
      setIsLoading(false);
      setData({
        temps: res.data
      });
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    setError(writeErrors({...error}, {}));
    httpClient.post(myRoute.updateSettings, encodeData({
      valeur: data.temps,
      code: 'attempt_connection'
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
          setError({temps: err.response.data.valeur ??  err.response.data.code});
        }else{
          problemOccur();
        }
      }
    })

  }
  return (
    <Layout title='Nombre de tentative de connexion'>
      {isLoading == true && <div className='text-center'>
        <BeatLoader/>
      </div>}
      {isLoading == false && <div className="row">
        <div className="col-md-10 col-lg-8">
          <Wrapper  title='Nombre de tentative de connexion'>
            <form onSubmit={onSubmit} >
              <p>
              Veuillez définir le nombre de tentatives de connexion. Le nombre de tentatives permettra de verrouiller le compte de l'utilisateur 
              lorsqu'il entrera des informations incorrectes après plusieurs tentatives.
              </p>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <Input label='Nombre de tentatives' type='text' name='temps' data={data} update={setData} report={error.temps} />

                <div className='mb-3 ml-4'>
                  {isSubmitLoading == true && <BeatLoader/>}
                  <button disabled={isSubmitLoading} type='submit' className='btn btn-primary'>Enregistrer</button>
                </div>
              </div>
            </form>
          </Wrapper>
        </div>
      </div>}
    </Layout>
  )
}

export default TentativeLoginCreation
