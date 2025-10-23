import { HttpStatusCode } from 'axios';
import React, { useEffect, useState } from 'react';
import Input from '../../component/Input';
import httpClient, { encodeData, writeErrors } from '../../hooks/httpClient';
import myRoute from '../../hooks/myRoute';
import image  from './asset/login-bg.jpg';
import logo from './asset/bdu.jpg';
import BeatLoader from 'react-spinners/BeatLoader';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import noNetWork, { Toast, problemOccur } from '../../component/AlertReport';

const Login = ({}) => {

   useEffect(() => {
      const token = localStorage.getItem("authToken");
      if(token != null){
         setIsAuthenticated(true);
      }
   }, []);

   const [input, setInput] = useState({
      username: '',
      password: '',
   });

   const[errors, setErrors] = useState({
      username: undefined,
      password: undefined,
      credential_error: undefined
   });

   const [passwordInput, setPasswordInput] = useState({
      old: '',
      password: ''
   });
   const [errorPassword, setErrorPassword] = useState({
      password: undefined
   });

   const [noticePassword, setNoticePassword] = useState(null);
    
   const[isLoading, setIsLoading] = useState(false);
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [notice, setNotice] = useState(null);


   const onSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      httpClient.post(myRoute.login, encodeData(input))
      .then(res => {
         console.log(res?.data);
         const token = res.data.token;
         localStorage.setItem("authToken", token);
         setIsAuthenticated(true);
         setIsLoading(false);
         
      })
      .catch(err => {
         setIsLoading(false);
         if(err.response == undefined){
            noNetWork();
         }else{
            if(err.response.status == HttpStatusCode.BadRequest){
               setErrors(writeErrors({...errors}, err.response.data));
            }
            else if(err.response.status == HttpStatusCode.Forbidden){
               setNoticePassword(err.response.data.unchanged_password);
               const token = err.response.data.token;
               localStorage.setItem("authToken", token);
               
            }
            else{
               problemOccur();
            }
         }
         
      })
   }

   const onChangePassword = (e: React.FormEvent) => {
      e.preventDefault();
      setErrorPassword({
         password: undefined
      })
      if(passwordInput.old.length == 0 || passwordInput.password.length == 0  || (passwordInput.old != passwordInput.password)){
         return;
      }
      setIsLoading(true);
      const tokenAuth = localStorage.getItem("authToken");
      httpClient.post(myRoute.changePasswordAtLogin, encodeData(passwordInput), {
         headers: {
            "Authorization": "Bearer "+ tokenAuth
         }
      })
      .then(res => {
         setIsLoading(false);
         Toast.fire();
         setIsAuthenticated(true);
      })
      .catch(err => {
         setIsLoading(false);
         if(err.response == undefined){
            noNetWork();
         }else{
            if(err.response.status == HttpStatusCode.BadRequest){
               setErrorPassword(err.response.data);
            }
            else if(err.response.status == HttpStatusCode.NotFound){
               setNoticePassword(null);
               setNotice(err.response.data);
            }
            
         }
      })
   }

   const onBack = () => {
      setNoticePassword(null);
      setErrorPassword({
         password: undefined
      })
      setPasswordInput({
         old: '',
         password: ''
      })
      setInput({
         password: '',
         username: ''
      })
   }

   if(isAuthenticated){
      return <Navigate to={"/suivi-import/"} />
   }

    return(
        <>
         <div className="full_container" style={{
            background: `url(${image}) no-repeat center center fixed`,
            backgroundSize: 'cover', width: '100%', height: '100%',
         }}>
            <div className="container">
               <div className="center verticle_center full_height">
                  <div className="login_section" style={{ background: 'rgba(255,255,255, 0.85)' }}>
                  {noticePassword != null && <div>
                     <button type='button' className='btn btn-primary active' onClick={() => onBack()}><i className='fa fa-arrow-left'></i> Retour</button>   
                  </div>}
                     <div className="logo_login-" >
                        <div className="center mt-3">
                           <img width="210" height="120" src={logo} alt="SO'3G" />
                        </div>
                     </div>
                     {noticePassword == null && <div className="login_form" >
                        
                        {errors.credential_error != undefined && <div className='alert alert-danger'>
                           {errors.credential_error}
                        </div>}
                        {notice != null && <div className='alert alert-danger'>{notice}</div>}
                        <form onSubmit={onSubmit}>
                           <Input label='Nom utilisateur' report={errors.username} placeholder='Ex: Kouakou' name='username' data={input}  update={setInput}/>
                           <Input label='Mot de passe' report={errors.password} placeholder='Mot de passe' name='password' type='password' data={input}  update={setInput}/>
                          {isLoading == true && <div className='text-center'>
                              <BeatLoader />
                           </div>}
                           <div className='text-center'>
                              <button type='submit' className='btn btn-primary'>Se connecter</button>
                           </div>
                           
                        </form>
                     </div>}
                     {noticePassword != null && <div className="login_form" >
                        <h5 className='alert alert-light text-center'>
                           Premiere session ou mot de passe reinitialise
                        </h5>
                        {noticePassword != null && <div className='alert alert-danger'>
                           {noticePassword}
                        </div>}
                        <form onSubmit={onChangePassword}>
                           {passwordInput.old !=passwordInput.password && <div className='text-danger'>
                              Les mots de passes ne sont pas identique  
                           </div>}
                           <Input label='Nouveau mot de passe'  placeholder='Mot de passe' name='old' data={passwordInput}  update={setPasswordInput} type='password'/>
                           <Input label='Confirmer le mot de passe' report={errorPassword.password} placeholder='Mot de passe' name='password' type='password' data={passwordInput}  update={setPasswordInput}/>
                          {isLoading == true && <div className='text-center'>
                              <BeatLoader />
                           </div>}
                           <div className='text-center'>
                              <button disabled={passwordInput.old !=passwordInput.password} type='submit' className='btn btn-primary'>Se connecter</button>
                           </div>
                           
                        </form>
                     </div>}
                  </div>
               </div>
            </div>
         </div>
      </>
    )
};
export default Login;