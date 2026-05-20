import React, { useEffect, useState } from 'react';
import { BL, BLOOD_TYPES } from '../styles/tokens.js';
import { W, Tag, Btn, BloodChip, H, Spark, Modal } from '../components/primitives.jsx';
import { useApp } from '../state/AppState.jsx';

export function HSASurgeActivator() {
  const { s, set } = useApp();
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleType = (t) => set((cur) => ({
    surgeConfig: {
      ...cur.surgeConfig,
      types: cur.surgeConfig.types.includes(t)
        ? cur.surgeConfig.types.filter((x) => x !== t)
        : [...cur.surgeConfig.types, t],
    },
  }));

  const toggleTier = (i) => set((cur) => {
    const tiers = [...cur.surgeConfig.tiers];
    tiers[i] = !tiers[i];
    return { surgeConfig: { ...cur.surgeConfig, tiers } };
  });

  const toggleChan = (k) => set((cur) => ({
    surgeConfig: {
      ...cur.surgeConfig,
      channels: { ...cur.surgeConfig.channels, [k]: !cur.surgeConfig.channels[k] },
    },
  }));

  const tierSizes = [1820, 4200 - 1820, 11420 - 4200];
  const totalDonors = s.surgeConfig.tiers.reduce((sum, on, i) => sum + (on ? tierSizes[i] : 0), 0);
  const projected = Math.round(totalDonors * 0.148);

  if (s.surgeActive) return <HSASurgeLive />;

  return (
    <div style={{ padding: '20px 24px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: BL.sans, fontSize: 22, fontWeight: 600, color: BL.ink, letterSpacing: -0.3 }}>
            Surge Mode activation
          </div>
          <div style={{ fontFamily: BL.sans, fontSize: 13, color: BL.muted, marginTop: 4 }}>
            Mobilise the donor pool when forecasted shortage exceeds the response threshold. Requires Director sign-off.
          </div>
        </div>
        <Tag color={BL.muted}>STATUS · STAND-BY · 0 ACTIVE SURGES</Tag>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14 }}>
        {/* Step 1 — Configure */}
        <W pad={20}>
          <Tag color={BL.muted}>STEP 1 · CONFIGURE</Tag>

          <div style={{ marginTop: 12 }}>
            <label style={{ fontFamily: BL.sans, fontSize: 12, color: BL.muted }}>Blood type(s)</label>
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              {BLOOD_TYPES.map(({ t, n }) => (
                <button key={t} onClick={() => toggleType(t)}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                  <BloodChip type={t} need={n} size="md" selected={s.surgeConfig.types.includes(t)} />
                </button>
              ))}
            </div>
            <div style={{ fontFamily: BL.mono, fontSize: 10, color: BL.muted, marginTop: 6 }}>
              {s.surgeConfig.types.join(', ') || 'NONE'} SELECTED · {totalDonors.toLocaleString()} ELIGIBLE DONORS
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <label style={{ fontFamily: BL.sans, fontSize: 12, color: BL.muted }}>Reach tiers</label>
            <div style={{ marginTop: 6 }}>
              {[
                { l: 'Tier 1 · within 5 km of a blood bank', est: '1,820 donors · est 22% response' },
                { l: 'Tier 2 · within 15 km',                est: '2,380 incremental · est 14% response' },
                { l: 'Tier 3 · island-wide',                 est: '7,220 incremental · est 7% response' },
              ].map((tier, i) => {
                const sel = s.surgeConfig.tiers[i];
                return (
                  <button key={i} onClick={() => toggleTier(i)} style={{
                    width: '100%', textAlign: 'left',
                    padding: 12, border: `${sel ? 2 : 1}px solid ${sel ? BL.ink : BL.hair}`,
                    borderRadius: 6, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12,
                    background: '#fff', cursor: 'pointer',
                  }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: 3,
                      border: `1.5px solid ${sel ? BL.ink : BL.faint}`,
                      background: sel ? BL.ink : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, flexShrink: 0,
                    }}>{sel ? '✓' : ''}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: BL.sans, fontSize: 13, color: BL.ink, fontWeight: 500 }}>{tier.l}</div>
                      <div style={{ fontFamily: BL.mono, fontSize: 10, color: BL.muted, marginTop: 2 }}>{tier.est}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <label style={{ fontFamily: BL.sans, fontSize: 12, color: BL.muted }}>Channel + cap</label>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <W pad={10} style={{ flex: 1 }}>
                <Tag color={BL.muted}>CHANNELS</Tag>
                <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                  {[['push', 'Push'], ['sms', 'SMS'], ['whatsapp', 'WhatsApp'], ['email', 'Email']].map(([k, l]) => {
                    const on = s.surgeConfig.channels[k];
                    return (
                      <button key={k} onClick={() => toggleChan(k)} style={{
                        background: on ? BL.fill : 'transparent', color: on ? BL.ink : BL.muted,
                        border: `1px solid ${on ? BL.ink : BL.hair}`, padding: '2px 8px', borderRadius: 3,
                        fontFamily: BL.mono, fontSize: 9, letterSpacing: 0.6, textTransform: 'uppercase', cursor: 'pointer',
                      }}>{l}{on ? ' ✓' : ''}</button>
                    );
                  })}
                </div>
              </W>
              <W pad={10} style={{ flex: 1 }}>
                <Tag color={BL.muted}>SEND CAP / DONOR</Tag>
                <div style={{ fontFamily: BL.mono, fontSize: 13, color: BL.ink, fontWeight: 600, marginTop: 6 }}>
                  1 push · then SMS at 6h
                </div>
              </W>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <label style={{ fontFamily: BL.sans, fontSize: 12, color: BL.muted }}>Surge message preview</label>
            <W pad={12} style={{ marginTop: 6, background: BL.surgeBg, border: `1px solid ${BL.surge}44` }}>
              <Tag color={BL.surge}>SURGE · {s.surgeConfig.types.join(', ') || '—'}</Tag>
              <div style={{ fontFamily: BL.sans, fontSize: 13, color: BL.ink, fontWeight: 500, marginTop: 4 }}>
                {s.surgeConfig.types.join(', ') || '—'} is needed today. Bloodbank@HSA · 2.4 km · slots in next 24h.
              </div>
            </W>
          </div>
        </W>

        {/* Right column */}
        <div>
          {/* Step 2 — Projected reach */}
          <W pad={20} style={{ marginBottom: 14 }}>
            <Tag color={BL.muted}>STEP 2 · PROJECTED REACH</Tag>
            <div style={{ marginTop: 10 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: BL.mono, fontSize: 32, color: BL.ink, fontWeight: 600, letterSpacing: -0.6 }}>
                  {totalDonors.toLocaleString()}
                </span>
                <Tag color={BL.muted}>DONORS NOTIFIED</Tag>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
                <span style={{ fontFamily: BL.mono, fontSize: 32, color: BL.red, fontWeight: 600, letterSpacing: -0.6 }}>
                  ~{projected.toLocaleString()}
                </span>
                <Tag color={BL.muted}>PROJECTED RESPONSES · 24H</Tag>
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <Tag color={BL.muted}>RESPONSE CURVE · MODELLED</Tag>
              <Spark w={280} h={56} points={[20, 60, 140, 280, 480, 680, 800, 870, projected]} color={BL.red} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: BL.mono, fontSize: 9, color: BL.faint, marginTop: 4 }}>
                <span>0h</span><span>6h</span><span>12h</span><span>18h</span><span>24h</span>
              </div>
            </div>
          </W>

          {/* Step 3 — Capacity */}
          <W pad={20} style={{ marginBottom: 14 }}>
            <Tag color={BL.muted}>STEP 3 · CAPACITY CHECK</Tag>
            <div style={{ marginTop: 10 }}>
              {[
                ['Bloodbank@HSA',          86, 120],
                ['Bloodbank@Dhoby Ghaut',  54,  90],
                ['Bloodbank@Woodlands',    42,  80],
                ['Bloodbank@Westgate',     38,  70],
              ].map(([b, used, cap], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                  <span style={{ flex: '0 0 170px', fontFamily: BL.sans, fontSize: 12, color: BL.ink2 }}>{b}</span>
                  <div style={{ flex: 1, height: 8, background: BL.hair, borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${(used / cap) * 100}%`, height: '100%', background: BL.ink }} />
                  </div>
                  <span style={{ fontFamily: BL.mono, fontSize: 11, color: BL.muted, width: 52, textAlign: 'right' }}>{used}/{cap}</span>
                </div>
              ))}
            </div>
            <Tag color={BL.need.urgent.fg} style={{ marginTop: 8, display: 'block' }}>
              ⚠ +120 slots will be opened automatically
            </Tag>
          </W>

          {/* Break glass */}
          <div style={{ padding: 20, borderRadius: 8, background: BL.surgeBg, border: `2px solid ${BL.surge}` }}>
            <Tag color={BL.surge}>BREAK GLASS · REQUIRES DUAL SIGN-OFF</Tag>
            <div style={{ fontFamily: BL.sans, fontSize: 14, color: BL.ink, fontWeight: 500, marginTop: 8, lineHeight: 1.4 }}>
              Activating will notify {totalDonors.toLocaleString()} donors and shift the donor app into surge mode. Cannot be undone for 6h.
            </div>
            <Btn full size="lg" style={{ marginTop: 12, background: BL.surge, border: 'none', color: '#fff' }}
              disabled={s.surgeConfig.types.length === 0 || totalDonors === 0}
              onClick={() => setShowConfirm(true)}>
              Activate Surge Mode →
            </Btn>
            <div style={{ fontFamily: BL.mono, fontSize: 10, color: BL.muted, marginTop: 6, textAlign: 'center' }}>
              REQUIRES · DIRECTOR LIM · DIRECTOR TAN
            </div>
          </div>
        </div>
      </div>

      {/* Confirm modal */}
      <Modal open={showConfirm} onClose={() => setShowConfirm(false)} w={460}>
        <Tag color={BL.surge}>FINAL CONFIRMATION · BREAK GLASS</Tag>
        <div style={{ fontFamily: BL.sans, fontSize: 22, fontWeight: 600, color: BL.ink, marginTop: 8, letterSpacing: -0.3 }}>
          Activate Surge Mode for {s.surgeConfig.types.join(', ')}?
        </div>
        <ul style={{ fontFamily: BL.sans, fontSize: 13, color: BL.ink2, marginTop: 10, paddingLeft: 18, lineHeight: 1.8 }}>
          <li>Push surge alerts to {totalDonors.toLocaleString()} eligible donors</li>
          <li>Open +120 emergency slots across 4 blood banks</li>
          <li>Switch the donor app into surge mode</li>
          <li>Trigger HSA comms + on-call roster</li>
        </ul>
        <W pad={12} style={{ marginTop: 12, background: BL.fill }}>
          <Tag color={BL.muted}>DUAL SIGN-OFF</Tag>
          {['Director Lim · signed 09:24', 'Director Tan · signed 09:25'].map((name, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: 3, background: BL.ink, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>✓</div>
              <span style={{ fontFamily: BL.sans, fontSize: 12, color: BL.ink2 }}>{name}</span>
            </div>
          ))}
        </W>
        <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
          <Btn variant="soft" color={BL.muted} onClick={() => setShowConfirm(false)}>Cancel</Btn>
          <Btn full size="lg" style={{ background: BL.surge, color: '#fff', border: 'none' }}
            onClick={() => {
              setShowConfirm(false);
              set({
                surgeActive: true,
                surgeActivatedAt: new Date().toISOString(),
                hsaToast: `Surge Mode activated · ${totalDonors.toLocaleString()} donors notified`,
              });
            }}>
            Confirm activation
          </Btn>
        </div>
      </Modal>
    </div>
  );
}

function HSASurgeLive() {
  const { s, set } = useApp();
  const [resp, setResp] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setResp((r) => (r >= 142 ? r : r + Math.floor(Math.random() * 4) + 1)), 700);
    return () => clearInterval(id);
  }, []);

  const activatedTime = s.surgeActivatedAt
    ? new Date(s.surgeActivatedAt).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div style={{ padding: '20px 24px', height: '100%', overflowY: 'auto' }}>
      {/* Live banner */}
      <div style={{
        padding: 18, background: BL.surgeBg, border: `2px solid ${BL.surge}`,
        borderRadius: 10, marginBottom: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}>
        <div>
          <Tag color={BL.surge}>SURGE LIVE · {s.surgeConfig.types.join(', ')}</Tag>
          <div style={{ fontFamily: BL.sans, fontSize: 22, fontWeight: 600, color: BL.ink, marginTop: 4, letterSpacing: -0.3 }}>
            6,020 donors notified · {resp} responses
          </div>
          <div style={{ fontFamily: BL.mono, fontSize: 11, color: BL.muted, marginTop: 4 }}>
            ACTIVATED {activatedTime} · LOCK 6H
          </div>
        </div>
        <Btn variant="outline" color={BL.ink}
          onClick={() => set({ surgeActive: false, surgeActivatedAt: null, hsaToast: 'Surge Mode deactivated' })}>
          Deactivate (override)
        </Btn>
      </div>

      {/* Live KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { l: 'DONORS NOTIFIED', v: '6,020',                          s: 'push + SMS · 09:27' },
          { l: 'RESPONSES',       v: resp.toLocaleString(),             s: 'real-time', tone: 'surge' },
          { l: 'BOOKED',          v: Math.floor(resp * 0.62).toString(), s: '~62% conversion' },
          { l: 'PROJ. 24H YIELD', v: '~890',                           s: 'on track' },
        ].map((k, i) => (
          <W key={i} pad={14}>
            <Tag color={BL.muted}>{k.l}</Tag>
            <div style={{ fontFamily: BL.mono, fontSize: 28, fontWeight: 600,
              color: k.tone === 'surge' ? BL.surge : BL.ink, marginTop: 4, letterSpacing: -0.6 }}>{k.v}</div>
            <div style={{ fontFamily: BL.sans, fontSize: 11, color: BL.muted, marginTop: 2 }}>{k.s}</div>
          </W>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <W pad={16}>
          <H size={14}>Response curve · live vs model</H>
          <div style={{ marginTop: 10, position: 'relative' }}>
            <Spark w={400} h={120} points={[20, 60, 140, 280, 480, 680, 800, 870, 890]} color={BL.faint} />
            <div style={{ position: 'absolute', top: 0, left: 0 }}>
              <Spark w={400} h={120}
                points={Array.from({ length: 9 }).map((_, i) =>
                  Math.min(resp * (1 + i * 0.15), [20, 60, 140, 280, 480, 680, 800, 870, 890][i])
                )}
                color={BL.surge} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 6, fontFamily: BL.mono, fontSize: 10, color: BL.muted }}>
            <span style={{ color: BL.surge }}>● live</span>
            <span style={{ color: BL.faint }}>● modelled</span>
          </div>
        </W>
        <W pad={16}>
          <H size={14}>By blood bank · live bookings</H>
          <div style={{ marginTop: 10 }}>
            {[
              ['Bloodbank@HSA',         Math.floor(resp * 0.34), 120],
              ['Bloodbank@Dhoby Ghaut', Math.floor(resp * 0.22),  90],
              ['Bloodbank@Woodlands',   Math.floor(resp * 0.16),  80],
              ['Bloodbank@Westgate',    Math.floor(resp * 0.12),  70],
            ].map(([b, used, cap], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
                <span style={{ flex: '0 0 170px', fontFamily: BL.sans, fontSize: 12, color: BL.ink2 }}>{b}</span>
                <div style={{ flex: 1, height: 8, background: BL.hair, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (used / cap) * 100)}%`, height: '100%',
                    background: BL.surge, transition: 'width 0.5s' }} />
                </div>
                <span style={{ fontFamily: BL.mono, fontSize: 11, color: BL.muted, width: 52, textAlign: 'right' }}>{used}/{cap}</span>
              </div>
            ))}
          </div>
        </W>
      </div>
    </div>
  );
}
