// Renderer entry point
import { createRoot } from 'react-dom/client';
import { StoreProvider } from './contexts/StoreContext';
import App from './App';
import './styles/globals.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <StoreProvider>
    <App />
  </StoreProvider>
);
