import React, { createContext, useContext, useEffect, useState } from 'react';
import { BL } from '../styles/tokens.js';

const AppCtx = createContext(null);
export const useApp = () => useContext(AppCtx);

export const initialState = {
  surgeActive: false,
  surgeActivatedAt: null,
  surgeSnoozed: false,

  donorTab: 'home',
  donorScreen: null,
  homeVariant: 'A',
  selectedSlot: null,
  bookedSlot: null,
  toast: null,
  driveRsvps: {},
  notif: { surgeOwn: 'Always', surgeCompat: 'Within 5 km', drives: 'On', weekly: 'Sundays', cap: 'On' },
  selectedType: null,

  mobStep: 1,
  mobOrg: 'DBS · Group Tech',
  mobTime: { d: 'Tomorrow', t: 'Lunch · 11:30–14:00', cap: 'Mobile unit on-site' },

  // View toggle: 'donor' | 'hsa'
  view: 'donor',
  showFlowMap: false,

  // HSA console state
  hsaTab: 'forecast',
  hsaForecastView: 'map',
  hsaToast: null,
  hsaInbox: [],
  surgeConfig: {
    types: ['O−'],
    tiers: [true, true, false],
    channels: { push: true, sms: true, whatsapp: false, email: false },
  },
};

export function AppProvider({ children }) {
  const [s, setS] = useState(initialState);
  const set = (patch) =>
    setS((cur) => ({ ...cur, ...(typeof patch === 'function' ? patch(cur) : patch) }));

  useEffect(() => {
    if (!s.toast) return;
    const id = setTimeout(() => set({ toast: null }), 2400);
    return () => clearTimeout(id);
  }, [s.toast]);

  useEffect(() => {
    if (!s.hsaToast) return;
    const id = setTimeout(() => set({ hsaToast: null }), 2800);
    return () => clearTimeout(id);
  }, [s.hsaToast]);

  useEffect(() => {
    if (s.surgeActive) {
      set({ donorTab: 'home', donorScreen: null, surgeSnoozed: false });
    }
  }, [s.surgeActive]);

  return <AppCtx.Provider value={{ s, set }}>{children}</AppCtx.Provider>;
}

export function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 76,
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '10px 16px',
        background: BL.ink,
        color: '#fff',
        borderRadius: 8,
        fontFamily: BL.sans,
        fontSize: 12,
        fontWeight: 500,
        zIndex: 30,
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        whiteSpace: 'nowrap',
        maxWidth: 320,
        textAlign: 'center',
      }}
    >
      {msg}
    </div>
  );
}
