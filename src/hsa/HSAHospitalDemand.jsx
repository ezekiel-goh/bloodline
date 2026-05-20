import React from 'react';
import { BL } from '../styles/tokens.js';
import { W, Tag, Btn, BloodChip } from '../components/primitives.jsx';
import { useApp } from '../state/AppState.jsx';

export function HSAHospitalDemand() {
  const { s, set } = useApp();

  return (
    <div style={{ padding: '20px 24px', overflowY: 'auto', height: '100%' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: BL.sans, fontSize: 22, fontWeight: 600, color: BL.ink, letterSpacing: -0.3 }}>
          Hospital demand
        </div>
        <div style={{ fontFamily: BL.sans, fontSize: 13, color: BL.muted, marginTop: 4 }}>
          Live demand signals from hospital portals. Emergency draws trigger surge consideration.
        </div>
      </div>

      {/* Emergency inbox */}
      {s.hsaInbox.length > 0 && (
        <W pad={16} style={{ marginBottom: 14, background: BL.surgeBg, border: `1px solid ${BL.surge}55` }}>
          <Tag color={BL.surge}>NEW · EMERGENCY DRAW REQUEST</Tag>
          {s.hsaInbox.map((r, i) => (
            <div key={i} style={{ marginTop: 10, paddingTop: 10, borderTop: i ? `1px solid ${BL.surge}33` : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontFamily: BL.sans, fontSize: 14, color: BL.ink, fontWeight: 600 }}>
                    {r.hospital} · {r.type} {r.units} units
                  </div>
                  <div style={{ fontFamily: BL.mono, fontSize: 11, color: BL.muted, marginTop: 4 }}>
                    {r.reason} · {r.time}
                  </div>
                </div>
                <BloodChip type={r.type} need="critical" size="md" />
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                <Btn size="sm" style={{ background: BL.surge, border: 'none', color: '#fff' }}
                  onClick={() => set({ hsaTab: 'surge', hsaToast: `Pre-filled Surge for ${r.type}` })}>
                  Open Surge activator
                </Btn>
                <Btn size="sm" variant="outline" color={BL.ink}
                  onClick={() => set({ hsaToast: 'Dispatched 12 units from Bloodbank@HSA' })}>
                  Dispatch from reserve
                </Btn>
                <Btn size="sm" variant="ghost" color={BL.muted}
                  onClick={() => set((cur) => ({ hsaInbox: cur.hsaInbox.filter((_, j) => j !== i) }))}>
                  Dismiss
                </Btn>
              </div>
            </div>
          ))}
        </W>
      )}

      {/* Hospital status grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { h: 'NUH',   stock: '4.2d', tone: 'critical', sub: 'O− critical · 14 units' },
          { h: 'SGH',   stock: '6.1d', tone: 'urgent',   sub: 'B− low · scheduled cardiac' },
          { h: 'TTSH',  stock: '8.4d', tone: 'low',      sub: 'stable · routine demand' },
          { h: 'CGH',   stock: '11.2d', tone: 'ok',      sub: 'no concerns' },
          { h: 'KKH',   stock: '9.8d', tone: 'ok',       sub: 'plasma steady' },
          { h: 'NTFGH', stock: '7.1d', tone: 'low',      sub: 'A+ dipping' },
        ].map((h, i) => (
          <W key={i} pad={14}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Tag color={BL.muted}>{h.h}</Tag>
                <div style={{ fontFamily: BL.mono, fontSize: 22, fontWeight: 600, color: BL.ink, marginTop: 4, letterSpacing: -0.4 }}>
                  {h.stock}
                </div>
                <Tag color={BL.muted}>OF DEMAND COVERAGE</Tag>
              </div>
              <Tag color={BL.need[h.tone].fg} bg={BL.need[h.tone].bg}>{BL.need[h.tone].label}</Tag>
            </div>
            <div style={{ fontFamily: BL.sans, fontSize: 12, color: BL.ink2, marginTop: 10, lineHeight: 1.5 }}>{h.sub}</div>
          </W>
        ))}
      </div>
    </div>
  );
}
