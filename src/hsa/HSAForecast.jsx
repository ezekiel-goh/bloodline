import React from 'react';
import { BL, BLOOD_TYPES } from '../styles/tokens.js';
import { W, Tag, Btn, BloodChip, H, FanChart, SGMap } from '../components/primitives.jsx';
import { useApp } from '../state/AppState.jsx';

const REGIONS = [
  { x: 96,  y: 110, need: 'low',      r: 18, label: 'NW' },
  { x: 160, y: 102, need: 'urgent',   r: 22, label: 'N'  },
  { x: 220, y: 108, need: 'critical', r: 26, label: 'NE' },
  { x: 130, y: 138, need: 'low',      r: 16, label: 'W'  },
  { x: 200, y: 132, need: 'urgent',   r: 20, label: 'C'  },
  { x: 270, y: 130, need: 'critical', r: 24, label: 'E'  },
  { x: 320, y: 132, need: 'urgent',   r: 18, label: 'SE' },
];

const MATRIX = [
  [3, 3, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1],
  [2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1],
  [2, 2, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1],
  [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
const RISK_KEY = ['ok', 'low', 'urgent', 'critical'];

export function HSAForecast() {
  const { s, set } = useApp();

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Main panel */}
      <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: BL.sans, fontSize: 22, fontWeight: 600, color: BL.ink, letterSpacing: -0.3 }}>
              14-day shortage forecast
            </div>
            <div style={{ fontFamily: BL.sans, fontSize: 13, color: BL.muted, marginTop: 4 }}>
              Predicted probability of dropping below 3-day buffer · Bayesian model v4.2
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <Btn size="sm" variant={s.hsaForecastView === 'map' ? 'fill' : 'soft'}
              color={s.hsaForecastView === 'map' ? BL.ink : BL.muted}
              onClick={() => set({ hsaForecastView: 'map' })}>Map view</Btn>
            <Btn size="sm" variant={s.hsaForecastView === 'heatmap' ? 'fill' : 'soft'}
              color={s.hsaForecastView === 'heatmap' ? BL.ink : BL.muted}
              onClick={() => set({ hsaForecastView: 'heatmap' })}>Heatmap</Btn>
            <Btn variant="outline" size="sm" color={BL.ink}
              onClick={() => set({ hsaToast: 'Export ready · forecast-2026-05-18.csv' })}>Export</Btn>
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
          {[
            { l: 'TYPES AT RISK',      v: '3 of 8', sub: 'O−, B−, A−',          tone: 'critical' },
            { l: 'PROB. SHORTAGE 7D',  v: '38%',    sub: '↑ 12 pts vs last wk', tone: 'urgent'  },
            { l: 'DONORS NEEDED 14D',  v: '4,820',  sub: 'baseline 3,100'                        },
            { l: 'INCOMING THIS WK',   v: '1,840',  sub: '↓ 8% vs target'                       },
          ].map((k, i) => (
            <W key={i} pad={14}>
              <Tag color={BL.muted}>{k.l}</Tag>
              <div style={{ fontFamily: BL.mono, fontSize: 26, fontWeight: 600, color: BL.ink, marginTop: 4, letterSpacing: -0.6 }}>{k.v}</div>
              <div style={{ fontFamily: BL.sans, fontSize: 11, marginTop: 2,
                color: k.tone === 'critical' ? BL.redInk : k.tone === 'urgent' ? BL.need.urgent.fg : BL.muted }}>
                {k.sub}
              </div>
            </W>
          ))}
        </div>

        {/* Map or heatmap */}
        {s.hsaForecastView === 'map' ? (
          <W pad={0} style={{ marginBottom: 16, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BL.hair}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <H size={14}>Regional shortage risk — O−</H>
                <Tag color={BL.muted}>radius ∝ DONOR DEFICIT · TINT ∝ 7-DAY PROBABILITY</Tag>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {BLOOD_TYPES.map(({ t, n }) => (
                  <BloodChip key={t} type={t} need={n} size="sm" selected={t === 'O−'} />
                ))}
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <SGMap w={760} h={280} dots={REGIONS} style={{ width: '100%', height: 'auto' }} />
              <div style={{ position: 'absolute', bottom: 10, right: 10, padding: 8,
                background: '#fffe', border: `1px solid ${BL.hair}`, borderRadius: 4,
                fontFamily: BL.mono, fontSize: 10 }}>
                <div style={{ color: BL.muted, marginBottom: 4 }}>7-DAY SHORTAGE PROBABILITY</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {['ok', 'low', 'urgent', 'critical'].map((k) => (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 5,
                        background: BL.need[k].bg, border: `1px solid ${BL.need[k].fg}` }} />
                      <span style={{ color: BL.ink }}>
                        {k === 'ok' ? '<10%' : k === 'low' ? '10–30%' : k === 'urgent' ? '30–60%' : '>60%'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </W>
        ) : (
          <HSAHeatmap />
        )}

        {/* Fan chart */}
        <W pad={16}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <H size={14}>Projected stock — O− · next 14 days</H>
              <Tag color={BL.muted}>BAND = 90% CONFIDENCE · DASHED LINE = 3-DAY BUFFER</Tag>
            </div>
            <div style={{ display: 'flex', gap: 12, fontFamily: BL.mono, fontSize: 10, color: BL.muted }}>
              <span>● actual</span><span>● P50</span><span>▒ P5–P95</span>
            </div>
          </div>
          <FanChart />
        </W>
      </div>

      {/* Right rail */}
      <div style={{ width: 300, borderLeft: `1px solid ${BL.hair}`, background: '#fdfcf8', padding: 20, overflowY: 'auto', flexShrink: 0 }}>
        <Tag color={BL.muted}>RECOMMENDED ACTIONS</Tag>
        <div style={{ marginTop: 8 }}>
          {[
            { tone: 'critical', t: 'Activate Surge Mode for O−',   sub: 'Projected 71% shortage probability by Friday.', go: () => set({ hsaTab: 'surge' }) },
            { tone: 'urgent',   t: 'Approve 3 pending NE drives',  sub: 'Tampines, Pasir Ris, Bedok — covers regional gap.', go: () => set({ hsaTab: 'drives' }) },
            { tone: 'low',      t: 'Pre-warn Bloodbank@Westgate',  sub: 'Stock will dip below 5d on Wed.', go: () => set({ hsaToast: 'Pre-warned Westgate · ack sent' }) },
          ].map((a, i) => (
            <div key={i} style={{ padding: 12, borderRadius: 6, marginBottom: 8,
              background: BL.need[a.tone].bg, border: `1px solid ${BL.need[a.tone].fg}33` }}>
              <Tag color={BL.need[a.tone].fg}>{BL.need[a.tone].label}</Tag>
              <div style={{ fontFamily: BL.sans, fontSize: 13, color: BL.ink, fontWeight: 500, marginTop: 4 }}>{a.t}</div>
              <div style={{ fontFamily: BL.sans, fontSize: 11, color: BL.muted, marginTop: 4, lineHeight: 1.4 }}>{a.sub}</div>
              <Btn variant="ghost" size="sm" color={BL.ink} style={{ padding: 0, marginTop: 6 }} onClick={a.go}>
                Take action →
              </Btn>
            </div>
          ))}
        </div>

        <Tag color={BL.muted} style={{ marginTop: 8, display: 'block' }}>MODEL CONFIDENCE</Tag>
        <W pad={12} style={{ marginTop: 6 }}>
          {[['7-day AUC', '0.91'], ['14-day AUC', '0.84'], ['Last retrain', '16 May 2026'], ['Features', '46 active']].map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0',
              borderTop: i ? `1px solid ${BL.hair}` : 'none' }}>
              <span style={{ fontFamily: BL.sans, fontSize: 12, color: BL.muted }}>{r[0]}</span>
              <span style={{ fontFamily: BL.mono, fontSize: 12, color: BL.ink, fontWeight: 600 }}>{r[1]}</span>
            </div>
          ))}
        </W>
      </div>
    </div>
  );
}

