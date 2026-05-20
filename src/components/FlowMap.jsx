import React, { useEffect, useRef, useState } from 'react';
import { BL } from '../styles/tokens.js';
import { useApp } from '../state/AppState.jsx';

const PHONE = { w: 150, h: 280 };
const PANEL = { w: 280, h: 200 };

const SCREENS = [
  // Donor — column 1: home variants + entry states
  { id: 'home-a',          surface: 'donor', x:  140, y:  420, label: 'Home · Hero card',     wf: 'home-a' },
  { id: 'home-b',          surface: 'donor', x:  140, y:  760, label: 'Home · Timeline',      wf: 'home-b' },
  { id: 'surge-alert',     surface: 'donor', x:  140, y: 1100, label: 'Surge alert',          wf: 'surge',   tone: 'surge' },
  { id: 'profile',         surface: 'donor', x:  140, y: 1440, label: 'You · Profile',        wf: 'profile' },

  // Donor — column 2: secondary views
  { id: 'type-detail',     surface: 'donor', x:  430, y:   80, label: 'Type detail · O−',     wf: 'type-detail' },
  { id: 'booking',         surface: 'donor', x:  430, y:  420, label: 'Booking · Slots',      wf: 'booking' },
  { id: 'drives',          surface: 'donor', x:  430, y:  760, label: 'Drives',               wf: 'drives' },
  { id: 'impact',          surface: 'donor', x:  430, y: 1100, label: 'Impact',               wf: 'impact' },

  // Donor — column 3 & 4: booking flow + mobilise
  { id: 'booking-confirm', surface: 'donor', x:  720, y:  420, label: 'Booking · Confirm',    wf: 'booking-confirm' },
  { id: 'booking-success', surface: 'donor', x: 1010, y:  420, label: 'Booking · Success',    wf: 'booking-success' },
  { id: 'mobilise',        surface: 'donor', x:  720, y:  760, label: 'Mobilise org',         wf: 'mobilise' },

  // HSA cluster — right side
  { id: 'hsa-forecast',    surface: 'hsa', x: 1380, y:   80, label: 'HSA · Forecast',         wf: 'hsa-forecast' },
  { id: 'hsa-surge',       surface: 'hsa', x: 1740, y:   80, label: 'HSA · Surge Mode',       wf: 'hsa-surge', tone: 'surge' },
  { id: 'hsa-donors',      surface: 'hsa', x: 1380, y:  360, label: 'HSA · Donor pool',       wf: 'hsa-donors' },
  { id: 'hsa-drives',      surface: 'hsa', x: 1740, y:  360, label: 'HSA · Drive queue',      wf: 'hsa-drives' },
  { id: 'hsa-hospitals',   surface: 'hsa', x: 1380, y:  640, label: 'HSA · Hospital demand',  wf: 'hsa-hospitals' },
  { id: 'hsa-reports',     surface: 'hsa', x: 1740, y:  640, label: 'HSA · Reports',          wf: 'placeholder' },
];

const EDGES = [
  // Home → secondary
  { from: 'home-a', to: 'booking',         label: 'Book a slot' },
  { from: 'home-a', to: 'booking-confirm', label: 'nearest slot' },
  { from: 'home-a', to: 'type-detail',     label: 'tap chip' },
  { from: 'home-a', to: 'profile',         label: 'avatar' },
  { from: 'home-b', to: 'booking-confirm', label: 'Book 11:20' },
  { from: 'home-b', to: 'booking',         label: 'other times' },
  { from: 'home-b', to: 'type-detail',     label: 'tap chip' },

  // Surge alert (replaces home when surge active)
  { from: 'home-a',      to: 'surge-alert',     label: 'surge on',  dashed: true, color: BL.surge },
  { from: 'surge-alert', to: 'booking-confirm', label: 'book slot', color: BL.surge },
  { from: 'surge-alert', to: 'mobilise',        label: 'mobilise',  color: BL.surge },

  // Type detail
  { from: 'type-detail', to: 'booking', label: 'book slot' },

  // Booking flow
  { from: 'booking',         to: 'booking-confirm', label: 'pick' },
  { from: 'booking-confirm', to: 'booking-success', label: 'confirm' },
  { from: 'booking-success', to: 'home-a',          label: 'done',     dashed: true },
  { from: 'booking-success', to: 'mobilise',        label: 'mobilise' },

  // Tabs from home
  { from: 'home-a', to: 'drives', label: 'tab'  },
  { from: 'home-a', to: 'impact', label: 'tab'  },

  // Drives → mobilise
  { from: 'drives', to: 'mobilise', label: 'organise drive' },

  // HSA console
  { from: 'hsa-hospitals', to: 'hsa-surge',  label: 'emergency → activator', color: BL.surge },
  { from: 'hsa-forecast',  to: 'hsa-surge',  label: 'forecast → surge' },
  { from: 'hsa-donors',    to: 'hsa-drives', label: 'segment → drive' },

  // Cross-surface switch
  { from: 'home-a',       to: 'hsa-forecast', label: 'switch surface', dashed: true, color: BL.muted },
];

