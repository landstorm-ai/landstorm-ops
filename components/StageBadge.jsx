'use client';
import { STAGE_META } from '../lib/data';

export default function StageBadge({ stage }) {
  const meta = STAGE_META[stage] || { color: '#888', bg: 'rgba(136,136,136,0.1)' };
  return (
    <span
      className="badge"
      style={{ color: meta.color, background: meta.bg }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: meta.dot,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      {stage}
    </span>
  );
}
