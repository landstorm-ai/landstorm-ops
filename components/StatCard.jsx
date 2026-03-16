'use client';

export default function StatCard({ label, value, sub, accent, index }) {
  return (
    <div
      className="stat-card"
      style={{
        background: 'var(--panel)',
        border: '1px solid var(--border)',
        borderTop: accent ? `3px solid ${accent}` : '3px solid var(--border)',
        borderRadius: '3px',
        padding: '22px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* faint label watermark */}
      <span
        className="font-display"
        style={{
          position: 'absolute',
          bottom: -6,
          right: 10,
          fontSize: 72,
          fontWeight: 900,
          color: 'rgba(255,255,255,0.03)',
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          letterSpacing: '-2px',
        }}
      >
        {value}
      </span>

      <p
        className="font-display"
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          marginBottom: 10,
        }}
      >
        {label}
      </p>
      <p
        className="font-mono"
        style={{
          fontSize: 38,
          fontWeight: 600,
          color: accent || 'var(--text)',
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {value}
      </p>
      {sub && (
        <p style={{ fontSize: 12, color: 'var(--muted)' }}>{sub}</p>
      )}
    </div>
  );
}
