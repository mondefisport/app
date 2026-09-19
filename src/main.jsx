import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://a95f1fd08183bf5b472c78eb3e4a4ea5@o4512113753391104.ingest.de.sentry.io/4512113773903952",
  environment: import.meta.env.MODE,
  enabled: import.meta.env.PROD, // n'envoie rien en dev local, seulement en production
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<p>Un problème est survenu. Rechargez la page.</p>}>
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>,
)