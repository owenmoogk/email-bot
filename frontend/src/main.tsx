import '@mantine/core/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router } from 'react-router-dom';
import { App } from './components/App';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Router>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Router>
  </StrictMode>
);
