'use client';
import { useState } from 'react';
import { STAGES, formatCurrency } from '../lib/data';
import StageBadge from './StageBadge';

export default function EditLeadModal({ lead, onClose, onSave, onDelete }) {
  const [form, setForm] = useState({ ...lead });
  const [confirmDelete, setConfirmDelete] = useState(false);

  function set(k, v) { setForm(prev => ({ ...prev, [k]: v })); }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="font-display" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 3 }}>
              Edit Record
            </p>
            <h2 className="font-display" style={{ fontSize: 20, fontWeight: 800, letterSpacing: '0.01em', wordBreak: 'break-word' }}>
              {lead.company}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{lead.project}</p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 22, lineHeight: 1, flexShrink: 0 }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Stage */}
          <div>
            <label className="field-label">Project Stage</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 2 }}>
              {STAGES.map(s => (
                <button
                  key={s}
                  onClick={() => set('stage', s)}
                  style={{
                    background: form.stage === s ? 'rgba(232,146,10,0.15)' : 'var(--surface)',
                    border: form.stage === s ? '1px solid var(--amber)' : '1px solid var(--border-lt)',
                    borderRadius: 2,
                    padding: '5px 12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <StageBadge stage={s} />
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="field-label">Company Name</label>
              <input className="field-input" value={form.company} onChange={e => set('company', e.target.value)} />
            </div>
            <div>
              <label className="field-label">Estimated Value</label>
              <input className="field-input font-mono" type="number" min="0" value={form.value} onChange={e => set('value', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="field-label">Project Name</label>
            <input className="field-input" value={form.project} onChange={e => set('project', e.target.value)} />
          </div>

          <div>
            <label className="field-label">Follow-Up Date</label>
            <input className="field-input" type="date" value={form.followUp} onChange={e => set('followUp', e.target.value)} />
          </div>

          <div>
            <label className="field-label">Notes</label>
            <textarea className="field-input" value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: 10,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--muted)',
                fontSize: 12,
                cursor: 'pointer',
                fontFamily: 'Barlow Condensed',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Delete Record
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#FF6B6B', fontFamily: 'Barlow Condensed', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Confirm delete?
              </span>
              <button
                onClick={() => onDelete(lead.id)}
                style={{ background: '#FF6B6B', border: 'none', color: '#000', borderRadius: 2, padding: '4px 12px', cursor: 'pointer', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}
              >
                Yes, Delete
              </button>
              <button className="btn-ghost" onClick={() => setConfirmDelete(false)} style={{ padding: '4px 10px', fontSize: 12 }}>Cancel</button>
            </div>
          )}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn-amber" onClick={() => onSave({ ...form, value: Number(form.value) })}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
