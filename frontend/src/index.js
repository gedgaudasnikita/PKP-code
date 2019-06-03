import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import 'semantic-ui-css/semantic.min.css'
import App from './App';
import * as serviceWorker from './serviceWorker';

localStorage.setItem('useRealBackend', 'true');

const storedBackendUrl = localStorage.getItem('backendUrl');
window.backendUrl = storedBackendUrl || 'http://localhost:8080/backend_war_exploded/api';

window.mockBackendServer = () => {
  localStorage.removeItem('useRealBackend');
  localStorage.removeItem('user');
  window.location.reload(); 
}

window.unmockBackendServer = (realBackendUrl) => {
  const storedBackendUrl = localStorage.getItem('backendUrl');
  window.backendUrl = realBackendUrl || storedBackendUrl || 'http://localhost:8080/backend_war_exploded/api';
  localStorage.setItem('backendUrl', window.backendUrl);
  localStorage.setItem('useRealBackend', 'true');
  localStorage.removeItem('user');
  window.location.reload(); 
}

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
