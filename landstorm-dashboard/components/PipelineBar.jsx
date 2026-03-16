'use client';
import { STAGES, STAGE_META, formatCurrency } from '../lib/data';

export default function PipelineBar({ leads }) {
  const active = leads.filter(l => l.stage !== 'Lost');

  const byStage = STAGES.reduce((acc, s) => {
    const items = active.filter(l => l.stage === s);
    acc[s] = {
      count: items.length,
      value: items.reduce((sum, l) => sum + (Number(l.value) || 0), 0),
    };
    return acc;
  }, {});

  const totalValue = active.reduce((s, l) => s + (Number(l.value) || 0), 0);

  return (
    <div style={{
      background: 'var(--panel)',
      border: '1px solid var(--border)',
      borderRadius: 3,
      padding: '18px 22px',
    }}>
      <p className="font-display" style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14,
      }}>
        Pipeline Breakdown
      </p>

      {/* Segmented bar */}
      <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', gap: 2, marginBottom: 16 }}>
        {STAGES.filter(s => s !== 'Lost').map(s => {
          const pct = totalValue > 0 ? (byStage[s].value / totalValue) * 100 : 0;
          return (
            <div
              key={s}
              title={`${s}: ${formatCurrency(byStage[s].value)}`}
              style={{
                width: `${pct}%`,
                background: STAGE_META[s].dot,
                borderRadius: 4,
                transition: 'width 0.5s ease',
                minWidth: pct > 0 ? 4 : 0,
              }}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {STAGES.map(s => {
          const meta = STAGE_META[s];
          const d = byStage[s] || { count: 0, value: 0 };
          return (
            <div
              key={s}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 2,
                padding: '7px 12px',
                flex: '1 1 140px',
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: meta.dot, flexShrink: 0 }} />
              <div>
                <p className="font-display" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {s}
                </p>
                <p className="font-mono" style={{ fontSize: 12, color: meta.color, marginTop: 1 }}>
                  {d.count} · {formatCurrency(d.value)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
