import React from 'react';
import { BL } from '../styles/tokens.js';
import { W, Tag, Btn, Slot, Bars } from '../components/primitives.jsx';
import { AppHeader } from '../components/shells.jsx';
import { useApp } from '../state/AppState.jsx';

export function DonorImpact() {
  const { s, set } = useApp();
  const upcomingBooking = s.bookedSlot;
  return (
    <>
      <AppHeader title="Your impact" sub="LIFETIME · 12 DONATIONS" />
      <div style={{ padding: '0 16px 70px', overflowY: 'auto', height: 'calc(100% - 56px - 56px)' }}>
        {upcomingBooking && (
          <W pad={14} style={{ marginBottom: 12, background: BL.fill, borderColor: BL.ink }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Tag color={BL.muted}>UPCOMING · TODAY</Tag>
                <div style={{ fontFamily: BL.sans, fontSize: 14, color: BL.ink, fontWeight: 600, marginTop: 4 }}>
                  {upcomingBooking.time} · {upcomingBooking.venue.replace('Bloodbank@', '')}
                </div>
              </div>
              <Btn variant="outline" size="sm" color={BL.ink} onClick={() => set({ donorTab: 'home' })}>
                View
              </Btn>
            </div>
          </W>
        )}

        <W pad={16} style={{ marginBottom: 12 }}>
          <Tag color={BL.muted}>LAST DONATION · 14 MAR 2026</Tag>
          <div
            style={{
              fontFamily: BL.sans,
              fontSize: 18,
              fontWeight: 600,
              color: BL.ink,
              lineHeight: 1.3,
              marginTop: 6,
              letterSpacing: -0.2,
            }}
          >
            Your unit supported <span style={{ color: BL.red }}>3 patients</span> at{' '}
            <span style={{ color: BL.red }}>NUH</span>.
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {[
              { n: '1', l: 'RBC unit' },
              { n: '2', l: 'plasma' },
              { n: '1', l: 'platelets' },
            ].map((c) => (
              <Slot key={c.l} height={56} style={{ flex: 1 }} dashed={false}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: BL.mono, fontSize: 18, color: BL.ink, fontWeight: 600 }}>{c.n}</div>
                  <Tag>{c.l}</Tag>
                </div>
              </Slot>
            ))}
          </div>
        </W>

        <W pad={16} style={{ marginBottom: 12 }}>
          <Tag color={BL.muted}>LIFETIME</Tag>
          <div style={{ display: 'flex', gap: 16, marginTop: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
            {[
              { v: '12', l: 'donations' },
              { v: '36', l: 'lives reached' },
              { v: '5.4L', l: 'given' },
            ].map((stat) => (
              <div key={stat.l}>
                <div
                  style={{
                    fontFamily: BL.mono,
                    fontSize: 32,
                    fontWeight: 600,
                    color: BL.ink,
                    letterSpacing: -0.8,
                  }}
                >
                  {stat.v}
                </div>
                <Tag>{stat.l}</Tag>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <Tag color={BL.muted}>DONATIONS PER YEAR · 2021–2026</Tag>
            <div style={{ marginTop: 6 }}>
              <Bars data={[1, 2, 3, 2, 2, 2]} w={296} h={48} />
            </div>
          </div>
        </W>

        <W pad={12}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Tag color={BL.muted}>HSA MILESTONES</Tag>
            <Tag color={BL.faint}>next: 25 (silver)</Tag>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
            {[
              { n: '10', l: 'Bronze', got: true },
              { n: '25', l: 'Silver', got: false, current: true },
              { n: '50', l: 'Gold', got: false },
              { n: '100', l: 'Hon.', got: false },
            ].map((m, i) => (
              <div key={i} style={{ textAlign: 'center', flex: 1 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    margin: '0 auto',
                    borderRadius: 24,
                    border: `1.5px ${m.got ? 'solid' : m.current ? 'dashed' : 'solid'} ${
                      m.got ? BL.ink : m.current ? BL.red : BL.hair
                    }`,
                    background: m.got ? BL.ink : 'transparent',
                    color: m.got ? '#fff' : BL.faint,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: BL.mono,
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {m.n}
                </div>
                <div
                  style={{
                    fontFamily: BL.sans,
                    fontSize: 10,
                    color: m.current ? BL.red : BL.muted,
                    marginTop: 4,
                    fontWeight: 500,
                  }}
                >
                  {m.l}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, height: 6, background: BL.hair, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: '48%', height: '100%', background: BL.ink }} />
          </div>
          <div
            style={{ fontFamily: BL.mono, fontSize: 10, color: BL.muted, marginTop: 6, textAlign: 'right' }}
          >
            12 / 25 · 13 to silver
          </div>
        </W>
      </div>
    </>
  );
}
