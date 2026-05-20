import React, { useEffect, useState } from 'react';
import { BL } from '../styles/tokens.js';
import { Tag } from './primitives.jsx';

function useIsCompact(breakpoint = 560) {
  const [compact, setCompact] = useState(
    typeof window === 'undefined' ? false : window.innerWidth < breakpoint
  );
  useEffect(() => {
    const onResize = () => setCompact(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return compact;
}

// Responsive shell: full-screen on phones, framed phone bezel on wider screens.
export function PhoneShell({ children }) {
  const compact = useIsCompact();

  if (compact) {
    return (
      <div
        data-phone
        style={{
          width: '100vw',
          height: '100dvh',
          background: BL.paper,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          fontFamily: BL.sans,
          color: BL.ink,
        }}
      >
        <StatusBar />
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>{children}</div>
      </div>
    );
  }

  // Desktop: phone bezel preview, centered
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#e6e3da',
      }}
    >
      <div
        data-phone
        style={{
          width: 380,
          height: 780,
          borderRadius: 36,
          background: '#111',
          padding: 8,
          boxShadow: '0 1px 0 rgba(0,0,0,0.08), 0 24px 64px rgba(0,0,0,0.15)',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 28,
            background: BL.paper,
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <StatusBar />
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>{children}</div>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 8px' }}>
            <div style={{ width: 110, height: 4, borderRadius: 2, background: BL.ink, opacity: 0.5 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div
      style={{
        height: 32,
        padding: '8px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: BL.mono,
        fontSize: 10,
        color: BL.ink,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      <span>9:41</span>
      <span style={{ color: BL.muted }}>●●● ⌃ ▮</span>
    </div>
  );
}

export function AppHeader({ title, sub, right }) {
  return (
    <div
      style={{
        padding: '8px 16px 12px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}
    >
      <div>
        {sub && <Tag>{sub}</Tag>}
        <div
          style={{
            fontFamily: BL.sans,
            fontSize: 22,
            fontWeight: 600,
            color: BL.ink,
            letterSpacing: -0.4,
            marginTop: sub ? 2 : 0,
          }}
        >
          {title}
        </div>
      </div>
      {right}
    </div>
  );
}