function HSAHeatmap() {
  const types = ['O−', 'O+', 'A−', 'A+', 'B−', 'B+', 'AB−', 'AB+'];
  const days = 14;
  return (
    <W pad={20} style={{ marginBottom: 16 }}>
      <H size={14}>14-day shortage heatmap</H>
      <div style={{ display: 'grid', gridTemplateColumns: `40px repeat(${days}, 1fr)`, gap: 4, alignItems: 'center', marginTop: 10 }}>
        <div />
        {Array.from({ length: days }).map((_, i) => (
          <div key={i} style={{ fontFamily: BL.mono, fontSize: 9, color: BL.muted, textAlign: 'center' }}>
            {i === 0 ? 'TODAY' : `+${i}d`}
          </div>
        ))}
        {types.map((t, ti) => (
          <React.Fragment key={t}>
            <BloodChip type={t} need={BLOOD_TYPES[ti].n} size="sm" />
            {MATRIX[ti].map((r, di) => {
              const c = BL.need[RISK_KEY[r]];
              return (
                <div key={di} style={{
                  height: 28, background: c.bg, border: `1px solid ${c.fg}22`,
                  borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: BL.mono, fontSize: 9, color: c.fg, fontWeight: 600,
                }}>
                  {r === 3 ? '>60' : r === 2 ? '40' : r === 1 ? '20' : '<10'}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 14, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${BL.hair}`, alignItems: 'center' }}>
        <Tag color={BL.muted}>RISK LEGEND · % PROB BELOW BUFFER</Tag>
        {['ok', 'low', 'urgent', 'critical'].map((k) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 14, height: 14, background: BL.need[k].bg, border: `1px solid ${BL.need[k].fg}` }} />
            <span style={{ fontFamily: BL.mono, fontSize: 10, color: BL.ink }}>
              {k === 'ok' ? '<10%' : k === 'low' ? '10–30%' : k === 'urgent' ? '30–60%' : '>60%'}
            </span>
          </div>
        ))}
      </div>
    </W>
  );
}
