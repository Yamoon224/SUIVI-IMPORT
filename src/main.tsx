import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Layout from './pages/template/Layout';
import 'primereact/resources/themes/lara-light-blue/theme.css'; // Thème
import 'primereact/resources/primereact.min.css'; // Composants PrimeReact
import 'primeicons/primeicons.css'; // Icônes
import 'primeflex/primeflex.css'; // Grid PrimeFlex

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
   <BrowserRouter>
      <App/>
   </BrowserRouter>
  </React.StrictMode>,
)
