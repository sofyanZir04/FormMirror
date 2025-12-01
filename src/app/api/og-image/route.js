import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'Privacy-First Form Analytics';
  const description = searchParams.get('description') || 'Track form behavior without cookies or invasive tracking';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          position: 'relative',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -200,
            right: -200,
            width: 800,
            height: 800,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -300,
            left: -300,
            width: 900,
            height: 900,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: 'linear-gradient(135deg, #3b82f6, #10b981)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              background: 'linear-gradient(to right, #ffffff, #e2e8f0)',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            FormMirror
          </div>
        </div>

        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: '#ffffff',
            textAlign: 'center',
            maxWidth: 900,
            marginBottom: 20,
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: 24,
            color: '#cbd5e1',
            textAlign: 'center',
            maxWidth: 700,
            lineHeight: 1.3,
          }}
        >
          {description}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 40,
            background: 'rgba(255,255,255,0.1)',
            padding: '8px 24px',
            borderRadius: 50,
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#e2e8f0',
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          🔒 No cookies • GDPR compliant • Privacy-first
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}