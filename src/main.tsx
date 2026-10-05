import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BrandProvider } from './context/BrandContext';
import { SensorProvider } from './context/SensorContext';
import { LanguageProvider } from './context/LanguageContext';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker with auto-update for offline clinical reliability
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('COREMED: New clinical cache version available.');
  },
  onOfflineReady() {
    console.log('COREMED: Offline clinical caching active for remote medical facilities.');
  },
});

createRoot(document.getElementById('root')!).render(
  <LanguageProvider>
    <BrandProvider>
      <SensorProvider>
        <App />
      </SensorProvider>
    </BrandProvider>
  </LanguageProvider>
);
