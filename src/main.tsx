import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/home/HomePage.tsx'
import './index.css'

// Configuración para extensiones de desarrollo
if (import.meta.env.DEV) {
  // Suprimir errores de extensiones en desarrollo
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = (...args) => {
    const message = args[0];
    if (typeof message === 'string' && (
      message.includes('chrome-extension://') ||
      message.includes('SecurityError') ||
      message.includes('Failed to read') ||
      message.includes('Minified React error #31') ||
      message.includes('inspector.b9415ea5.js')
    )) {
      return; // No mostrar errores de extensiones
    }
    originalError.apply(console, args);
  };
  
  console.warn = (...args) => {
    const message = args[0];
    if (typeof message === 'string' && (
      message.includes('chrome-extension://') ||
      message.includes('Unload event listeners are deprecated') ||
      message.includes('inspector.b9415ea5.js')
    )) {
      return; // No mostrar warnings de extensiones
    }
    originalWarn.apply(console, args);
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
