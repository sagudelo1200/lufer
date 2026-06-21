import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
// Register service worker for PWA (vite-plugin-pwa virtual module)
import { registerSW } from 'virtual:pwa-register';
import { ProveedorApp } from './contexto/ContextoApp';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <ProveedorApp>
        <App />
      </ProveedorApp>
    </HashRouter>
  </StrictMode>,
);

// register service worker with default options
try {
  registerSW();
} catch (err) {
  console.debug('PWA registerSW failed', err);
}
