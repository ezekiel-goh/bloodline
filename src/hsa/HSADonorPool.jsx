import React from 'react';
import { BL, BLOOD_TYPES } from '../styles/tokens.js';
import { W, Tag, H, BloodChip } from '../components/primitives.jsx';

const COHORTS = [
  { c: '2026 Q1', size: 1820, m1: 95, m3: 76, m6: 58, m12: 42 },
  { c: '2025 Q4', size: 2140, m1: 92, m3: 71, m6: 54, m12: 38 },
  { c: '2025 Q3', size: 1980, m1: 89, m3: 68, m6: 49, m12: 33 },
  { c: '2025 Q2', size: 2200, m1: 91, m3: 70, m6: 52, m12: 36 },
  { c: '2025 Q1', size: 1740, m1: 87, m3: 64, m6: 46, m12: 31 },
];

export function HSADonorPool() {
  return (
    <div style={{ padding: '20px 24px', overflowY: 'auto', height: '100%' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: BL.sans, fontSize: 22, fontWeight: 600, color: BL.ink, letterSpacing: -0.3 }}>
          Donor pool · 184,210 total
        </div>
        <div style={{ fontFamily: BL.sans, fontSize: 13, color: BL.muted, marginTop: 4 }}>
          Active retention curve vs at-risk segment. Filter to plan retention sends.
        </div>
      </div>

      {/* Funnel KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 14 }}>
        {[
          { l: 'ACTIVE · ≤12mo',    v: '72,440', s: '39% of pool',         tone: 'ok'       },
          { l: 'DORMANT · 12–24mo', v: '54,180', s: '29% — reactivate',    tone: 'low'      },
          { l: 'AT-RISK · 24mo+',   v: '38,920', s: '21% — churn imminent', tone: 'urgent'  },
          { l: 'LAPSED · 36mo+',    v: '18,670', s: '10% — archive',       tone: 'critical' },
        ].map((k, i) => (
          <W key={i} pad={14}>
            <Tag color={BL.need[k.tone].fg} bg={BL.need[k.tone].bg}>{k.l}</Tag>
            <div style={{ fontFamily: BL.mono, fontSize: 24, fontWeight: 600, color: BL.ink, marginTop: 6, letterSpacing: -0.6 }}>{k.v}</div>
            <div style={{ fontFamily: BL.sans, fontSize: 11, color: BL.muted, marginTop: 2 }}>{k.s}</div>
          </W>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Cohort retention table */}
        <W pad={16}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <H size={14}>Cohort retention · % returning</H>
            <Tag color={BL.muted}>M1 · M3 · M6 · M12</Tag>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '90px repeat(4, 1fr) 60px', rowGap: 4, columnGap: 8, alignItems: 'center' }}>
            <Tag color={BL.muted}>COHORT</Tag>
            {['M1', 'M3', 'M6', 'M12'].map((m) => (
              <Tag key={m} color={BL.muted} style={{ textAlign: 'center' }}>{m}</Tag>
            ))}
            <Tag color={BL.muted} style={{ textAlign: 'right' }}>SIZE</Tag>
            {COHORTS.map((co) => (
              <React.Fragment key={co.c}>
                <span style={{ fontFamily: BL.sans, fontSize: 12, color: BL.ink }}>{co.c}</span>
                {[co.m1, co.m3, co.m6, co.m12].map((v, i) => {
                  const level = v >= 80 ? 'ok' : v >= 60 ? 'low' : v >= 40 ? 'urgent' : 'critical';
                  const c = BL.need[level];
                  return (
                    <div key={i} style={{
                      height: 26, background: c.bg, color: c.fg,
                      border: `1px solid ${c.fg}22`, borderRadius: 3,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: BL.mono, fontSize: 11, fontWeight: 600,
                    }}>{v}%</div>
                  );
                })}
                <span style={{ fontFamily: BL.mono, fontSize: 11, color: BL.muted, textAlign: 'right' }}>
                  {co.size.toLocaleString()}
                </span>
              </React.Fragment>
            ))}
          </div>
        </W>

        {/* Blood type mix */}
        <W pad={16}>
          <H size={14}>Mix by blood type</H>
          <div style={{ marginTop: 10 }}>
            {BLOOD_TYPES.map(({ t, n }, i) => {
              const w = [9, 38, 4, 25, 2, 14, 1, 7][i];
              return (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
                  <BloodChip type={t} need={n} size="sm" />
                  <div style={{ flex: 1, height: 6, background: BL.hair, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${w * 1.8}%`, height: '100%', background: BL.ink }} />
                  </div>
                  <span style={{ fontFamily: BL.mono, fontSize: 11, color: BL.muted, width: 36, textAlign: 'right' }}>{w}%</span>
                </div>
              );
            })}
          </div>
          <Tag color={BL.muted} style={{ marginTop: 12, display: 'block' }}>VS NATIONAL POP. · O− IS 4.2% LOW</Tag>
        </W>
      </div>

      {/* Retention campaigns */}
      <W pad={16}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <H size={14}>Retention campaigns · scheduled</H>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: BL.sans, fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BL.hair}`, color: BL.muted, textAlign: 'left' }}>
              {['CAMPAIGN', 'SEGMENT', 'SIZE', 'CHANNEL', 'SEND', 'STATUS', 'EXPECTED LIFT'].map((h) => (
                <th key={h} style={{ padding: '8px 6px', fontFamily: BL.mono, fontSize: 10, fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Q2 reactivation · O−/B−', 'At-risk · O− or B−',       '8,420', 'Push + SMS', 'Mon 19 May 10:00', 'Scheduled',        '+2.1pp M3'],
              ['Birthday bridge',          'Dormant · birthday ±7d',   '1,240', 'Email',      'Daily',             'Live',             '+1.4pp M3'],
              ['NSF re-enrolment',         'Lapsed · age 21–24',       '6,180', 'Push',       'Thu 22 May 14:00', 'Draft',            '+3.8pp M6'],
              ['Workplace re-light',       'Drive captains',           '180',   'WhatsApp',   'Fri 23 May 09:00', 'Pending approval', '+18 drives'],
            ].map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${BL.hair}` }}>
                {r.map((cell, j) => (
                  <td key={j} style={{ padding: '10px 6px', color: j === 0 ? BL.ink : BL.ink2,
                    fontFamily: (j === 2 || j === 6) ? BL.mono : BL.sans }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </W>
    </div>
  );
}