const CANVAS = { w: 2120, h: 1820 };

const screenById = (id) => SCREENS.find((s) => s.id === id);
const dims = (s) => (s.surface === 'donor' ? PHONE : PANEL);
const center = (s) => {
  const d = dims(s);
  return { x: s.x + d.w / 2, y: s.y + d.h / 2 };
};

function edgePoint(src, tgt) {
  const c = center(src);
  const t = center(tgt);
  const d = dims(src);
  const dx = t.x - c.x;
  const dy = t.y - c.y;
  if (dx === 0 && dy === 0) return [c.x, c.y];
  const hw = d.w / 2 + 6;
  const hh = d.h / 2 + 6;
  const ax = Math.abs(dx);
  const ay = Math.abs(dy);
  if (ax * hh > ay * hw) {
    const sign = dx > 0 ? 1 : -1;
    return [c.x + sign * hw, c.y + (dy / ax) * hw];
  }
  const sign = dy > 0 ? 1 : -1;
  return [c.x + (dx / ay) * hh, c.y + sign * hh];
}

export function FlowMap() {
  const { s, set } = useApp();
  const containerRef = useRef(null);
  const dragRef = useRef(null);
  const [scale, setScale] = useState(0.55);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPan({ x: (r.width - CANVAS.w * 0.55) / 2, y: 40 });
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') set({ showFlowMap: false });
      if (e.key === '0') { setScale(0.55); centerCanvas(); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  function centerCanvas() {
    const el = containerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPan({ x: (r.width - CANVAS.w * 0.55) / 2, y: 40 });
  }

  function onMouseDown(e) {
    if (e.button !== 0) return;
    dragRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  }
  function onMouseMove(e) {
    if (!dragRef.current) return;
    setPan({ x: e.clientX - dragRef.current.x, y: e.clientY - dragRef.current.y });
  }
  function onMouseUp() { dragRef.current = null; }

  function onWheel(e) {
    e.preventDefault();
    const r = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const my = e.clientY - r.top;
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    const next = Math.max(0.22, Math.min(1.4, scale * factor));
    const sx = (mx - pan.x) / scale;
    const sy = (my - pan.y) / scale;
    setPan({ x: mx - sx * next, y: my - sy * next });
    setScale(next);
  }

  function jumpToScreen(s) {
    // jump donor/hsa surface + relevant tab/screen and dismiss map
    const patch = { showFlowMap: false };
    if (s.surface === 'donor') {
      patch.view = 'donor';
      const mapTabScreen = {
        'home-a':          { donorTab: 'home',    donorScreen: null, surgeActive: false, homeVariant: 'A' },
        'home-b':          { donorTab: 'home',    donorScreen: null, surgeActive: false, homeVariant: 'B' },
        'surge-alert':     { donorTab: 'home',    donorScreen: null, surgeActive: true,  surgeSnoozed: false },
        'type-detail':     { donorTab: 'home',    donorScreen: 'type-detail' },
        'booking':         { donorTab: 'home',    donorScreen: 'booking' },
        'booking-confirm': { donorTab: 'home',    donorScreen: 'booking-confirm' },
        'booking-success': { donorTab: 'home',    donorScreen: 'booking-success' },
        'mobilise':        { donorTab: 'home',    donorScreen: 'mobilise' },
        'drives':          { donorTab: 'drives',  donorScreen: null },
        'impact':          { donorTab: 'impact',  donorScreen: null },
        'profile':         { donorTab: 'profile', donorScreen: null },
      }[s.id];
      Object.assign(patch, mapTabScreen);
    } else {
      patch.view = 'hsa';
      patch.hsaTab = s.id.replace('hsa-', '');
    }
    set(patch);
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: '#f0ede5',
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        overflow: 'hidden', userSelect: 'none',
      }}
    >
      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px', background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${BL.hair}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 18, height: 18, borderRadius: 3, background: BL.red }} />
          <div style={{ fontFamily: BL.sans, fontSize: 14, fontWeight: 600, color: BL.ink }}>BloodLine · Flow map</div>
          <div style={{ width: 1, height: 14, background: BL.hair }} />
          <div style={{ fontFamily: BL.mono, fontSize: 10, color: BL.muted, letterSpacing: 0.6 }}>
            {SCREENS.length} SCREENS · {EDGES.length} TRANSITIONS
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: BL.mono, fontSize: 10, color: BL.muted }}>
            DRAG · SCROLL · CLICK · ESC
          </span>
          <button
            onClick={() => setScale((v) => Math.min(1.4, v * 1.15))}
            style={zoomBtn}
          >+</button>
          <button
            onClick={() => setScale((v) => Math.max(0.22, v * 0.87))}
            style={zoomBtn}
          >−</button>
          <button
            onClick={() => { setScale(0.55); centerCanvas(); }}
            style={{ ...zoomBtn, width: 'auto', padding: '0 10px' }}
          >Reset</button>
          <button
            onClick={() => set({ showFlowMap: false })}
            style={{ ...zoomBtn, background: BL.ink, color: '#fff', borderColor: BL.ink, width: 'auto', padding: '0 12px' }}
          >Exit map</button>
        </div>
      </div>

      {/* Pannable canvas */}
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
        style={{ position: 'absolute', inset: 0, marginTop: 52, cursor: dragRef.current ? 'grabbing' : 'grab' }}
      >
        <div style={{
          position: 'absolute', left: 0, top: 0,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          width: CANVAS.w, height: CANVAS.h,
        }}>
          {/* Cluster labels */}
          <ClusterFrame x={80} y={20} w={1230} h={1740} label="DONOR APP" />
          <ClusterFrame x={1340} y={20} w={760}  h={820}  label="HSA OPERATIONS CONSOLE" />

          {/* Arrows behind */}
          <svg
            width={CANVAS.w} height={CANVAS.h}
            style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}
          >
            <defs>
              <marker id="arr-muted" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={BL.muted} />
              </marker>
              <marker id="arr-surge" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={BL.surge} />
              </marker>
              <marker id="arr-ink" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={BL.ink} />
              </marker>
            </defs>
            {EDGES.map((e, i) => {
              const src = screenById(e.from);
              const tgt = screenById(e.to);
              if (!src || !tgt) return null;
              const [x1, y1] = edgePoint(src, tgt);
              const [x2, y2] = edgePoint(tgt, src);
              const isHover = hover && (hover === e.from || hover === e.to);
              const stroke = e.color || (isHover ? BL.ink : BL.muted);
              const marker = e.color === BL.surge ? 'arr-surge' : (isHover ? 'arr-ink' : 'arr-muted');
              const opacity = hover && !isHover ? 0.25 : 1;
              const mx = (x1 + x2) / 2;
              const my = (y1 + y2) / 2;
              const curveX = (x1 + x2) / 2;
              const curveY = (y1 + y2) / 2;
              const d = `M ${x1} ${y1} Q ${curveX} ${curveY} ${x2} ${y2}`;
              return (
                <g key={i} opacity={opacity}>
                  <path
                    d={d}
                    stroke={stroke}
                    strokeWidth={isHover ? 2 : 1.4}
                    strokeDasharray={e.dashed ? '6 5' : ''}
                    fill="none"
                    markerEnd={`url(#${marker})`}
                  />
                  {e.label && (
                    <g transform={`translate(${mx}, ${my})`}>
                      <rect x={-e.label.length * 3.2 - 6} y={-9} width={e.label.length * 6.4 + 12} height={18}
                        fill="#f0ede5" stroke={BL.hair} rx="3" />
                      <text x="0" y="4" textAnchor="middle"
                        fontFamily={BL.mono} fontSize="10" fill={stroke}
                        style={{ letterSpacing: 0.2 }}>
                        {e.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Screen tiles on top */}
          {SCREENS.map((sc) => (
            <ScreenTile
              key={sc.id}
              screen={sc}
              hover={hover === sc.id}
              dimmed={hover && hover !== sc.id && !EDGES.some((e) => (e.from === hover && e.to === sc.id) || (e.to === hover && e.from === sc.id))}
              onEnter={() => setHover(sc.id)}
              onLeave={() => setHover(null)}
              onClick={() => jumpToScreen(sc)}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: 16, left: 16, zIndex: 10,
        padding: '10px 12px', background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${BL.hair}`, borderRadius: 6,
        fontFamily: BL.mono, fontSize: 10, color: BL.muted, letterSpacing: 0.4,
        display: 'flex', gap: 14, alignItems: 'center',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 18, height: 1.5, background: BL.muted }} /> Tap / nav
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 18, height: 1.5, background: BL.surge }} /> Surge path
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 18, borderTop: `1.5px dashed ${BL.muted}` }} /> System trigger
        </span>
        <span style={{ marginLeft: 6 }}>CLICK A SCREEN TO JUMP</span>
      </div>
    </div>
  );
}

const zoomBtn = {
  width: 28, height: 28, borderRadius: 6,
  background: '#fff', color: BL.ink, border: `1px solid ${BL.hair}`,
  fontFamily: BL.sans, fontSize: 14, fontWeight: 600,
  cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
};

function ClusterFrame({ x, y, w, h, label }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: w, height: h,
      border: `1px dashed ${BL.rule}`, borderRadius: 12, pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute', top: -10, left: 16, padding: '0 8px', background: '#f0ede5',
        fontFamily: BL.mono, fontSize: 10, fontWeight: 600, color: BL.muted, letterSpacing: 0.6,
      }}>{label}</div>
    </div>
  );
}

function ScreenTile({ screen, hover, dimmed, onEnter, onLeave, onClick }) {
  const d = dims(screen);
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        position: 'absolute', left: screen.x, top: screen.y,
        width: d.w + 20,
        cursor: 'pointer',
        opacity: dimmed ? 0.45 : 1,
        transition: 'opacity 0.15s, transform 0.15s',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      <div style={{
        width: d.w, height: d.h, background: '#fff',
        border: `${hover ? 2 : 1}px solid ${hover ? BL.ink : (screen.tone === 'surge' ? `${BL.surge}88` : BL.hair)}`,
        borderRadius: screen.surface === 'donor' ? 18 : 8,
        boxShadow: hover ? '0 16px 40px rgba(0,0,0,0.18)' : '0 2px 6px rgba(0,0,0,0.06)',
        overflow: 'hidden', position: 'relative',
      }}>
        <Wireframe kind={screen.wf} surface={screen.surface} />
      </div>
      <div style={{
        marginTop: 8, fontFamily: BL.mono, fontSize: 11, color: hover ? BL.ink : BL.muted,
        textAlign: 'center', letterSpacing: 0.4, fontWeight: hover ? 600 : 400,
        textTransform: 'uppercase', width: d.w,
      }}>
        {screen.label}
      </div>
    </div>
  );
}

/* ============================================================
 * Wireframes — abstract miniatures of each screen
 * ============================================================ */

const Bar = ({ w = '70%', h = 4, c = BL.hair, mt = 0, mb = 0, ml = 0, r = 2, style }) => (
  <div style={{ width: w, height: h, background: c, marginTop: mt, marginBottom: mb, marginLeft: ml, borderRadius: r, ...style }} />
);
const Block = ({ h = 30, c = BL.fill, mt = 8, r = 4, children, style }) => (
  <div style={{ height: h, background: c, marginTop: mt, borderRadius: r, padding: 6, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...style }}>
    {children}
  </div>
);

function PhoneHeader({ kicker = 'BLOODLINE', title = 'Tan Wei Ming', sub }) {
  return (
    <div style={{ padding: '14px 12px 8px' }}>
      <div style={{ fontFamily: BL.mono, fontSize: 7, color: BL.muted, letterSpacing: 0.6, textTransform: 'uppercase' }}>{kicker}</div>
      <div style={{ fontFamily: BL.sans, fontSize: 11, fontWeight: 600, color: BL.ink, marginTop: 2 }}>{title}</div>
      {sub && <div style={{ fontFamily: BL.sans, fontSize: 8, color: BL.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function TabBar({ active = 'home' }) {
  const tabs = [
    { k: 'home', l: 'Home' },
    { k: 'drives', l: 'Drives' },
    { k: 'impact', l: 'Impact' },
    { k: 'profile', l: 'You' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 28,
      borderTop: `1px solid ${BL.hair}`, background: BL.card,
      display: 'flex', alignItems: 'center', justifyContent: 'space-around', paddingBottom: 4,
    }}>
      {tabs.map((t) => (
        <div key={t.k} style={{ textAlign: 'center', flex: 1 }}>
          <div style={{
            width: 10, height: 10, margin: '0 auto 1px',
            border: `1px solid ${active === t.k ? BL.ink : BL.faint}`,
            background: active === t.k ? BL.ink : 'transparent',
            borderRadius: 2,
          }} />
          <div style={{ fontFamily: BL.sans, fontSize: 6, color: active === t.k ? BL.ink : BL.faint, fontWeight: 500 }}>
            {t.l}
          </div>
        </div>
      ))}
    </div>
  );
}

function HSAShell({ children, activeTab = 'forecast' }) {
  const nav = [
    { k: 'forecast', l: 'Forecast' },
    { k: 'surge', l: 'Surge' },
    { k: 'donors', l: 'Donors' },
    { k: 'drives', l: 'Drives' },
    { k: 'hospitals', l: 'Hospitals' },
    { k: 'reports', l: 'Reports' },
  ];
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <div style={{ width: 60, background: '#1a1917', color: '#e9e6e0', padding: '8px 4px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '0 4px 6px' }}>
          <div style={{ width: 6, height: 6, borderRadius: 1, background: BL.red }} />
          <span style={{ fontFamily: BL.sans, fontSize: 6, fontWeight: 600 }}>BloodLine</span>
        </div>
        {nav.map((n) => (
          <div key={n.k} style={{
            padding: '3px 4px',
            background: activeTab === n.k ? '#2a2723' : 'transparent',
            borderLeft: activeTab === n.k ? `1.5px solid ${BL.red}` : '1.5px solid transparent',
            fontFamily: BL.sans, fontSize: 6,
            color: activeTab === n.k ? '#fff' : '#8e8a82',
            marginBottom: 1, borderRadius: 1,
          }}>
            {n.l}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 5, borderBottom: `1px solid ${BL.hair}` }}>
          <span style={{ fontFamily: BL.mono, fontSize: 6, color: BL.muted, letterSpacing: 0.5 }}>
            HSA · {nav.find((n) => n.k === activeTab)?.l.toUpperCase()}
          </span>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: BL.fill }} />
        </div>
        {children}
      </div>
    </div>
  );
}

function Wireframe({ kind, surface }) {
  if (surface === 'hsa') return <HSAFrame kind={kind} />;
  return <PhoneFrame kind={kind} />;
}

function PhoneFrame({ kind }) {
  switch (kind) {
    case 'home-a':
      return (
        <>
          <PhoneHeader />
          <div style={{ padding: '0 12px' }}>
            <Block h={42} c={BL.card} style={{ border: `1px solid ${BL.hair}` }}>
              <Bar w="40%" h={3} c={BL.muted} mb={3} />
              <Bar w="80%" h={6} c={BL.ink} />
              <Bar w="60%" h={3} c={BL.faint} mt={4} />
            </Block>
            <Block h={56} c={BL.card} style={{ border: `1px solid ${BL.hair}` }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <div style={{ width: 18, height: 18, borderRadius: 3, background: BL.need.critical.bg, color: BL.need.critical.fg, fontFamily: BL.mono, fontSize: 7, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>O−</div>
                <div style={{ flex: 1 }}>
                  <Bar w="70%" h={3} c={BL.ink} />
                  <Bar w="90%" h={2.5} c={BL.faint} mt={2} />
                </div>
              </div>
              <Block h={12} c={BL.ink} mt={4} r={2} />
            </Block>
            <Block h={28} c={BL.card} style={{ border: `1px solid ${BL.hair}` }}>
              <Bar w="35%" h={3} c={BL.muted} mb={3} />
              <div style={{ display: 'flex', gap: 2 }}>
                {['critical','urgent','low','ok','low','urgent','critical','ok'].map((n, i) => (
                  <div key={i} style={{ flex: 1, height: 8, background: BL.need[n].bg, borderRadius: 1 }} />
                ))}
              </div>
            </Block>
          </div>
          <TabBar active="home" />
        </>
      );

    case 'home-b':
      return (
        <>
          <PhoneHeader kicker="GOOD MORNING" title="Hi, Wei Ming" />
          <div style={{ padding: '0 12px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ display: 'flex', gap: 5, marginTop: 8 }}>
                <div style={{ width: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
                  <div style={{ width: 4, height: 4, borderRadius: 2, background: i === 2 ? BL.red : BL.ink }} />
                  {i < 3 && <div style={{ width: 1, flex: 1, background: BL.hair, marginTop: 2, minHeight: 30 }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <Bar w="40%" h={3} c={BL.muted} mb={3} />
                  <Bar w="70%" h={6} c={BL.ink} />
                  <Bar w="90%" h={2.5} c={BL.faint} mt={3} />
                </div>
              </div>
            ))}
          </div>
          <TabBar active="home" />
        </>
      );

    case 'surge':
      return (
        <>
          <div style={{ background: BL.surgeBg, borderBottom: `1px solid ${BL.surge}33`, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 5, height: 5, borderRadius: 3, background: BL.surge, animation: 'bl-pulse 2s infinite' }} />
            <Bar w={60} h={4} c={BL.surge} />
          </div>
          <div style={{ padding: '10px 12px' }}>
            <Bar w="40%" h={3} c={BL.muted} mb={4} />
            <Bar w="85%" h={10} c={BL.ink} />
            <Bar w="80%" h={3} c={BL.muted} mt={5} />
            <Bar w="70%" h={3} c={BL.muted} mt={2} />
            <Block h={50} c={BL.surgeBg} mt={8} style={{ border: `1px solid ${BL.surge}55` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Bar w={40} h={4} c={BL.ink} />
                <div style={{ width: 16, height: 16, borderRadius: 2, background: BL.need.critical.bg, color: BL.need.critical.fg, fontFamily: BL.mono, fontSize: 7, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>O−</div>
              </div>
              <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>
                {[1, 2, 3].map((i) => <div key={i} style={{ flex: 1, height: 6, background: '#fff', border: `1px solid ${BL.hair}`, borderRadius: 1 }} />)}
              </div>
              <Block h={10} c={BL.surge} mt={4} r={2} />
            </Block>
            <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
              <Block h={14} c={BL.fill} mt={0} style={{ flex: 1, border: `1px solid ${BL.hair}` }} />
              <Block h={14} c={BL.fill} mt={0} style={{ width: 40, border: `1px solid ${BL.hair}` }} />
            </div>
          </div>
          <TabBar active="home" />
        </>
      );

    case 'type-detail':
      return (
        <>
          <div style={{ padding: '14px 12px 4px' }}>
            <Bar w={24} h={4} c={BL.ink} />
          </div>
          <div style={{ padding: '0 12px' }}>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 4, background: BL.need.critical.bg, color: BL.need.critical.fg, fontFamily: BL.mono, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>O−</div>
              <div style={{ flex: 1 }}>
                <Bar w={30} h={3} c={BL.need.critical.fg} mb={3} style={{ background: BL.need.critical.bg, padding: 1 }} />
                <Bar w="70%" h={8} c={BL.ink} />
                <Bar w="40%" h={2.5} c={BL.muted} mt={3} />
              </div>
            </div>
            <Block h={36} c={BL.card} mt={10} style={{ border: `1px solid ${BL.hair}` }}>
              <Bar w="35%" h={3} c={BL.muted} mb={4} />
              <svg viewBox="0 0 100 20" style={{ display: 'block', width: '100%', height: 14 }}>
                <path d="M 0 6 L 15 8 L 30 11 L 45 14 L 60 16 L 75 14 L 90 10" stroke={BL.red} strokeWidth="1.5" fill="none" />
              </svg>
            </Block>
            <Block h={20} c={BL.ink} mt={6} r={3} />
          </div>
          <TabBar active="home" />
        </>
      );

    case 'booking':
      return (
        <>
          <div style={{ padding: '14px 12px 4px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Bar w={16} h={4} c={BL.ink} />
            <Bar w={60} h={3} c={BL.muted} />
          </div>
          <div style={{ padding: '4px 12px' }}>
            {['Bloodbank@HSA', 'Dhoby Ghaut', 'Westgate'].map((venue, i) => (
              <Block key={i} h={32} c={BL.card} mt={6} style={{ border: `1px solid ${BL.hair}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Bar w={60} h={3.5} c={BL.ink} />
                    <Bar w={50} h={2.5} c={BL.muted} mt={3} />
                  </div>
                  <Block h={11} c={BL.fill} mt={0} style={{ width: 28, border: `1px solid ${BL.hair}` }} />
                </div>
              </Block>
            ))}
          </div>
        </>
      );

    case 'booking-confirm':
      return (
        <>
          <div style={{ padding: '14px 12px 4px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Bar w={16} h={4} c={BL.ink} />
            <Bar w={60} h={3} c={BL.muted} />
          </div>
          <div style={{ padding: '4px 12px' }}>
            <Block h={48} c={BL.fill} mt={6}>
              <Bar w="40%" h={3} c={BL.muted} mb={4} />
              <Bar w="85%" h={7} c={BL.ink} />
              <Bar w="70%" h={3} c={BL.muted} mt={5} />
            </Block>
            <Block h={36} c={BL.card} mt={6} style={{ border: `1px solid ${BL.hair}` }}>
              <Bar w="50%" h={3} c={BL.muted} mb={3} />
              <Bar w="40%" h={3} c={BL.ink} mt={2} />
              <Bar w="45%" h={3} c={BL.ink} mt={3} />
            </Block>
            <Block h={16} c={BL.ink} mt={8} r={3} />
          </div>
        </>
      );

    case 'booking-success':
      return (
        <>
          <div style={{ padding: '14px 12px 4px' }}>
            <Bar w={50} h={3} c={BL.muted} />
          </div>
          <div style={{ padding: '12px 12px', textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: BL.need.ok.bg, color: BL.need.ok.fg, fontFamily: BL.mono, fontSize: 20, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '6px auto 8px' }}>✓</div>
            <Bar w="60%" h={8} c={BL.ink} style={{ margin: '0 auto' }} />
            <Bar w="50%" h={3} c={BL.muted} mt={5} style={{ margin: '5px auto 0' }} />
            <Block h={32} c={BL.fill} mt={10} style={{ textAlign: 'left' }}>
              <Bar w="40%" h={3} c={BL.muted} mb={3} />
              <Bar w="80%" h={3} c={BL.ink} mt={2} />
              <Bar w="65%" h={3} c={BL.ink} mt={3} />
            </Block>
            <Block h={14} c={BL.ink} mt={8} r={3} />
            <Block h={12} c={BL.card} mt={4} style={{ border: `1px solid ${BL.hair}` }} />
          </div>
        </>
      );

    case 'mobilise':
      return (
        <>
          <div style={{ padding: '14px 12px 4px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Bar w={14} h={3} c={BL.ink} />
            <Bar w={50} h={3} c={BL.muted} />
          </div>
          <div style={{ padding: '4px 12px' }}>
            <div style={{ display: 'flex', gap: 3, marginBottom: 8 }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} style={{ flex: 1, height: 3, background: i <= 2 ? BL.ink : BL.hair, borderRadius: 1.5 }} />
              ))}
            </div>
            <Bar w="45%" h={3} c={BL.muted} mt={6} />
            <Bar w="70%" h={7} c={BL.ink} mt={3} />
            <Block h={42} c={BL.card} mt={8} style={{ border: `1px solid ${BL.hair}` }}>
              <Bar w="60%" h={3} c={BL.ink} />
              <Bar w="40%" h={2.5} c={BL.muted} mt={3} />
              <div style={{ display: 'flex', gap: 3, marginTop: 4 }}>
                {[1, 2, 3].map((i) => <div key={i} style={{ flex: 1, height: 5, background: BL.fill, borderRadius: 1 }} />)}
              </div>
            </Block>
            <Block h={14} c={BL.ink} mt={8} r={3} />
          </div>
        </>
      );

    case 'drives':
      return (
        <>
          <PhoneHeader kicker="THIS WEEK" title="Drives near you" sub="3 active · 1 you joined" />
          <div style={{ padding: '0 12px' }}>
            {['DBS · Group Tech', 'NUS · UTown', 'SCDF · Open House'].map((d, i) => (
              <Block key={i} h={28} c={BL.card} mt={6} style={{ border: `1px solid ${BL.hair}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <Bar w={50} h={3.5} c={BL.ink} />
                    <Bar w={36} h={2.5} c={BL.muted} mt={3} />
                  </div>
                  <Block h={10} c={BL.need.ok.bg} mt={0} style={{ width: 24, border: 'none' }} />
                </div>
              </Block>
            ))}
            <Block h={14} c={BL.ink} mt={10} r={3} />
          </div>
          <TabBar active="drives" />
        </>
      );

    case 'impact':
      return (
        <>
          <PhoneHeader kicker="YOUR IMPACT" title="3 donations" sub="9 lives touched" />
          <div style={{ padding: '0 12px' }}>
            <Block h={50} c={BL.card} style={{ border: `1px solid ${BL.hair}` }}>
              <Bar w="35%" h={3} c={BL.muted} mb={4} />
              <div style={{ fontFamily: BL.sans, fontSize: 24, fontWeight: 600, color: BL.ink, marginTop: 2 }}>9</div>
              <Bar w="60%" h={2.5} c={BL.muted} mt={2} />
            </Block>
            <Block h={30} c={BL.card} mt={6} style={{ border: `1px solid ${BL.hair}` }}>
              <Bar w="35%" h={3} c={BL.muted} mb={3} />
              <div style={{ display: 'flex', gap: 3, marginTop: 2 }}>
                {[10, 20, 14, 22, 16, 24, 28].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: h / 2.5, background: BL.ink, alignSelf: 'flex-end' }} />
                ))}
              </div>
            </Block>
          </div>
          <TabBar active="impact" />
        </>
      );

    case 'profile':
      return (
        <>
          <PhoneHeader kicker="YOU" title="Tan Wei Ming" sub="O− · 3 donations · last 14 Mar 2026" />
          <div style={{ padding: '0 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: BL.fill, border: `1px solid ${BL.hair}` }} />
              <div style={{ flex: 1 }}>
                <Bar w="60%" h={3} c={BL.ink} />
                <Bar w="40%" h={2.5} c={BL.muted} mt={3} />
              </div>
            </div>
            {['Notifications', 'Eligibility', 'History', 'Sign out'].map((row, i) => (
              <div key={i} style={{ padding: '6px 0', borderTop: `1px solid ${BL.hair}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Bar w={36} h={3} c={BL.ink} />
                <Bar w={4} h={4} c={BL.faint} />
              </div>
            ))}
          </div>
          <TabBar active="profile" />
        </>
      );

    default:
      return <PhoneHeader title="—" />;
  }
}

function HSAFrame({ kind }) {
  switch (kind) {
    case 'hsa-forecast':
      return (
        <HSAShell activeTab="forecast">
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ flex: 1, background: BL.card, border: `1px solid ${BL.hair}`, padding: 4, borderRadius: 2 }}>
                <Bar w="50%" h={2} c={BL.muted} mb={2} />
                <Bar w="70%" h={5} c={BL.ink} />
              </div>
            ))}
          </div>
          <div style={{ flex: 1, background: BL.card, border: `1px solid ${BL.hair}`, padding: 4, borderRadius: 2, position: 'relative' }}>
            <Bar w={30} h={2} c={BL.muted} mb={3} />
            <svg viewBox="0 0 200 40" style={{ display: 'block', width: '100%', height: 30 }}>
              <path d="M 10 20 L 50 18 L 90 25 L 130 30 L 170 28 L 190 22" stroke={BL.ink} strokeWidth="1" fill="none" />
              <path d="M 70 5 L 70 38 L 190 28 L 190 5 Z" fill={BL.redSoft} opacity="0.5" />
              <path d="M 70 22 L 100 28 L 130 32 L 160 30 L 190 26" stroke={BL.red} strokeWidth="1" strokeDasharray="2 2" fill="none" />
            </svg>
          </div>
        </HSAShell>
      );

    case 'hsa-surge':
      return (
        <HSAShell activeTab="surge">
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <div style={{ width: 4, height: 4, borderRadius: 2, background: BL.surge }} />
            <Bar w={50} h={2.5} c={BL.surge} />
          </div>
          <Block h={26} c={BL.surgeBg} mt={4} style={{ border: `1px solid ${BL.surge}55`, padding: 4 }}>
            <Bar w={30} h={2} c={BL.muted} mb={2} />
            <div style={{ display: 'flex', gap: 2 }}>
              {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} style={{ width: 8, height: 8, background: i <= 2 ? BL.need.critical.bg : '#fff', border: `1px solid ${BL.hair}`, borderRadius: 1 }} />)}
            </div>
          </Block>
          <Block h={20} c={BL.card} mt={4} style={{ border: `1px solid ${BL.hair}`, padding: 4 }}>
            <Bar w={40} h={2} c={BL.muted} mb={2} />
            <div style={{ display: 'flex', gap: 3 }}>
              <div style={{ width: 12, height: 6, background: BL.ink, borderRadius: 1 }} />
              <div style={{ width: 12, height: 6, background: BL.ink, borderRadius: 1 }} />
              <div style={{ width: 12, height: 6, background: BL.fill, borderRadius: 1, border: `1px solid ${BL.hair}` }} />
            </div>
          </Block>
          <Block h={12} c={BL.surge} mt={4} r={2} />
        </HSAShell>
      );

    case 'hsa-donors':
      return (
        <HSAShell activeTab="donors">
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ flex: 1, background: BL.card, border: `1px solid ${BL.hair}`, padding: 4, borderRadius: 2 }}>
                <Bar w="50%" h={2} c={BL.muted} mb={2} />
                <Bar w="70%" h={5} c={BL.ink} />
              </div>
            ))}
          </div>
          <div style={{ flex: 1, background: BL.card, border: `1px solid ${BL.hair}`, padding: 4, borderRadius: 2 }}>
            <Bar w={40} h={2} c={BL.muted} mb={3} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2 }}>
              {Array.from({ length: 24 }).map((_, i) => {
                const tones = ['ok', 'ok', 'low', 'urgent', 'low', 'ok'];
                const n = tones[i % 6];
                return <div key={i} style={{ height: 10, background: BL.need[n].bg, borderRadius: 1 }} />;
              })}
            </div>
          </div>
        </HSAShell>
      );

    case 'hsa-drives':
      return (
        <HSAShell activeTab="drives">
          <div style={{ flex: 1, background: BL.card, border: `1px solid ${BL.hair}`, padding: 4, borderRadius: 2 }}>
            <Bar w={50} h={2} c={BL.muted} mb={3} />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0', borderTop: i > 1 ? `1px solid ${BL.hair}` : 'none' }}>
                <Bar w={50} h={3} c={BL.ink} />
                <Bar w={14} h={6} c={i === 2 ? BL.need.urgent.bg : BL.need.ok.bg} />
              </div>
            ))}
          </div>
        </HSAShell>
      );

    case 'hsa-hospitals':
      return (
        <HSAShell activeTab="hospitals">
          <Block h={28} c={BL.surgeBg} mt={0} style={{ border: `1px solid ${BL.surge}55`, padding: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <div style={{ width: 4, height: 4, borderRadius: 2, background: BL.surge, animation: 'bl-pulse 2s infinite' }} />
              <Bar w={50} h={2} c={BL.surge} />
            </div>
            <Bar w="80%" h={4} c={BL.ink} mt={3} />
            <div style={{ display: 'flex', gap: 3, marginTop: 4 }}>
              <div style={{ width: 22, height: 8, background: BL.surge, borderRadius: 1 }} />
              <div style={{ width: 22, height: 8, background: '#fff', border: `1px solid ${BL.hair}`, borderRadius: 1 }} />
            </div>
          </Block>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, marginTop: 4 }}>
            {['critical', 'urgent', 'low', 'ok', 'ok', 'low'].map((n, i) => (
              <div key={i} style={{ background: BL.card, border: `1px solid ${BL.hair}`, padding: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Bar w={18} h={2} c={BL.muted} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <Bar w={20} h={5} c={BL.ink} />
                  <div style={{ width: 12, height: 4, background: BL.need[n].bg, borderRadius: 1 }} />
                </div>
              </div>
            ))}
          </div>
        </HSAShell>
      );

    case 'placeholder':
    default:
      return (
        <HSAShell activeTab="reports">
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 5 }}>
            <Bar w={40} h={3} c={BL.muted} />
            <Bar w={70} h={4} c={BL.faint} />
          </div>
        </HSAShell>
      );
  }
}
