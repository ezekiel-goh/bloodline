import React from 'react';
import { BL, BLOOD_TYPES } from '../styles/tokens.js';
import { W, Tag, Btn, BloodChip, Spark } from '../components/primitives.jsx';
import { AppHeader } from '../components/shells.jsx';
import { useApp } from '../state/AppState.jsx';
import { SLOTS } from './data.js';

export function DonorHomeA() {
  const { s, set } = useApp();
  const eligibilityLabel = s.bookedSlot ? `BOOKED · ${s.bookedSlot.venue}` : 'ELIGIBILITY';

  return (
    <>
      <AppHeader
        sub="BLOODLINE"
        title="Tan Wei Ming"
        right={
          <button
            onClick={() => set({ donorTab: 'profile' })}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              background: BL.fill,
              border: `1px solid ${BL.hair}`,
              cursor: 'pointer',
            }}
          />
        }
      />

      <div style={{ padding: '0 16px 80px', overflowY: 'auto', height: 'calc(100% - 56px - 64px)' }}>
        <W pad={16} style={{ marginBottom: 12 }}>
          <Tag color={BL.muted}>{eligibilityLabel}</Tag>
          {s.bookedSlot ? (
            <>
              <div style={{ fontFamily: BL.sans, fontSize: 18, fontWeight: 600, color: BL.ink, marginTop: 4, letterSpacing: -0.2 }}>
                {s.bookedSlot.time} · {s.bookedSlot.venue.replace('Bloodbank@', '')}
              </div>
              <div style={{ fontFamily: BL.sans, fontSize: 13, color: BL.muted, marginTop: 4 }}>
                Today · {s.bookedSlot.dist} away · ~15 min visit
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                <Btn
                  size="sm"
                  variant="outline"
                  color={BL.ink}
                  onClick={() => set({ bookedSlot: null, toast: 'Booking cancelled' })}
                >
                  Cancel
                </Btn>
                <Btn size="sm" variant="soft" color={BL.muted} onClick={() => set({ donorScreen: 'booking' })}>
                  Reschedule
                </Btn>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                <span style={{ fontFamily: BL.sans, fontSize: 22, fontWeight: 600, color: BL.ink, letterSpacing: -0.3 }}>
                  You can donate
                </span>
                <span
                  style={{
                    fontFamily: BL.mono,
                    fontSize: 11,
                    color: BL.need.ok.fg,
                    background: BL.need.ok.bg,
                    padding: '2px 6px',
                    borderRadius: 3,
                  }}
                >
                  NOW
                </span>
              </div>
              <div style={{ fontFamily: BL.sans, fontSize: 13, color: BL.muted, marginTop: 4 }}>
                Last donation 14 Mar 2026 · whole blood
              </div>
            </>
          )}
        </W>

        <W pad={16} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <div style={{ minWidth: 0 }}>
              <Tag color={BL.muted}>YOUR TYPE · NATIONAL NEED</Tag>
              <div style={{ fontFamily: BL.sans, fontSize: 12, color: BL.muted, marginTop: 2 }}>Updated 9:38 AM · HSA</div>
            </div>
            <Tag color={BL.need.critical.fg} bg={BL.need.critical.bg}>
              Critical
            </Tag>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '14px 0 6px' }}>
            <BloodChip type="O−" need="critical" size="xl" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: BL.sans, fontSize: 13, color: BL.ink, fontWeight: 500 }}>4.2 days of supply</div>
              <div style={{ fontFamily: BL.sans, fontSize: 12, color: BL.muted, lineHeight: 1.45, marginTop: 4 }}>
                O− is universal. NUH + SGH demand outpaces donations through Friday.
              </div>
            </div>
          </div>
          <Btn full size="lg" color={BL.ink} style={{ marginTop: 10 }} onClick={() => set({ donorScreen: 'booking' })}>
            {s.bookedSlot ? 'Reschedule slot' : 'Book a slot'}
          </Btn>
        </W>

        <W pad={12} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Tag color={BL.muted}>ALL TYPES</Tag>
            <Tag color={BL.faint}>tap for forecast</Tag>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 4 }}>
            {BLOOD_TYPES.map(({ t, n }) => (
              <button
                key={t}
                onClick={() => set({ selectedType: t, donorScreen: 'type-detail' })}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <BloodChip type={t} need={n} size="sm" selected={t === 'O−'} />
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 10, fontFamily: BL.mono, fontSize: 9, color: BL.faint }}>
            <span>● ok</span>
            <span>● low</span>
            <span>● urgent</span>
            <span>● critical</span>
          </div>
        </W>

        <W pad={12} style={{ marginBottom: 12 }}>
          <Tag color={BL.muted}>NEAREST AVAILABILITY</Tag>
          {SLOTS.slice(0, 3).map((sl, i) => (
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
                <div style={{ fontFamily: BL.sans, fontSize: 13, color: BL.ink, fontWeight: 500 }}>{sl.venue}</div>
                <div style={{ fontFamily: BL.mono, fontSize: 11, color: BL.muted, marginTop: 2 }}>
                  {sl.time} today · {sl.dist}
                </div>
              </div>
              <Btn
                variant="outline"
                size="sm"
                color={BL.ink}
                onClick={() => set({ selectedSlot: sl, donorScreen: 'booking-confirm' })}
              >
                Book
              </Btn>
            </div>
          ))}
        </W>
      </div>
    </>
  );
}

