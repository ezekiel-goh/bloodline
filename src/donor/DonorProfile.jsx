import React from 'react';
import { BL } from '../styles/tokens.js';
import { W, Tag, BloodChip } from '../components/primitives.jsx';
import { AppHeader } from '../components/shells.jsx';
import { useApp } from '../state/AppState.jsx';

const NOTIF_OPTIONS = {
  surgeOwn: ['Always', 'Within 15 km', 'Off'],
  surgeCompat: ['Within 5 km', 'Within 15 km', 'Off'],
  drives: ['On', 'Weekly digest', 'Off'],
  weekly: ['Sundays', 'Mondays', 'Off'],
  cap: ['On', 'Off'],
};

export function DonorProfile() {
  const { s, set } = useApp();
  const cycleVal = (cur, opts) => opts[(opts.indexOf(cur) + 1) % opts.length];

  return (
    <>
      <AppHeader title="You" />
      <div style={{ padding: '0 16px 70px', overflowY: 'auto', height: 'calc(100% - 56px - 56px)' }}>
        <W pad={16} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                background: BL.fill,
                border: `1px solid ${BL.hair}`,
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: BL.sans, fontSize: 16, fontWeight: 600, color: BL.ink }}>Tan Wei Ming</div>
              <div style={{ fontFamily: BL.mono, fontSize: 10, color: BL.muted, marginTop: 2 }}>
                #SG-44182 · since 2021
              </div>
            </div>
            <BloodChip type="O−" need="critical" size="md" />
          </div>
          <div
            style={{
              marginTop: 14,
              padding: 10,
              background: BL.fill,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Tag color={BL.muted}>NEXT ELIGIBLE</Tag>
            <span style={{ fontFamily: BL.mono, fontSize: 12, color: BL.ink, fontWeight: 600 }}>Eligible now</span>
          </div>
        </W>

        <W pad={12} style={{ marginBottom: 12 }}>
          <Tag color={BL.muted}>SQUADS</Tag>
          {[
            { l: 'DBS · Group Tech', rank: '#3', total: '42 donations' },
            { l: 'NUS Alumni · CompSci', rank: '#14', total: '180 donations' },
            { l: 'Tampines East RC', rank: '#7', total: '64 donations' },
          ].map((sq, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderTop: i ? `1px solid ${BL.hair}` : 'none',
              }}
            >
              <div>
                <div style={{ fontFamily: BL.sans, fontSize: 13, color: BL.ink, fontWeight: 500 }}>{sq.l}</div>
                <div style={{ fontFamily: BL.mono, fontSize: 10, color: BL.muted, marginTop: 2 }}>{sq.total}</div>
              </div>
              <span style={{ fontFamily: BL.mono, fontSize: 14, color: BL.ink, fontWeight: 600 }}>{sq.rank}</span>
            </div>
          ))}
        </W>

        <W pad={12} style={{ marginBottom: 12 }}>
          <Tag color={BL.muted}>STREAK</Tag>
          <div
            style={{
              fontFamily: BL.sans,
              fontSize: 22,
              fontWeight: 600,
              color: BL.ink,
              marginTop: 4,
              letterSpacing: -0.4,
            }}
          >
            5 donations in a row
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                style={{ flex: 1, height: 28, borderRadius: 3, background: i <= 5 ? BL.ink : BL.fill }}
              />
            ))}
          </div>
        </W>

        <W pad={12}>
          <Tag color={BL.muted}>NOTIFICATIONS · TAP TO CYCLE</Tag>
          {[
            ['Surge alerts (your type)', 'surgeOwn'],
            ['Surge alerts (compatible)', 'surgeCompat'],
            ['Drive reminders', 'drives'],
            ['Weekly recap', 'weekly'],
            ['Cap: max 3 / week', 'cap'],
          ].map(([l, k], i) => (
            <button
              key={k}
              onClick={() =>
                set((cur) => ({
                  notif: { ...cur.notif, [k]: cycleVal(cur.notif[k], NOTIF_OPTIONS[k]) },
                }))
              }
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                padding: '10px 0',
                borderTop: i ? `1px solid ${BL.hair}` : 'none',
                border: 'none',
                background: 'none',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontFamily: BL.sans, fontSize: 13, color: BL.ink }}>{l}</span>
              <span style={{ fontFamily: BL.mono, fontSize: 11, color: BL.muted }}>{s.notif[k]} ▸</span>
            </button>
          ))}
        </W>
      </div>
    </>
  );
}
