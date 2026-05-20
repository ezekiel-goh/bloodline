import React, { useState } from 'react';
import { BL } from '../styles/tokens.js';
import { W, Tag, Btn } from '../components/primitives.jsx';
import { useApp } from '../state/AppState.jsx';
import { SLOTS } from './data.js';

export function DonorBooking() {
  const { s, set } = useApp();
  const [filter, setFilter] = useState('all');
  const grouped = SLOTS.reduce((acc, sl) => {
    if (filter === 'near' && sl.dist !== '2.4 km') return acc;
    (acc[sl.venue] = acc[sl.venue] || []).push(sl);
    return acc;
  }, {});
  return (
    <>
      <div style={{ padding: '12px 16px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Btn variant="ghost" size="sm" color={BL.ink} onClick={() => set({ donorScreen: null })}>
          ← Back
        </Btn>
        <Tag>BOOK · O− WHOLE BLOOD</Tag>
      </div>
      <div style={{ padding: '12px 16px 100px', overflowY: 'auto', height: 'calc(100% - 60px - 56px)' }}>
        <div
          style={{
            fontFamily: BL.sans,
            fontSize: 22,
            fontWeight: 600,
            color: BL.ink,
            letterSpacing: -0.4,
            lineHeight: 1.2,
          }}
        >
          Choose a time
        </div>
        <div style={{ fontFamily: BL.sans, fontSize: 13, color: BL.muted, marginTop: 6, lineHeight: 1.5 }}>
          Pick the slot that works for you. We'll confirm with HSA instantly.
        </div>

        <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
          <Btn
            size="sm"
            variant={filter === 'all' ? 'fill' : 'soft'}
            color={filter === 'all' ? BL.ink : BL.muted}
            onClick={() => setFilter('all')}
          >
            All locations
          </Btn>
          <Btn
            size="sm"
            variant={filter === 'near' ? 'fill' : 'soft'}
            color={filter === 'near' ? BL.ink : BL.muted}
            onClick={() => setFilter('near')}
          >
            Within 5 km
          </Btn>
        </div>

        {Object.entries(grouped).map(([venue, list]) => (
          <W pad={12} key={venue} style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div>
                <div style={{ fontFamily: BL.sans, fontSize: 13, color: BL.ink, fontWeight: 500 }}>{venue}</div>
                <div style={{ fontFamily: BL.mono, fontSize: 10, color: BL.muted, marginTop: 2 }}>
                  {list[0].region.toUpperCase()} · {list[0].dist}
                </div>
              </div>
              <Tag color={BL.muted}>{list.length} times</Tag>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {list.map((sl, i) => {
                const sel =
                  s.selectedSlot && s.selectedSlot.venue === sl.venue && s.selectedSlot.time === sl.time;
                return (
                  <button
                    key={i}
                    onClick={() => set({ selectedSlot: sl })}
                    style={{
                      fontFamily: BL.mono,
                      fontSize: 12,
                      fontWeight: 500,
                      padding: '8px 12px',
                      borderRadius: 6,
                      background: sel ? BL.ink : '#fff',
                      color: sel ? '#fff' : BL.ink,
                      border: `1px solid ${sel ? BL.ink : BL.hair}`,
                      cursor: 'pointer',
                    }}
                  >
                    {sl.time}
                  </button>
                );
              })}
            </div>
          </W>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: 64, left: 16, right: 16 }}>
        <Btn
          full
          size="lg"
          color={BL.ink}
          style={{ opacity: s.selectedSlot ? 1 : 0.4, pointerEvents: s.selectedSlot ? 'auto' : 'none' }}
          onClick={() => set({ donorScreen: 'booking-confirm' })}
        >
          {s.selectedSlot ? `Continue with ${s.selectedSlot.time}` : 'Choose a time'}
        </Btn>
      </div>
    </>
  );
}

export function DonorBookingConfirm() {
  const { s, set } = useApp();
  const sl = s.selectedSlot || SLOTS[0];
  return (
    <>
      <div style={{ padding: '12px 16px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Btn variant="ghost" size="sm" color={BL.ink} onClick={() => set({ donorScreen: 'booking' })}>
          ← Back
        </Btn>
        <Tag>CONFIRM</Tag>
      </div>
      <div style={{ padding: '16px 16px 110px', overflowY: 'auto', height: 'calc(100% - 60px - 56px)' }}>
        <div
          style={{
            fontFamily: BL.sans,
            fontSize: 22,
            fontWeight: 600,
            color: BL.ink,
            letterSpacing: -0.4,
            lineHeight: 1.2,
          }}
        >
          Confirm your slot
        </div>

        <W pad={16} style={{ marginTop: 16 }}>
          <Tag color={BL.muted}>WHEN</Tag>
          <div
            style={{
              fontFamily: BL.sans,
              fontSize: 18,
              color: BL.ink,
              fontWeight: 600,
              marginTop: 4,
              letterSpacing: -0.2,
            }}
          >
            Today · {sl.time}
          </div>
          <div style={{ borderTop: `1px solid ${BL.hair}`, marginTop: 12, paddingTop: 12 }}>
            <Tag color={BL.muted}>WHERE</Tag>
            <div style={{ fontFamily: BL.sans, fontSize: 14, color: BL.ink, fontWeight: 500, marginTop: 4 }}>
              {sl.venue}
            </div>
            <div style={{ fontFamily: BL.mono, fontSize: 11, color: BL.muted, marginTop: 2 }}>
              {sl.region.toUpperCase()} · {sl.dist}
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${BL.hair}`, marginTop: 12, paddingTop: 12 }}>
            <Tag color={BL.muted}>DONATION TYPE</Tag>
            <div style={{ fontFamily: BL.sans, fontSize: 14, color: BL.ink, fontWeight: 500, marginTop: 4 }}>
              Whole blood · 450 ml · ~15 minutes
            </div>
          </div>
        </W>

        <W pad={14} style={{ marginTop: 12, background: BL.fill }}>
          <Tag color={BL.muted}>QUICK CHECK</Tag>
          <div style={{ marginTop: 8 }}>
            {[
              'Slept ≥ 5 hours last night',
              'Ate a meal in the last 3 hours',
              'Feeling well, no fever',
              'No recent travel to malaria-risk area',
            ].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    background: BL.ink,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                  }}
                >
                  ✓
                </div>
                <span style={{ fontFamily: BL.sans, fontSize: 12, color: BL.ink2 }}>{l}</span>
              </div>
            ))}
          </div>
        </W>

        <div style={{ marginTop: 14, fontFamily: BL.sans, fontSize: 12, color: BL.muted, lineHeight: 1.5 }}>
          By confirming, you agree to HSA's donor terms. You can cancel up to 1 hour before your slot.
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 64, left: 16, right: 16 }}>
        <Btn
          full
          size="lg"
          color={s.surgeActive ? BL.surge : BL.ink}
          onClick={() => set({ bookedSlot: sl, donorScreen: 'booking-success' })}
        >
          Confirm booking
        </Btn>
      </div>
    </>
  );
}

export function DonorBookingSuccess() {
  const { s, set } = useApp();
  const sl = s.bookedSlot || SLOTS[0];
  return (
    <div
      style={{
        padding: '40px 20px 80px',
        overflowY: 'auto',
        height: 'calc(100% - 56px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 44,
          background: BL.need.ok.bg,
          border: `2px solid ${BL.need.ok.fg}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: BL.sans,
          fontSize: 40,
          color: BL.need.ok.fg,
          fontWeight: 600,
          animation: 'bl-pop 0.4s cubic-bezier(0.2, 0.7, 0.2, 1)',
        }}
      >
        ✓
      </div>

      <div
        style={{
          fontFamily: BL.sans,
          fontSize: 26,
          fontWeight: 600,
          color: BL.ink,
          marginTop: 22,
          letterSpacing: -0.6,
          textAlign: 'center',
          lineHeight: 1.15,
        }}
      >
        You're booked.
      </div>
      <div
        style={{
          fontFamily: BL.sans,
          fontSize: 14,
          color: BL.muted,
          marginTop: 8,
          textAlign: 'center',
          lineHeight: 1.5,
          maxWidth: 280,
        }}
      >
        See you at <b style={{ color: BL.ink }}>{sl.venue}</b> at <b style={{ color: BL.ink }}>{sl.time}</b>.
      </div>

      <W pad={14} style={{ marginTop: 22, width: '100%', maxWidth: 360 }}>
        <Tag color={BL.muted}>YOUR IMPACT</Tag>
        <div style={{ fontFamily: BL.sans, fontSize: 14, color: BL.ink, fontWeight: 500, marginTop: 6, lineHeight: 1.5 }}>
          Your unit could reach <b style={{ color: BL.red }}>up to 3 patients</b> — and as O−, you can go to anyone in
          an emergency.
        </div>
      </W>

      <div style={{ width: '100%', maxWidth: 360, marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Btn full size="lg" color={BL.ink} onClick={() => set({ donorScreen: null, donorTab: 'home' })}>
          Done
        </Btn>
        <Btn full variant="ghost" color={BL.muted} onClick={() => set({ donorScreen: 'mobilise' })}>
          Bring a friend → Mobilise →
        </Btn>
      </div>
    </div>
  );
}