export function DonorHomeB() {
  const { set } = useApp();
  return (
    <>
      <AppHeader sub="GOOD MORNING" title="Hi, Wei Ming" />
      <div style={{ padding: '0 16px 80px', overflowY: 'auto', height: 'calc(100% - 56px - 64px)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: BL.ink }} />
            <div style={{ width: 1, flex: 1, background: BL.hair, marginTop: 4, minHeight: 80 }} />
          </div>
          <div style={{ flex: 1 }}>
            <Tag color={BL.muted}>CAN I DONATE?</Tag>
            <div
              style={{
                fontFamily: BL.sans,
                fontSize: 28,
                fontWeight: 600,
                color: BL.ink,
                letterSpacing: -0.6,
                lineHeight: 1.1,
                marginTop: 2,
              }}
            >
              Yes — today.
            </div>
            <div style={{ fontFamily: BL.sans, fontSize: 13, color: BL.muted, marginTop: 6, lineHeight: 1.5 }}>
              You're eligible. 84 days since your last donation.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: BL.red }} />
            <div style={{ width: 1, flex: 1, background: BL.hair, marginTop: 4, minHeight: 160 }} />
          </div>
          <div style={{ flex: 1 }}>
            <Tag color={BL.muted}>IS IT NEEDED?</Tag>
            <div
              style={{
                fontFamily: BL.sans,
                fontSize: 28,
                fontWeight: 600,
                color: BL.ink,
                letterSpacing: -0.6,
                lineHeight: 1.1,
                marginTop: 2,
              }}
            >
              Critically.
            </div>
            <div
              style={{
                fontFamily: BL.sans,
                fontSize: 13,
                color: BL.muted,
                marginTop: 6,
                lineHeight: 1.5,
                marginBottom: 12,
              }}
            >
              Your type, O−, is at <b style={{ color: BL.redInk }}>4.2 days</b> of supply.
            </div>
            <W pad={10}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 4 }}>
                {BLOOD_TYPES.map(({ t, n }) => (
                  <button
                    key={t}
                    onClick={() => set({ selectedType: t, donorScreen: 'type-detail' })}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                  >
                    <BloodChip type={t} need={n} size="sm" selected={t === 'O−'} />
                  </button>
                ))}
              </div>
            </W>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: BL.ink }} />
          </div>
          <div style={{ flex: 1 }}>
            <Tag color={BL.muted}>WHEN CAN I GO?</Tag>
            <W pad={12} style={{ marginTop: 6 }}>
              <div style={{ fontFamily: BL.sans, fontSize: 13, color: BL.ink, fontWeight: 500 }}>
                Bloodbank@HSA · 2.4 km
              </div>
              <div style={{ fontFamily: BL.mono, fontSize: 11, color: BL.muted, marginTop: 4 }}>
                NEAREST OPEN SLOT · 11:20 AM TODAY
              </div>
              <Btn
                full
                size="lg"
                color={BL.ink}
                style={{ marginTop: 10 }}
                onClick={() => set({ selectedSlot: SLOTS[0], donorScreen: 'booking-confirm' })}
              >
                Book 11:20
              </Btn>
              <Btn
                full
                size="sm"
                variant="ghost"
                color={BL.muted}
                style={{ marginTop: 4 }}
                onClick={() => set({ donorScreen: 'booking' })}
              >
                See other times
              </Btn>
            </W>
          </div>
        </div>
      </div>
    </>
  );
}

