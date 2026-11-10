import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { lua } from '@lua-ai-global/app-client';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
void lua.start();
