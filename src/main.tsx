import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { BrandProvider } from './context/BrandContext';
import { SensorProvider } from './context/SensorContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <BrandProvider>
    <SensorProvider>
      <App />
    </SensorProvider>
  </BrandProvider>
);