export function DonorSurgeAlert() {
  const { set } = useApp();
  return (
    <>
      <div
        style={{
          background: BL.surgeBg,
          borderBottom: `1px solid ${BL.surge}33`,
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            background: BL.surge,
            animation: 'bl-pulse 2s infinite',
          }}
        />
        <Tag color={BL.surge}>SURGE MODE · ACTIVATED</Tag>
      </div>

      <div style={{ padding: '20px 20px 80px', overflowY: 'auto', height: 'calc(100% - 80px - 56px)' }}>
        <div style={{ fontFamily: BL.mono, fontSize: 10, color: BL.muted, letterSpacing: 0.8 }}>
          HSA NATIONAL ALERT ·{' '}
          {new Date().toLocaleString('en-SG', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </div>
        <div
          style={{
            fontFamily: BL.sans,
            fontSize: 30,
            fontWeight: 600,
            color: BL.ink,
            lineHeight: 1.05,
            letterSpacing: -0.8,
            marginTop: 8,
          }}
        >
          O− is needed today.
        </div>
        <div style={{ fontFamily: BL.sans, fontSize: 15, color: BL.ink2, lineHeight: 1.5, marginTop: 10 }}>
          A multi-casualty incident along the AYE has drawn down national O− reserves. We're calling 4,200 eligible
          donors within 15 km.
        </div>

        <div
          style={{
            marginTop: 18,
            padding: 16,
            background: BL.surgeBg,
            border: `1px solid ${BL.surge}55`,
            borderRadius: 8,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: BL.sans, fontSize: 15, color: BL.ink, fontWeight: 600 }}>Bloodbank@HSA</div>
              <div style={{ fontFamily: BL.mono, fontSize: 11, color: BL.muted, marginTop: 4 }}>2.4 KM · OUTRAM</div>
            </div>
            <BloodChip type="O−" need="critical" size="lg" />
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {['11:20 AM', '11:40 AM', '12:00 PM'].map((t) => (
              <button
                key={t}
                onClick={() => {
                  const sl = SLOTS.find((x) => x.time === t) || SLOTS[0];
                  set({ selectedSlot: sl, donorScreen: 'booking-confirm' });
                }}
                style={{
                  fontFamily: BL.mono,
                  fontSize: 11,
                  color: BL.ink,
                  background: '#fff',
                  border: `1px solid ${BL.hair}`,
                  padding: '4px 10px',
                  borderRadius: 4,
                  cursor: 'pointer',
                  letterSpacing: 0.4,
                  textTransform: 'uppercase',
                }}
              >
                {t}
              </button>
            ))}
            <Tag color={BL.muted}>+18 more · next 24h</Tag>
          </div>
          <Btn
            full
            size="lg"
            style={{ marginTop: 14, background: BL.surge, color: '#fff', border: 'none' }}
            onClick={() => set({ selectedSlot: SLOTS[0], donorScreen: 'booking-confirm' })}
          >
            Book 11:20 AM
          </Btn>
        </div>

        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          <Btn full variant="outline" color={BL.ink} onClick={() => set({ donorScreen: 'mobilise' })}>
            Mobilise my workplace
          </Btn>
          <Btn
            variant="soft"
            color={BL.muted}
            onClick={() => set({ surgeSnoozed: true, toast: 'Snoozed for 2 hours' })}
          >
            Snooze 2h
          </Btn>
        </div>

        <div style={{ marginTop: 16, padding: 12, border: `1px solid ${BL.hair}`, borderRadius: 6 }}>
          <Tag color={BL.muted}>WHY YOU GOT THIS</Tag>
          <div style={{ fontFamily: BL.sans, fontSize: 12, color: BL.ink2, lineHeight: 1.55, marginTop: 6 }}>
            You're <b>O−</b>, eligible, and within the 15 km tier. You can opt out of surge alerts in Profile ·
            Notifications.
          </div>
        </div>
      </div>
    </>
  );
}

export function DonorTypeDetail() {
  const { s, set } = useApp();
  const t = s.selectedType || 'O−';
  const meta = BLOOD_TYPES.find((x) => x.t === t) || BLOOD_TYPES[0];
  const need = meta.n;
  const days = { critical: 4.2, urgent: 6.1, low: 9.4, ok: 14.5 }[need];
  return (
    <>
      <div style={{ padding: '12px 16px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Btn variant="ghost" size="sm" color={BL.ink} onClick={() => set({ donorScreen: null })}>
          ← Back
        </Btn>
        <Tag>NATIONAL FORECAST · {t}</Tag>
      </div>
      <div style={{ padding: '16px 16px 80px', overflowY: 'auto', height: 'calc(100% - 60px - 56px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <BloodChip type={t} need={need} size="xl" />
          <div style={{ flex: 1 }}>
            <Tag color={BL.need[need].fg} bg={BL.need[need].bg}>
              {BL.need[need].label}
            </Tag>
            <div
              style={{
                fontFamily: BL.mono,
                fontSize: 28,
                fontWeight: 600,
                color: BL.ink,
                marginTop: 6,
                letterSpacing: -0.6,
              }}
            >
              {days} days
            </div>
            <Tag color={BL.muted}>OF NATIONAL SUPPLY</Tag>
          </div>
        </div>

        <W pad={14} style={{ marginTop: 14 }}>
          <Tag color={BL.muted}>14-DAY OUTLOOK</Tag>
          <div style={{ marginTop: 8 }}>
            <Spark
              w={300}
              h={50}
              points={[12, 10, 9, 7.5, 6, 5, 4.2, 3.8, 3.6, 3.8, 4.2, 5, 6, 7]}
              color={BL.red}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: BL.mono,
              fontSize: 9,
              color: BL.faint,
              marginTop: 4,
            }}
          >
            <span>TODAY</span>
            <span>+7d</span>
            <span>+14d</span>
          </div>
        </W>

        <W pad={14} style={{ marginTop: 12 }}>
          <Tag color={BL.muted}>YOU CAN HELP {t}</Tag>
          <div style={{ fontFamily: BL.sans, fontSize: 13, color: BL.ink2, lineHeight: 1.5, marginTop: 6 }}>
            {t === 'O−'
              ? 'O− is the universal donor — your blood can go to anyone in an emergency, which is why national stocks for O− are watched most closely.'
              : `Your donations of ${t} are matched directly to patients with compatible types. Demand spikes are driven by scheduled procedures and trauma.`}
          </div>
          <Btn
            full
            size="lg"
            color={BL.ink}
            style={{ marginTop: 12 }}
            onClick={() => set({ donorScreen: 'booking' })}
          >
            Book a slot
          </Btn>
        </W>
      </div>
    </>
  );
}
