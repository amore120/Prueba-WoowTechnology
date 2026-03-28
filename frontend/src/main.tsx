/**
 * @file main.tsx
 * @description Punto de entrada de la aplicación React.
 *
 * Monta el componente App en el elemento #root del index.html.
 * StrictMode activa advertencias adicionales de React en desarrollo.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
