import React from 'react';
import { BL, BLOOD_TYPES } from '../styles/tokens.js';

export function W({ children, style, pad = 12, hair = true, ...rest }) {
  return (
    <div
      style={{
        background: BL.card,
        border: hair ? `1px solid ${BL.hair}` : 'none',
        borderRadius: 6,
        padding: pad,
        fontFamily: BL.sans,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Tag({ children, color = BL.muted, bg, style }) {
  return (
    <span
      style={{
        fontFamily: BL.mono,
        fontSize: 9,
        letterSpacing: 0.6,
        textTransform: 'uppercase',
        color,
        background: bg,
        padding: bg ? '2px 6px' : 0,
        borderRadius: 3,
        display: 'inline-block',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function Slot({ label, height = 80, style, dashed = true, children }) {
  return (
    <div
      style={{
        height,
        border: dashed ? `1px dashed ${BL.rule}` : `1px solid ${BL.hair}`,
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: BL.faint,
        fontFamily: BL.mono,
        fontSize: 10,
        letterSpacing: 0.4,
        background: BL.paper,
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
      {label && !children && <span>{label}</span>}
    </div>
  );
}

export function Bar({ w = '100%', h = 8, c = BL.hair, style }) {
  return <div style={{ width: w, height: h, background: c, borderRadius: 2, ...style }} />;
}

export function H({ children, size = 13, mb = 6, mono = false, color = BL.ink, style }) {
  return (
    <div
      style={{
        fontFamily: mono ? BL.mono : BL.sans,
        fontSize: size,
        fontWeight: mono ? 500 : 600,
        color,
        marginBottom: mb,
        letterSpacing: mono ? 0.4 : -0.1,
        textTransform: mono ? 'uppercase' : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Btn({ children, variant = 'fill', size = 'md', color = BL.ink, full, style, ...rest }) {
  const h = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
  const fs = size === 'sm' ? 12 : size === 'lg' ? 15 : 13;
  const styles = {
    fill: { background: color, color: '#fff', border: `1px solid ${color}` },
    outline: { background: 'transparent', color, border: `1px solid ${color}` },
    ghost: { background: 'transparent', color, border: '1px solid transparent' },
    soft: { background: BL.fill, color: BL.ink, border: `1px solid ${BL.hair}` },
  }[variant];
  return (
    <button
      style={{
        height: h,
        padding: `0 ${size === 'sm' ? 10 : 14}px`,
        borderRadius: size === 'lg' ? 8 : 6,
        fontFamily: BL.sans,
        fontSize: fs,
        fontWeight: 500,
        width: full ? '100%' : 'auto',
        cursor: 'pointer',
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
        display: full ? 'flex' : 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        ...styles,
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

export function BloodChip({ type, need = 'ok', size = 'md', selected = false }) {
  const n = BL.need[need];
  const dims = {
    sm: { w: 28, h: 28, fs: 10 },
    md: { w: 36, h: 36, fs: 12 },
    lg: { w: 56, h: 56, fs: 18 },
    xl: { w: 96, h: 96, fs: 30 },
  }[size];
  return (
    <div
      style={{
        width: dims.w,
        height: dims.h,
        borderRadius: 6,
        background: n.bg,
        color: n.fg,
        border: selected ? `2px solid ${BL.ink}` : `1px solid ${n.fg}22`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: BL.mono,
        fontSize: dims.fs,
        fontWeight: 600,
        letterSpacing: -0.4,
      }}
    >
      {type}
    </div>
  );
}

export function NationalRail({ size = 'sm', highlight }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {BLOOD_TYPES.map(({ t, n }) => (
        <BloodChip key={t} type={t} need={n} size={size} selected={highlight === t} />
      ))}
    </div>
  );
}

export function Spark({ w = 80, h = 24, points, color = BL.ink }) {
  const data = points || [4, 6, 5, 7, 8, 6, 9, 7, 10, 8, 11, 9, 12, 14];
  const max = Math.max(...data);
  const min = Math.min(...data);
  const xs = data.map((_, i) => (i / (data.length - 1)) * w);
  const ys = data.map((v) => h - ((v - min) / (max - min || 1)) * (h - 2) - 1);
  const d = xs.map((x, i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <path d={d} stroke={color} strokeWidth="1.25" fill="none" />
    </svg>
  );
}

export function Bars({ data, w = 200, h = 60, color = BL.ink2, max }) {
  const M = max || Math.max(...data);
  const bw = w / data.length;
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      {data.map((v, i) => {
        const bh = (v / M) * (h - 2);
        return <rect key={i} x={i * bw + 1} y={h - bh} width={bw - 2} height={bh} fill={color} opacity={0.85} />;
      })}
    </svg>
  );
}

export function SGMap({ w = 400, h = 220, dots = [], style }) {
  return (
    <svg width={w} height={h} viewBox="0 0 400 220" style={{ display: 'block', ...style }}>
      <rect width="400" height="220" fill={BL.paper} />
      <g stroke={BL.hair} strokeWidth="0.5" strokeDasharray="2 4">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line key={'h' + i} x1={0} y1={i * 28 + 14} x2={400} y2={i * 28 + 14} />
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((i) => (
          <line key={'v' + i} x1={i * 28 + 14} y1={0} x2={i * 28 + 14} y2={220} />
        ))}
      </g>
      <path
        d="M 40 110 Q 60 80 110 78 Q 160 70 210 76 Q 260 80 310 88 Q 350 96 360 116 Q 365 138 330 148 Q 280 158 220 156 Q 160 156 120 152 Q 70 146 50 138 Q 35 126 40 110 Z"
        fill={BL.fill}
        stroke={BL.rule}
        strokeWidth="1"
      />
      {dots.map((d, i) => {
        const c = BL.need[d.need || 'ok'];
        const r = d.r || 14;
        return (
          <g key={i}>
            <circle cx={d.x} cy={d.y} r={r + 6} fill={c.fg} opacity="0.12" />
            <circle cx={d.x} cy={d.y} r={r} fill={c.bg} stroke={c.fg} strokeWidth="1.5" />
            {d.label && (
              <text
                x={d.x}
                y={d.y + 3}
                textAnchor="middle"
                fontFamily={BL.mono}
                fontSize="9"
                fontWeight="600"
                fill={c.fg}
              >
                {d.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function Modal({ open, onClose, children, w = 480 }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute', inset: 0, background: 'rgba(20,18,15,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        animation: 'bl-fade 0.18s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: w, maxHeight: '80%', overflowY: 'auto', background: '#fff',
          borderRadius: 10, padding: 20, fontFamily: 'inherit',
          boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function FanChart() {
  const Wd = 760, Hd = 200, pad = 32;
  const days = 14;
  const px = (i) => pad + (i / (days - 1)) * (Wd - pad * 2);
  const py = (v) => Hd - pad - (v / 12) * (Hd - pad * 1.5);
  const actual = [9.2, 8.8, 7.6, 6.4];
  const p50 = [6.4, 5.6, 5.0, 4.6, 4.2, 3.9, 3.7, 3.5, 3.4, 3.5, 3.7];
  const p05 = [6.4, 5.0, 4.2, 3.6, 3.0, 2.4, 1.9, 1.6, 1.4, 1.3, 1.4];
  const p95 = [6.4, 6.2, 5.9, 5.7, 5.5, 5.4, 5.4, 5.5, 5.6, 5.8, 6.0];
  const fanD =
    p95.map((v, i) => `${i ? 'L' : 'M'} ${px(i + 3)} ${py(v)}`).join(' ') +
    ' ' +
    p05
      .slice()
      .reverse()
      .map((v, j) => `L ${px(days - 1 - j)} ${py(v)}`)
      .join(' ') +
    ' Z';
  const p50D = p50.map((v, i) => `${i ? 'L' : 'M'} ${px(i + 3)} ${py(v)}`).join(' ');
  const actD = actual.map((v, i) => `${i ? 'L' : 'M'} ${px(i)} ${py(v)}`).join(' ');
  return (
    <svg width={Wd} height={Hd} style={{ display: 'block', maxWidth: '100%' }}>
      {[0, 3, 6, 9, 12].map((v) => (
        <g key={v}>
          <line x1={pad} x2={Wd - pad} y1={py(v)} y2={py(v)} stroke={BL.hair} strokeDasharray={v === 3 ? '4 4' : ''} />
          <text x={pad - 8} y={py(v) + 3} textAnchor="end" fontFamily={BL.mono} fontSize="9" fill={BL.muted}>
            {v}d
          </text>
        </g>
      ))}
      {Array.from({ length: days }).map((_, i) => (
        <text key={i} x={px(i)} y={Hd - 12} textAnchor="middle" fontFamily={BL.mono} fontSize="9" fill={BL.muted}>
          {i < 4 ? `D-${3 - i}` : `D+${i - 3}`}
        </text>
      ))}
      <text x={Wd - pad - 4} y={py(3) - 4} textAnchor="end" fontFamily={BL.mono} fontSize="9" fill={BL.redInk}>
        3-DAY BUFFER
      </text>
      <path d={fanD} fill={BL.redSoft} opacity="0.55" />
      <path d={p50D} stroke={BL.red} strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
      <path d={actD} stroke={BL.ink} strokeWidth="2" fill="none" />
      <line x1={px(3)} y1={pad / 2} x2={px(3)} y2={Hd - pad} stroke={BL.ink} strokeDasharray="2 3" opacity="0.5" />
      <text x={px(3)} y={pad / 2 - 2} textAnchor="middle" fontFamily={BL.mono} fontSize="9" fill={BL.ink}>
        NOW
      </text>
    </svg>
  );
}
