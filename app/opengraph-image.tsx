import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/config';

export const runtime = 'nodejs';
export const alt = `${siteConfig.name} — mobile phones and repairs in Guwahati`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0B1220 0%, #102A56 58%, #2563EB 100%)',
          color: 'white',
          padding: 68,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#FF6B2C',
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            F
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1 }}>F-Ex Store</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 68,
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: -3,
            }}
          >
            <div>Your next phone,</div>
            <div>right here in Guwahati.</div>
          </div>
          <div style={{ fontSize: 28, color: '#DCE7FF' }}>
            New & pre-owned · Repairs · EMI · Open daily till 10 PM
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, fontSize: 22 }}>
          <div style={{ padding: '10px 20px', borderRadius: 999, background: '#ffffff22' }}>
            Lokhra
          </div>
          <div style={{ padding: '10px 20px', borderRadius: 999, background: '#ffffff22' }}>
            Basistha
          </div>
          <div style={{ padding: '10px 20px', borderRadius: 999, background: '#ffffff22' }}>
            Est. 2024
          </div>
        </div>
      </div>
    ),
    size,
  );
}
