import React from 'react';
import { AppProvider, useApp } from './state/AppState.jsx';
import { DonorSurface } from './donor/DonorSurface.jsx';
import { HSAConsole } from './hsa/HSAConsole.jsx';
import { TweaksPanel } from './components/Tweaks.jsx';
import { FlowMap } from './components/FlowMap.jsx';

export default function App() {
  return (
    <AppProvider>
      <AppRoot />
      <TweaksPanel />
    </AppProvider>
  );
}

function AppRoot() {
  const { s } = useApp();
  if (s.showFlowMap) return <FlowMap />;
  if (s.view === 'hsa') return <HSAConsole />;
  return <DonorSurface />;
}
