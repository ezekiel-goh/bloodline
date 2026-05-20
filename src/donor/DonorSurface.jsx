import React from 'react';
import { BL } from '../styles/tokens.js';
import { PhoneShell } from '../components/shells.jsx';
import { useApp, Toast } from '../state/AppState.jsx';
import { DonorHomeA, DonorHomeB, DonorSurgeAlert, DonorTypeDetail } from './DonorHome.jsx';
import { DonorBooking, DonorBookingConfirm, DonorBookingSuccess } from './DonorBooking.jsx';
import { DonorDrives } from './DonorDrives.jsx';
import { DonorImpact } from './DonorImpact.jsx';
import { DonorProfile } from './DonorProfile.jsx';
import { DonorMobilise } from './DonorMobilise.jsx';

const SUB_SCREENS = ['booking', 'booking-confirm', 'booking-success', 'mobilise', 'type-detail'];

export function DonorSurface() {
  const { s } = useApp();

  let body;
  if (s.donorScreen === 'booking') body = <DonorBooking />;
  else if (s.donorScreen === 'booking-confirm') body = <DonorBookingConfirm />;
  else if (s.donorScreen === 'booking-success') body = <DonorBookingSuccess />;
  else if (s.donorScreen === 'type-detail') body = <DonorTypeDetail />;
  else if (s.donorScreen === 'mobilise') body = <DonorMobilise />;
  else if (s.donorTab === 'home') {
    if (s.surgeActive && !s.surgeSnoozed) body = <DonorSurgeAlert />;
    else body = s.homeVariant === 'A' ? <DonorHomeA /> : <DonorHomeB />;
  } else if (s.donorTab === 'drives') body = <DonorDrives />;
  else if (s.donorTab === 'impact') body = <DonorImpact />;
  else if (s.donorTab === 'profile') body = <DonorProfile />;

  const hideTabs = SUB_SCREENS.includes(s.donorScreen);

  return (
    <PhoneShell>
      {body}
      {!hideTabs && <DonorTabBar />}
      <Toast msg={s.toast} />
    </PhoneShell>
  );
}

function DonorTabBar() {
  const { s, set } = useApp();
  const items = [
    { k: 'home', l: 'Home' },
    { k: 'drives', l: 'Drives' },
    { k: 'impact', l: 'Impact' },
    { k: 'profile', l: 'You' },
  ];
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 56,
        background: BL.card,
        borderTop: `1px solid ${BL.hair}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: 8,
      }}
    >
      {items.map((i) => {
        const active = s.donorTab === i.k;
        return (
          <button
            key={i.k}
            onClick={() =>
              set({
                donorTab: i.k,
                donorScreen: null,
                surgeSnoozed: i.k === 'home' ? s.surgeSnoozed : true,
              })
            }
            style={{ textAlign: 'center', flex: 1, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                margin: '0 auto 2px',
                border: `1.5px solid ${active ? BL.ink : BL.faint}`,
                borderRadius: 4,
                background: active ? BL.ink : 'transparent',
              }}
            />
            <div style={{ fontFamily: BL.sans, fontSize: 10, fontWeight: 500, color: active ? BL.ink : BL.faint }}>
              {i.l}
            </div>
          </button>
        );
      })}
    </div>
  );
}
