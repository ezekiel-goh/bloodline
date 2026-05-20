import React, { useState } from 'react';
import { BL } from '../styles/tokens.js';
import { W, Tag, Btn } from '../components/primitives.jsx';
import { useApp } from '../state/AppState.jsx';

const INITIAL_REQS = [
  { id: 8120, org: 'DBS · Group Tech',   loc: 'MBFC T3 · Marina Bay', date: 'Wed 20 May · 11:30–14:00', mem: '128 members · 14 O−', tone: 'critical', why: 'Surge-eligible · O− region high need', status: null },
  { id: 8121, org: 'NUS · UCC',          loc: 'Kent Ridge',            date: 'Thu 21 May · 11:00–18:00', mem: '412 members · 38 O−', tone: 'urgent',   why: 'Repeat host · 96% delivery rate',      status: null },
  { id: 8122, org: 'Tampines East RC',   loc: 'Tampines St 21',        date: 'Sat 23 May · 09:00–15:00', mem: '96 members · 9 O−',   tone: 'urgent',   why: 'Fills NE gap (red on map)',             status: null },
  { id: 8123, org: 'Grab · Hubble',      loc: 'Sin Ming',              date: 'Mon 26 May · 13:00–19:00', mem: '380 members · 22 O−', tone: 'low',      why: 'New host · needs onsite manager',       status: null },
  { id: 8124, org: 'St. Joseph Inst.',   loc: 'Bukit Timah',           date: 'Fri 30 May · 09:00–13:00', mem: 'School · 64 eligible', tone: 'ok',      why: 'Volunteer scheme · age 17+',            status: null },
  { id: 8125, org: 'Toh Yi RC',          loc: 'Bukit Timah',           date: 'Sat 31 May · 10:00–16:00', mem: '72 members · 5 O−',   tone: 'low',      why: 'Co-host with St. Joseph?',             status: null },
];

export function HSADriveQueue() {
  const { set } = useApp();
  const [reqs, setReqs] = useState(INITIAL_REQS);

  const act = (id, status) => {
    setReqs((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
    set({ hsaToast: status === 'approved' ? 'Drive approved · captain notified' : 'Drive declined' });
  };

  const pending = reqs.filter((r) => !r.status).length;

  return (
    <div style={{ padding: '20px 24px', overflowY: 'auto', height: '100%' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: BL.sans, fontSize: 22, fontWeight: 600, color: BL.ink, letterSpacing: -0.3 }}>
          Community drive queue
        </div>
        <div style={{ fontFamily: BL.sans, fontSize: 13, color: BL.muted, marginTop: 4 }}>
          {pending} pending · approve, decline, or merge with mobile-unit schedule.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {reqs.map((d) => (
          <W key={d.id} pad={16} style={{ opacity: d.status ? 0.7 : 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Tag color={BL.muted}>REQUEST · #{d.id}</Tag>
                <div style={{ fontFamily: BL.sans, fontSize: 15, color: BL.ink, fontWeight: 600, marginTop: 4 }}>{d.org}</div>
                <div style={{ fontFamily: BL.sans, fontSize: 12, color: BL.muted, marginTop: 2 }}>{d.loc}</div>
              </div>
              {d.status ? (
                <Tag color={d.status === 'approved' ? BL.need.ok.fg : BL.muted}
                  bg={d.status === 'approved' ? BL.need.ok.bg : BL.fill}>
                  {d.status.toUpperCase()}
                </Tag>
              ) : (
                <Tag color={BL.need[d.tone].fg} bg={BL.need[d.tone].bg}>
                  {BL.need[d.tone].label} REGION
                </Tag>
              )}
            </div>

            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
              <div style={{ flex: 1 }}>
                <Tag color={BL.muted}>WHEN</Tag>
                <div style={{ fontFamily: BL.mono, fontSize: 11, color: BL.ink, marginTop: 2 }}>{d.date}</div>
              </div>
              <div style={{ flex: 1 }}>
                <Tag color={BL.muted}>POOL</Tag>
                <div style={{ fontFamily: BL.mono, fontSize: 11, color: BL.ink, marginTop: 2 }}>{d.mem}</div>
              </div>
            </div>

            <div style={{ marginTop: 10, padding: 8, background: BL.fill, borderRadius: 4 }}>
              <Tag color={BL.muted}>FORECAST FIT</Tag>
              <div style={{ fontFamily: BL.sans, fontSize: 12, color: BL.ink2, marginTop: 2 }}>{d.why}</div>
            </div>

            <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
              <Btn variant="outline" size="sm" color={BL.muted}
                disabled={!!d.status} onClick={() => act(d.id, 'declined')}>Decline</Btn>
              <Btn variant="outline" size="sm" color={BL.muted} disabled={!!d.status}>Ask edits</Btn>
              <Btn size="sm" color={BL.ink} style={{ marginLeft: 'auto' }}
                disabled={!!d.status} onClick={() => act(d.id, 'approved')}>Approve</Btn>
            </div>
          </W>
        ))}
      </div>
    </div>
  );
}
