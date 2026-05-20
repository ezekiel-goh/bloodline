import React from 'react';
import { BL } from '../styles/tokens.js';
import { Tag } from '../components/primitives.jsx';
import { useApp } from '../state/AppState.jsx';
import { HSAForecast } from './HSAForecast.jsx';
import { HSASurgeActivator } from './HSASurge.jsx';
import { HSADonorPool } from './HSADonorPool.jsx';
import { HSADriveQueue } from './HSADriveQueue.jsx';
import { HSAHospitalDemand } from './HSAHospitalDemand.jsx';

const NAV = [
  { k: 'forecast',  l: 'Forecast'        },
  { k: 'surge',     l: 'Surge Mode'      },
  { k: 'donors',    l: 'Donor pool'      },
  { k: 'drives',    l: 'Drive queue'     },
  { k: 'hospitals', l: 'Hospital demand' },
  { k: 'reports',   l: 'Reports'         },
];

export function HSAConsole() {
  const { s } = useApp();
  return (
    <div style={{ width: '100vw', height: '100vh', background: BL.paper, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <ConsoleShell />
      {s.hsaToast && <HSAToast msg={s.hsaToast} />}
    </div>
  );
}

function ConsoleShell() {
  const { s, set } = useApp();

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: BL.sans, position: 'relative' }}>
      {/* Left rail */}
      <div style={{ width: 200, background: '#1a1917', color: '#e9e6e0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '18px 16px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 18, height: 18, borderRadius: 3, background: BL.red }} />
            <span style={{ fontFamily: BL.sans, fontSize: 14, fontWeight: 600 }}>BloodLine</span>
          </div>
          <div style={{ fontFamily: BL.mono, fontSize: 9, color: '#8e8a82', marginTop: 4, letterSpacing: 0.8 }}>
            HSA OPERATIONS · PROD
          </div>
        </div>

        <div style={{ padding: 8, flex: 1 }}>
          {NAV.map((n) => (
            <button key={n.k} onClick={() => set({ hsaTab: n.k })} style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '8px 10px 8px 12px', borderRadius: 4, marginBottom: 2,
              background: s.hsaTab === n.k ? '#2a2723' : 'transparent',
              fontFamily: BL.sans, fontSize: 13,
              color: s.hsaTab === n.k ? '#fff' : '#bdb8b0',
              borderLeft: s.hsaTab === n.k ? `2px solid ${BL.red}` : '2px solid transparent',
              cursor: 'pointer', border: 'none', position: 'relative',
            }}>
              {n.l}
              {n.k === 'hospitals' && s.hsaInbox.length > 0 && (
                <span style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  fontFamily: BL.mono, fontSize: 9, color: '#fff', background: BL.surge,
                  borderRadius: 8, padding: '1px 6px', fontWeight: 600,
                }}>{s.hsaInbox.length}</span>
              )}
            </button>
          ))}
        </div>

        <div style={{ padding: 12, borderTop: '1px solid #2a2723', fontFamily: BL.mono, fontSize: 10, color: '#8e8a82' }}>
          MODE · <span style={{ color: s.surgeActive ? BL.surge : '#bdb8b0', fontWeight: 600 }}>
            {s.surgeActive ? 'SURGE' : 'PREDICT'}
          </span>
          <br />OPS · GREEN · 3 ACTIVE
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ height: 48, borderBottom: `1px solid ${BL.hair}`, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontFamily: BL.mono, fontSize: 10, color: BL.muted, letterSpacing: 0.8 }}>
              HSA · NATIONAL OPERATIONS
            </span>
            <span style={{ color: BL.faint }}>/</span>
            <span style={{ fontFamily: BL.mono, fontSize: 10, color: BL.ink, letterSpacing: 0.4 }}>
              {(NAV.find((n) => n.k === s.hsaTab)?.l || '').toUpperCase()}
            </span>
            {s.surgeActive && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 6,
                padding: '3px 8px', background: BL.surgeBg, borderRadius: 4, border: `1px solid ${BL.surge}55` }}>
                <div style={{ width: 6, height: 6, borderRadius: 3, background: BL.surge, animation: 'bl-pulse 2s infinite' }} />
                <Tag color={BL.surge}>SURGE LIVE</Tag>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Tag color={BL.muted}>
              {new Date().toLocaleString('en-SG', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </Tag>
            <div style={{ width: 1, height: 16, background: BL.hair }} />
            <span style={{ fontFamily: BL.sans, fontSize: 12, color: BL.ink }}>Dr. R. Lim · HSA</span>
            <div style={{ width: 28, height: 28, borderRadius: 14, background: BL.fill, border: `1px solid ${BL.hair}` }} />
          </div>
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {s.hsaTab === 'forecast'  && <HSAForecast />}
          {s.hsaTab === 'surge'     && <HSASurgeActivator />}
          {s.hsaTab === 'donors'    && <HSADonorPool />}
          {s.hsaTab === 'drives'    && <HSADriveQueue />}
          {s.hsaTab === 'hospitals' && <HSAHospitalDemand />}
          {s.hsaTab === 'reports'   && <Placeholder name="Reports" />}
        </div>
      </div>
    </div>
  );
}

function Placeholder({ name }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Tag color={BL.muted}>{name.toUpperCase()}</Tag>
      <div style={{ fontFamily: BL.sans, fontSize: 18, color: BL.faint, marginTop: 6 }}>
        Module not implemented in this prototype.
      </div>
    </div>
  );
}

function HSAToast({ msg }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      padding: '12px 18px', background: BL.ink, color: '#fff', borderRadius: 8,
      fontFamily: BL.sans, fontSize: 13, fontWeight: 500, zIndex: 200,
      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
      animation: 'bl-slideup 0.2s ease',
    }}>{msg}</div>
  );
}
