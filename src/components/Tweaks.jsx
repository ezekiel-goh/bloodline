import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../state/AppState.jsx';

const STYLES = `
  .twk-fab{position:fixed;right:16px;bottom:16px;z-index:2147483646;
    width:42px;height:42px;border-radius:21px;border:0;cursor:pointer;
    background:rgba(20,18,15,.92);color:#fff;font:600 18px/1 -apple-system,system-ui,sans-serif;
    box-shadow:0 6px 20px rgba(0,0,0,.18);display:flex;align-items:center;justify-content:center}
  .twk-fab:hover{background:rgba(20,18,15,1)}
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    background:rgba(250,249,247,.92);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:pointer;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;overflow-y:auto;min-height:0}
  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;background:rgba(0,0,0,.06)}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:pointer;padding:4px 6px;line-height:1.2}
  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);cursor:pointer;padding:0;transition:background .15s}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}
  .twk-btn{appearance:none;height:30px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(20,18,15,.92);color:#fff;font:inherit;font-weight:500;cursor:pointer;width:100%}
  .twk-btn:hover{background:#000}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}
`;

export function TweaksPanel() {
  const { s, set } = useApp();
  const [open, setOpen] = useState(false);
  const [autoSurge, setAutoSurge] = useState(false);
  const styleInjected = useRef(false);

  useEffect(() => {
    if (styleInjected.current) return;
    styleInjected.current = true;
    const el = document.createElement('style');
    el.textContent = STYLES;
    document.head.appendChild(el);
  }, []);

  useEffect(() => {
    if (!autoSurge) return;
    const id = setInterval(() => {
      set((cur) => ({
        surgeActive: !cur.surgeActive,
        surgeActivatedAt: !cur.surgeActive ? new Date().toISOString() : null,
        surgeSnoozed: false,
      }));
    }, 10000);
    return () => clearInterval(id);
  }, [autoSurge, set]);

  if (!open) {
    return (
      <button className="twk-fab" onClick={() => setOpen(true)} aria-label="Open prototype controls" title="Prototype controls">
        ⚙
      </button>
    );
  }

  return (
    <div className="twk-panel" role="dialog" aria-label="Prototype controls">
      <div className="twk-hd">
        <b>BloodLine prototype</b>
        <button className="twk-x" aria-label="Close" onClick={() => setOpen(false)}>
          ✕
        </button>
      </div>
      <div className="twk-body">
        <div className="twk-sect">Demo controls</div>
        <button
          className="twk-btn"
          onClick={() =>
            set((cur) => ({
              surgeActive: !cur.surgeActive,
              surgeActivatedAt: !cur.surgeActive ? new Date().toISOString() : null,
              surgeSnoozed: false,
            }))
          }
        >
          {s.surgeActive ? 'Deactivate Surge Mode' : 'Trigger Surge Mode'}
        </button>
        <button
          className="twk-btn secondary"
          onClick={() =>
            set({
              donorTab: 'home',
              donorScreen: null,
              bookedSlot: null,
              mobStep: 1,
              surgeActive: false,
              surgeSnoozed: false,
              driveRsvps: {},
            })
          }
        >
          Reset prototype
        </button>

        <div className="twk-sect">Donor home</div>
        <Segmented
          label="Home layout"
          value={s.homeVariant}
          options={[
            { value: 'A', label: 'Hero card' },
            { value: 'B', label: 'Timeline' },
          ]}
          onChange={(v) => set({ homeVariant: v })}
        />

        <div className="twk-sect">Auto-play</div>
        <ToggleRow label="Cycle surge every 10s" value={autoSurge} onChange={setAutoSurge} />
      </div>
    </div>
  );
}

function Segmented({ label, value, options, onChange }) {
  const idx = Math.max(0, options.findIndex((o) => o.value === value));
  return (
    <div className="twk-row">
      <div className="twk-lbl">
        <span>{label}</span>
      </div>
      <div className="twk-seg" role="radiogroup">
        <div
          className="twk-seg-thumb"
          style={{
            left: `calc(2px + ${idx} * (100% - 4px) / ${options.length})`,
            width: `calc((100% - 4px) / ${options.length})`,
          }}
        />
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={o.value === value}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ToggleRow({ label, value, onChange }) {
  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl">
        <span>{label}</span>
      </div>
      <button
        type="button"
        className="twk-toggle"
        data-on={value ? '1' : '0'}
        role="switch"
        aria-checked={!!value}
        aria-label={label}
        onClick={() => onChange(!value)}
      >
        <i />
      </button>
    </div>
  );
}
