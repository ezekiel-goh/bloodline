import React, { useState } from 'react';
import { BL } from '../styles/tokens.js';
import { W, Tag, Btn, SGMap } from '../components/primitives.jsx';
import { AppHeader } from '../components/shells.jsx';
import { useApp } from '../state/AppState.jsx';
import { DRIVES } from './data.js';

export function DonorDrives() {
  const { s, set } = useApp();
  const [filter, setFilter] = useState('all');
  const dots = [
    { x: 79, y: 85, need: 'low', r: 8 },
    { x: 130, y: 91, need: 'critical', r: 10 },
    { x: 164, y: 89, need: 'urgent', r: 8 },
    { x: 213, y: 94, need: 'ok', r: 7 },
    { x: 249, y: 92, need: 'low', r: 9 },
  ];
  return (
    <>
      <AppHeader title="Drives near you" sub="32 ACTIVE · 4 WITHIN 5 KM" />
      <div style={{ padding: '0 0 70px', overflowY: 'auto', height: 'calc(100% - 56px - 56px)' }}>
        <div style={{ position: 'relative', margin: '0 16px 12px' }}>
          <SGMap w={328} h={170} dots={dots} style={{ width: '100%', height: 'auto' }} />
          <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, display: 'flex', gap: 6 }}>
            <Btn
              variant={filter === 'all' ? 'fill' : 'soft'}
              size="sm"
              color={filter === 'all' ? BL.ink : BL.muted}
              onClick={() => setFilter('all')}
            >
              All types
            </Btn>
            <Btn
              variant={filter === 'near' ? 'fill' : 'soft'}
              size="sm"
              color={filter === 'near' ? BL.ink : BL.muted}
              onClick={() => setFilter('near')}
            >
              Within 5 km
            </Btn>
          </div>
        </div>

        <div style={{ padding: '0 16px' }}>
          <Tag color={BL.muted}>THIS WEEK · {filter === 'near' ? '4' : '12'} DRIVES</Tag>
          {DRIVES.filter((d) => filter === 'all' || ['d1', 'd4'].includes(d.id)).map((d) => {
            const rsvp = s.driveRsvps[d.id];
            return (
              <W key={d.id} pad={12} style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontFamily: BL.sans, fontSize: 14, color: BL.ink, fontWeight: 500 }}>{d.org}</div>
                    <div
                      style={{
                        fontFamily: BL.mono,
                        fontSize: 10,
                        color: BL.muted,
                        marginTop: 4,
                        letterSpacing: 0.4,
                      }}
                    >
                      {d.when}
                    </div>
                  </div>
                  <Tag color={BL.muted} bg={BL.fill}>
                    {d.tag}
                  </Tag>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}
                >
                  <span style={{ fontFamily: BL.mono, fontSize: 11, color: BL.muted }}>{d.slots} slots</span>
                  {rsvp === 'going' ? (
                    <Tag color={BL.need.ok.fg} bg={BL.need.ok.bg}>
                      ✓ GOING
                    </Tag>
                  ) : (
                    <Btn
                      variant="outline"
                      size="sm"
                      color={BL.ink}
                      onClick={() =>
                        set((cur) => ({
                          driveRsvps: { ...cur.driveRsvps, [d.id]: 'going' },
                          toast: `RSVP'd to ${d.org}`,
                        }))
                      }
                    >
                      RSVP
                    </Btn>
                  )}
                </div>
              </W>
            );
          })}
        </div>

        <div style={{ padding: '20px 16px 0' }}>
          <W pad={14} style={{ background: BL.fill, borderStyle: 'dashed' }}>
            <Tag color={BL.muted}>HOST A DRIVE</Tag>
            <div style={{ fontFamily: BL.sans, fontSize: 13, color: BL.ink, fontWeight: 500, marginTop: 4 }}>
              Mobilise your workplace, school, or RC
            </div>
            <div style={{ fontFamily: BL.sans, fontSize: 12, color: BL.muted, marginTop: 4, lineHeight: 1.5 }}>
              We'll coordinate a mobile unit with HSA on your behalf.
            </div>
            <Btn
              variant="outline"
              size="sm"
              color={BL.ink}
              style={{ marginTop: 10 }}
              onClick={() => set({ donorScreen: 'mobilise' })}
            >
              Start a drive →
            </Btn>
          </W>
        </div>
      </div>
    </>
  );
}
