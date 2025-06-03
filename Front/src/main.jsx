import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ApolloProvider } from '@apollo/client';
import client from './apollo/client.js';
import { BrowserRouter } from 'react-router-dom'; // ← ✅ AJOUT ICI

// 🎨 Styles
import 'primereact/resources/themes/lara-light-blue/theme.css'; 
import 'primereact/resources/primereact.min.css';                
import 'primeicons/primeicons.css';                              
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter> 
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
