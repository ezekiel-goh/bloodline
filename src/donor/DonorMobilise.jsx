import React, { useEffect, useState } from 'react';
import { BL } from '../styles/tokens.js';
import { W, Tag, Btn, BloodChip } from '../components/primitives.jsx';
import { useApp } from '../state/AppState.jsx';

export function DonorMobilise() {
  const { s } = useApp();
  if (s.mobStep === 1) return <MobiliseStep1 />;
  if (s.mobStep === 2) return <MobiliseStep2 />;
  if (s.mobStep === 3) return <MobiliseStep3 />;
  return <MobiliseTracker />;
}

function MobiliseBack({ to }) {
  const { set } = useApp();
  return (
    <Btn
      variant="ghost"
      size="sm"
      color={BL.ink}
      onClick={() => (to === 'exit' ? set({ donorScreen: null, mobStep: 1 }) : set({ mobStep: to }))}
    >
      ← Back
    </Btn>
  );
}

function MobiliseStep1() {
  const { s, set } = useApp();
  const orgs = [
    { l: 'DBS · Group Tech', sub: '128 members · 14 O− eligible' },
    { l: 'NUS Alumni · CompSci', sub: '412 members · 38 O− eligible' },
    { l: 'Tampines East RC', sub: '96 members · 9 O− eligible' },
  ];
  return (
    <>
      <div style={{ padding: '12px 16px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <MobiliseBack to="exit" />
        <Tag>STEP 1 / 4</Tag>
      </div>
      <div style={{ padding: '12px 16px 110px', overflowY: 'auto', height: 'calc(100% - 60px - 56px)' }}>
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
          Who do you want to mobilise?
        </div>
        <div style={{ fontFamily: BL.sans, fontSize: 13, color: BL.muted, marginTop: 6, lineHeight: 1.5 }}>
          You'll send a one-tap invite to your squad. We'll handle scheduling with HSA.
        </div>
        <div style={{ marginTop: 18 }}>
          {orgs.map((o) => {
            const sel = s.mobOrg === o.l;
            return (
              <button
                key={o.l}
                onClick={() => set({ mobOrg: o.l })}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: 14,
                  marginBottom: 8,
                  borderRadius: 8,
                  border: `${sel ? 2 : 1}px solid ${sel ? BL.ink : BL.hair}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: '#fff',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    border: `2px solid ${sel ? BL.ink : BL.faint}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {sel && <div style={{ width: 8, height: 8, borderRadius: 4, background: BL.ink }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: BL.sans, fontSize: 14, color: BL.ink, fontWeight: 500 }}>{o.l}</div>
                  <div style={{ fontFamily: BL.mono, fontSize: 10, color: BL.muted, marginTop: 2 }}>{o.sub}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 24, left: 16, right: 16 }}>
        <Btn full size="lg" color={BL.ink} onClick={() => set({ mobStep: 2 })}>
          Continue → Set time
        </Btn>
      </div>
    </>
  );
}

function MobiliseStep2() {
  const { s, set } = useApp();
  const times = [
    { d: 'Tomorrow', t: 'Lunch · 11:30–14:00', cap: 'Mobile unit on-site' },
    { d: 'Thu 21 May', t: 'Lunch · 11:30–14:00', cap: 'Mobile unit on-site' },
    { d: 'Fri 22 May', t: 'After work · 17:00–19:30', cap: 'Bloodbank@HSA (2.4 km)' },
  ];
  return (
    <>
      <div style={{ padding: '12px 16px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <MobiliseBack to={1} />
        <Tag>STEP 2 / 4</Tag>
      </div>
      <div style={{ padding: '12px 16px 110px', overflowY: 'auto', height: 'calc(100% - 60px - 56px)' }}>
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
          When works for your team?
        </div>
        <div style={{ marginTop: 16 }}>
          <Tag color={BL.muted}>SUGGESTED · BASED ON HSA CAPACITY</Tag>
          {times.map((tm) => {
            const sel = s.mobTime.d === tm.d;
            return (
              <button
                key={tm.d}
                onClick={() => set({ mobTime: tm })}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: 12,
                  marginTop: 8,
                  borderRadius: 8,
                  border: `${sel ? 2 : 1}px solid ${sel ? BL.ink : BL.hair}`,
                  background: '#fff',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontFamily: BL.sans, fontSize: 14, color: BL.ink, fontWeight: 500 }}>{tm.d}</div>
                  <Tag>{tm.cap}</Tag>
                </div>
                <div style={{ fontFamily: BL.mono, fontSize: 11, color: BL.muted, marginTop: 4 }}>{tm.t}</div>
              </button>
            );
          })}
          <div style={{ marginTop: 16 }}>
            <Tag color={BL.muted}>LOCATION</Tag>
            <W pad={12} style={{ marginTop: 6 }}>
              <div style={{ fontFamily: BL.sans, fontSize: 13, color: BL.ink, fontWeight: 500 }}>
                DBS Asia Central · MBFC Tower 3 lobby
              </div>
              <div style={{ fontFamily: BL.mono, fontSize: 10, color: BL.muted, marginTop: 4 }}>
                12 MARINA BLVD · LEVEL 1
              </div>
            </W>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 24, left: 16, right: 16 }}>
        <Btn full size="lg" color={BL.ink} onClick={() => set({ mobStep: 3 })}>
          Continue → Draft invite
        </Btn>
      </div>
    </>
  );
}

function MobiliseStep3() {
  const { s, set } = useApp();
  return (
    <>
      <div style={{ padding: '12px 16px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <MobiliseBack to={2} />
        <Tag>STEP 3 / 4</Tag>
      </div>
      <div style={{ padding: '12px 16px 110px', overflowY: 'auto', height: 'calc(100% - 60px - 56px)' }}>
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
          Review the invite
        </div>
        <div style={{ fontFamily: BL.sans, fontSize: 13, color: BL.muted, marginTop: 6, lineHeight: 1.5 }}>
          We'll send this via WhatsApp + email to 128 members of <b style={{ color: BL.ink }}>{s.mobOrg}</b>. Reply
          RSVP in one tap.
        </div>
        <W pad={14} style={{ marginTop: 16, background: BL.fill }}>
          <Tag color={BL.muted}>PREVIEW</Tag>
          <div style={{ fontFamily: BL.sans, fontSize: 14, color: BL.ink, fontWeight: 600, marginTop: 4 }}>
            {s.mobOrg.split(' · ')[1] || 'Team'} · let's give blood {s.mobTime.d.toLowerCase()}
          </div>
          <div style={{ fontFamily: BL.sans, fontSize: 12, color: BL.ink2, lineHeight: 1.55, marginTop: 6 }}>
            Wei Ming is organising a drive at MBFC T3 lobby,{' '}
            {s.mobTime.t.replace('Lunch · ', '').replace('After work · ', '')}. O− is currently at <b>critical</b>{' '}
            nationally. Tap to RSVP — it's about 15 minutes.
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            <Tag color={BL.ink} bg="#fff">
              I'm in
            </Tag>
            <Tag color={BL.muted} bg="#fff">
              Maybe
            </Tag>
            <Tag color={BL.muted} bg="#fff">
              Can't
            </Tag>
          </div>
        </W>
        <div style={{ marginTop: 14 }}>
          <Tag color={BL.muted}>TARGET</Tag>
          <W pad={12} style={{ marginTop: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: BL.sans, fontSize: 12, color: BL.ink2 }}>
                14 O− eligible · 128 total members
              </span>
              <span style={{ fontFamily: BL.mono, fontSize: 11, color: BL.muted }}>WE NEED 18 RSVPs</span>
            </div>
            <div style={{ height: 6, background: BL.hair, borderRadius: 3 }} />
          </W>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 24, left: 16, right: 16, display: 'flex', gap: 8 }}>
        <Btn variant="outline" color={BL.ink}>
          Edit copy
        </Btn>
        <Btn full size="lg" color={BL.ink} onClick={() => set({ mobStep: 4, toast: 'Invite sent to 128 members' })}>
          Send invite
        </Btn>
      </div>
    </>
  );
}

function MobiliseTracker() {
  const { s, set } = useApp();
  const [counts, setCounts] = useState({ going: 4, maybe: 2, decline: 1, noreply: 121 });
  useEffect(() => {
    const id = setInterval(() => {
      setCounts((c) => {
        if (c.noreply <= 93) return c;
        const r = Math.random();
        if (r < 0.5) return { ...c, going: c.going + 1, noreply: c.noreply - 1 };
        if (r < 0.8) return { ...c, maybe: c.maybe + 1, noreply: c.noreply - 1 };
        return { ...c, decline: c.decline + 1, noreply: c.noreply - 1 };
      });
    }, 700);
    return () => clearInterval(id);
  }, []);
  const target = 18;
  const ahead = Math.max(0, counts.going - target);
  return (
    <>
      <div style={{ padding: '12px 16px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Btn
          variant="ghost"
          size="sm"
          color={BL.ink}
          onClick={() => set({ donorScreen: null, donorTab: 'drives', mobStep: 1 })}
        >
          ← Drives
        </Btn>
        <Tag>LIVE · STEP 4 / 4</Tag>
      </div>
      <div style={{ padding: '12px 16px 70px', overflowY: 'auto', height: 'calc(100% - 60px - 56px)' }}>
        <Tag color={BL.muted}>YOUR DRIVE · {s.mobTime.d.toUpperCase()} · MBFC T3</Tag>
        <div
          style={{
            fontFamily: BL.sans,
            fontSize: 22,
            fontWeight: 600,
            color: BL.ink,
            letterSpacing: -0.4,
            lineHeight: 1.2,
            marginTop: 4,
          }}
        >
          {counts.going} going · {counts.maybe} maybe
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
          {counts.going >= target ? (
            <span style={{ fontFamily: BL.mono, fontSize: 11, color: BL.need.ok.fg, fontWeight: 600 }}>
              ↑ {ahead} ahead of target
            </span>
          ) : (
            <span style={{ fontFamily: BL.mono, fontSize: 11, color: BL.need.urgent.fg, fontWeight: 600 }}>
              ↓ {target - counts.going} below target
            </span>
          )}
          <span style={{ fontFamily: BL.mono, fontSize: 11, color: BL.muted }}>· live</span>
        </div>

        <W pad={12} style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <Tag color={BL.muted}>
              RSVPS · {counts.going + counts.maybe + counts.decline} / {target} NEEDED
            </Tag>
            <span
              style={{
                fontFamily: BL.mono,
                fontSize: 10,
                color: counts.going >= target ? BL.need.ok.fg : BL.muted,
                fontWeight: 600,
              }}
            >
              {Math.round((counts.going / target) * 100)}%
            </span>
          </div>
          <div style={{ height: 8, background: BL.hair, borderRadius: 4, overflow: 'hidden' }}>
            <div
              style={{
                width: `${Math.min(100, (counts.going / target) * 100)}%`,
                height: '100%',
                background: counts.going >= target ? BL.need.ok.fg : BL.ink,
                transition: 'width 0.5s ease',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 10,
              fontFamily: BL.mono,
              fontSize: 11,
              color: BL.muted,
            }}
          >
            <span>{counts.going} going</span>
            <span>{counts.maybe} maybe</span>
            <span>{counts.decline} declined</span>
            <span>{counts.noreply} no reply</span>
          </div>
        </W>

        <W pad={12} style={{ marginTop: 10 }}>
          <Tag color={BL.muted}>RSVPS BY TYPE</Tag>
          <div style={{ marginTop: 10 }}>
            {[
              { t: 'O−', going: Math.min(6, counts.going), eligible: 14, need: 'critical' },
              { t: 'O+', going: Math.min(5, counts.going), eligible: 28, need: 'low' },
              { t: 'A+', going: Math.min(4, counts.going), eligible: 32, need: 'ok' },
              { t: 'B+', going: Math.min(3, counts.going), eligible: 24, need: 'ok' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                <BloodChip type={r.t} need={r.need} size="sm" />
                <div style={{ flex: 1, height: 6, background: BL.hair, borderRadius: 3, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${(r.going / r.eligible) * 100}%`,
                      height: '100%',
                      background: BL.ink,
                      transition: 'width 0.5s',
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: BL.mono,
                    fontSize: 11,
                    color: BL.muted,
                    minWidth: 50,
                    textAlign: 'right',
                  }}
                >
                  {r.going}/{r.eligible}
                </span>
              </div>
            ))}
          </div>
        </W>

        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          <Btn full variant="outline" color={BL.ink} onClick={() => set({ toast: 'Nudged 93 no-replies' })}>
            Nudge no-replies
          </Btn>
          <Btn full variant="outline" color={BL.ink} onClick={() => set({ toast: 'Shared to channels' })}>
            Share
          </Btn>
        </div>
      </div>
    </>
  );
}
