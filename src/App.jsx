import React from 'react';
import { AppProvider } from './state/AppState.jsx';
import { DonorSurface } from './donor/DonorSurface.jsx';
import { TweaksPanel } from './components/Tweaks.jsx';

export default function App() {
  return (
    <AppProvider>
      <DonorSurface />
      <TweaksPanel />
    </AppProvider>
  );
}
